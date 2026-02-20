# Invoice Routing Logic

The core value of this application is its ability to route Bexio invoices to the correct output channel (EDI, eBill, Email, Print) based on complex business rules.

## Overview

The routing logic is primarily located in `DebtorsService.getInvoiceV2` (retrieval & classification) and `DebtorsService.sendInvoice` (dispatch).

### Routing Flow

```mermaid
flowchart TD
    Start["Request Invoice List"] --> Fetch["Fetch Bexio Invoices"]
    Fetch --> Resolve["Resolve Channel"]

    subgraph "Channel Resolution"
        Resolve --> Explicit{"Explicit Override?"}
        Explicit -- "Yes" --> LocalDB["Check Local DB\n(documents_invoice_send)"]
        Explicit -- "No" --> Implicit{"Check Contact Group\n(getTagName)"}

        Implicit -- "EDI Group" --> EDI["EDI Channel"]
        Implicit -- "Print Group" --> Print["Print Channel"]
        Implicit -- "Email Group" --> Email["Email Channel"]
        Implicit -- "eBill Group" --> eBill["eBill Channel"]
    end

    EDI --> Validation["Validate BC (Business Connection)"]
    Validation --> Filter["Filter List by Channel"]
    Filter --> Display["Return to UI"]
```

## Channel Determination

### 1. Explicit Routing (Overrides)
Invoices can be manually assigned a channel in the UI. This preference is stored in the local `documents_invoice_send` table.
-   **Priority**: High. Overrides implicit group settings.
-   **Logic**: If an invoice ID exists in the local DB with a specific type, it is treated as that type regardless of contact groups.

### 2. Implicit Routing (Contact Groups)
If no explicit override exists, the routing defaults to the Contact's Group in Bexio via `getTagName()`.
-   **Groups**:
    -   `EDI`: Contacts with valid Business Connections.
    -   `Print` / `Post`: Contacts in the "Print" or "Post" group.
    -   `Email`: Contacts in the "Email" group.
    -   `eBill`: Contacts in the "eBill" group.

### 3. EDI Resolution
EDI is special because it requires a valid technical connection.
-   The system looks up `party_account` → `companyregistered` → `contact_bc`.
-   It filters for connections where `type = 'EDI'` and the supported document type is `Invoice`.

---

## Dispatch Process (`sendInvoice`)

`POST /api/v1/debtors/sendInvoice` is the entry point when the user clicks "Send".

### High-Level Dispatch Flow

```mermaid
flowchart TD
    Request["POST /api/v1/debtors/sendInvoice\n{ invoices, emailInvoices, printInvoices, ebillInvoices, otherInvoice }"] --> Decode["Decrypt TOKEN_COOKIE_BEXIO\nExtract userId from JWT"]
    Decode --> Parse["Parse & split invoice arrays\nBuild bodyParams { partyId, accountId, netcomId, userId }"]

    Parse --> P1["1. printInvoices?"]
    Parse --> P2["2. otherInvoice?"]
    Parse --> P3["3. emailInvoices?"]
    Parse --> P4["4. ebillInvoices?"]
    Parse --> P5["5. invoices (EDI)?"]

    P1 --> PrintFlow["Process Print Batch"]
    P2 --> OtherFlow["Auto-detect channel\nvia getTagName()"]
    P3 --> EmailFlow["Process Email Batch"]
    P4 --> EbillFlow["Process eBill Batch"]
    P5 --> EdiFlow["Process EDI Batch"]

    PrintFlow --> Response["Return HTTP 200\n{ combinedResponse }"]
    OtherFlow --> Response
    EmailFlow --> Response
    EbillFlow --> Response
    EdiFlow --> Response
```

> **Worker Mechanism**: All channel dispatches use **`PushWorkerHost.run()`** which sends the job to a persistent **Node.js `worker_threads` Worker** (`push.worker.ts`). The main thread immediately returns HTTP 200 — the actual push happens asynchronously in the background thread.

---

## Per-Channel Process Flow

### Gate2B / EDI Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant DS as DebtorsService
    participant DB as documents_invoice_send DB
    participant W as PushWorkerHost (worker_threads)
    participant HF as helperfn: pushEDIInvoiceProcess
    participant BX as Bexio API
    participant G2B as Gate2B / IO-Market
    participant CB as changeInvoiceSendStatus API

    UI->>DS: POST /sendInvoice { invoices: [...], channel: EDI }
    DS->>DB: setInvoiceSendStatus(partyId, invoiceId, docNum, '1', '', 'EDI', contactId)\nInserts/updates row with status=1 (pending), rk_globaltransaction=UUID
    DS->>W: pushWorkerHost.run(invoices, bodyParams, headerParams, '', 'EDI')
    DS->>UI: HTTP 200 { status: true }

    Note over W,HF: Async - background worker thread
    W->>HF: pushEDIInvoiceProcess(invoices, bodyParams, headerParams)
    HF->>BX: Fetch invoice PDF / XML from Bexio API
    HF->>HF: Build OpenTrans XML (OT) document\n(ORDER or INVOICE format)
    HF->>G2B: POST XML to IO-Market/Gate2B API\n(SOAP or REST endpoint)
    G2B-->>HF: Immediate ACK (reference_id / transactionId returned)
    HF->>DB: Update documents_invoice_send\nset reference_id, rk_globaltransaction

    Note over G2B,CB: Async - external system processes and calls back
    G2B->>CB: POST /api/v1/debtors/changeInvoiceSendStatus\n{ service: 'edi', referenceId, status: 'COMPLETED'/'ERROR' }\n(x-internal-secret header required)
    CB->>DB: Update documents_invoice_send\nstatus = 2 (success) or 0 (error)\nresponse = 'completed' / error reason
    CB->>BX: (if success) Mark invoice as sent in Bexio
```

---

### Email Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant DS as DebtorsService
    participant DB as documents_invoice_send DB
    participant W as PushWorkerHost (worker_threads)
    participant HF as helperfn: pushEmailInvoice
    participant BX as Bexio API
    participant SMTP as Email Service (SMTP/Postmark)

    UI->>DS: POST /sendInvoice { emailInvoices: [...] }
    DS->>DS: Validate bill_recipient_email present
    note right of DS: Invalid emails → setInvoiceSendStatus(status='0', 'email_id_not_found')
    DS->>DB: setInvoiceSendStatus(partyId, doc_id, docNum, '1', '', 'email', contactId)\nstatus=1 (pending), type='email'
    DS->>W: pushWorkerHost.run(inv, bodyParams, { cookies, signedCookies }, '', 'email')
    DS->>UI: HTTP 200

    Note over W,HF: Async - background worker thread
    W->>HF: pushEmailInvoice(invoices, bodyParams, headerParams)
    HF->>BX: Fetch invoice PDF from Bexio API\n(using access_token from cookie)
    HF->>HF: Build email content\n(fetchEmailContent utility)
    HF->>SMTP: Send email with PDF attachment\nto bill_recipient_email
    SMTP-->>HF: Delivery confirmation
    HF->>DB: Update documents_invoice_send\nstatus=2 (sent), response='completed'
```

---

### eBill Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant DS as DebtorsService
    participant MSSQL as MSSQL (biller table)
    participant DB as documents_invoice_send DB
    participant W as PushWorkerHost (worker_threads)
    participant HF as helperfn: pushEbillInvoiceProcess
    participant BX as Bexio API
    participant EB as eBill Platform
    participant CB as changeInvoiceSendStatus API

    UI->>DS: POST /sendInvoice { ebillInvoices: [...] }
    DS->>DS: Validate bill_recipient_email present
    DS->>DS: getTagName(netcomId, invoices, autoTag=true)\nCheck if recipient has eBill subscription (inv.allow)
    note right of DS: inv.allow=false → setInvoiceSendStatus(status='0', 'no_subscription_found')
    DS->>BX: bexioClient.refresh(recipientToken.refresh_token)\nGet fresh access_token for recipient company
    DS->>DB: Update companyregistered refresh_token
    DS->>MSSQL: SELECT billerid FROM biller WHERE netcomid=? AND status='ACTIVE'
    DS->>DB: setInvoiceSendStatus(partyId, doc_id, docNum, '1', '', 'EBILL', contactId)\nstatus=1 (pending), type='EBILL'
    DS->>W: pushWorkerHost.run([invoice], bodyParams, {}, billerid, 'EBILL')
    DS->>UI: HTTP 200\n(also refreshes TOKEN_COOKIE_BEXIO with latest tokens)

    Note over W,HF: Async - background worker thread
    W->>HF: pushEbillInvoiceProcess(invoices, billerId, bodyParams)
    HF->>BX: Fetch invoice data from Bexio API
    HF->>HF: Build eBill-compliant XML / OT document\nAttach biller ID
    HF->>EB: POST document to eBill Platform
    EB-->>HF: Submission ACK (reference_id returned)
    HF->>DB: Update documents_invoice_send\nstatus=1 (in-progress), reference_id set

    Note over EB,CB: Async - eBill platform processes and delivers
    EB->>CB: POST /api/v1/debtors/changeInvoiceSendStatus\n{ service: 'ebill', referenceId, status: 'COMPLETED'/'REJECTED'/'ERROR' }\n(x-internal-secret header required)
    CB->>CB: Map status:\n  COMPLETED → status=2\n  OPEN/APPROVED → status=1\n  REJECTED/ERROR/INCORRECT → status=0
    CB->>DB: Update documents_invoice_send\nstatus, is_notifyed=true, response=technicalReason
    CB->>BX: Mark invoice as sent in Bexio (if completed)
```

---

### Print Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant DS as DebtorsService
    participant DB as documents_invoice_send DB
    participant W as PushWorkerHost (worker_threads)
    participant HF as helperfn: pushPrintInvoice
    participant BX as Bexio API
    participant PP as Print Partner API
    participant CB as changeInvoiceSendStatus API

    UI->>DS: POST /sendInvoice { printInvoices: [...] }
    DS->>DB: setInvoiceSendStatus(partyId, doc_id, docNum, '1', '', 'print', contactId)\nstatus=1 (pending), type='print'
    DS->>W: pushWorkerHost.run(inv, bodyParams, { cookies, signedCookies }, '', 'print')
    DS->>UI: HTTP 200

    Note over W,HF: Async - background worker thread
    W->>HF: pushPrintInvoice(invoices, bodyParams, headerParams)
    HF->>BX: Fetch invoice PDF from Bexio API
    HF->>HF: Build print-ready payload\n(envelope address, PDF, delivery options)
    HF->>PP: POST to Print Partner API
    PP-->>HF: ACK (transactionId returned)
    HF->>DB: Update documents_invoice_send, set reference_id / rk_globaltransaction

    Note over PP,CB: Async - print partner processes and mails
    PP->>CB: POST /api/v1/debtors/changeInvoiceSendStatus\n{ service: 'print', transactionId, status: 'SENT'/'INPROGRESS'/'ERROR' }\n(x-internal-secret header required)
    CB->>CB: Map status:\n  SENT → status=2\n  INPROGRESS → status=1\n  ERROR → status=0, 'print_rejected'
    CB->>DB: Update documents_invoice_send status, is_notifyed=true
```

---

## `changeInvoiceSendStatus` API (Internal Callback)

This endpoint is called by **external services** (eBill platform, Print partner) to asynchronously update invoice delivery status.

| Field | Detail |
|---|---|
| **Endpoint** | `POST /api/v1/debtors/changeInvoiceSendStatus` |
| **Auth** | `x-internal-secret` header must match `INTERNAL_SERVICE_SECRET` env var |
| **Lookup** | Finds `documents_invoice_send` row by `reference_id` OR `rk_globaltransaction` |
| **Bexio Update** | On final success, the Bexio invoice is marked as sent via Bexio REST API |

### Status Mapping

| Service | Incoming Status | Internal Status Code | Meaning |
|---|---|---|---|
| `ebill` | `COMPLETED` | `2` | Delivered successfully |
| `ebill` | `OPEN` / `APPROVED` | `1` | In progress / acknowledged |
| `ebill` | `REJECTED` / `ERROR` / `INCORRECT` | `0` | Failed |
| `print` | `SENT` | `2` | Physically mailed |
| `print` | `INPROGRESS` | `1` | Being processed |
| `print` | `ERROR` | `0` | Failed (`print_rejected`) |

---

## Status Codes in `documents_invoice_send`

| Code | Meaning |
|---|---|
| `1` | Pending / In Progress |
| `2` | Successfully delivered |
| `0` | Failed / Error |
