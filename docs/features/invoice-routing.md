# Invoice Routing Logic

The core value of this application is its ability to route Bexio invoices to the correct output channel (EDI, eBill, Email, Print) based on complex business rules.

## Overview

The routing logic is primarily located in `DebtorsService.getInvoiceV2` (retrieval & classification) and `DebtorsService.sendInvoice` (dispatch).

### Routing Flow

```mermaid
flowchart TD
    Start[Request Invoice List] --> Fetch[Fetch Bexio Invoices]
    Fetch --> Resolve[Resolve Channel]
    
    subgraph "Channel Resolution"
        Resolve --> Explicit{Explicit Override?}
        Explicit -- Yes --> LocalDB[Check Local DB]
        Explicit -- No --> Implicit{Check Contact Group}
        
        Implicit -- "EDI Group" --> EDI[EDI Channel]
        Implicit -- "Print Group" --> Print[Print Channel]
        Implicit -- "Email Group" --> Email[Email Channel]
        Implicit -- "eBill Group" --> eBill[eBill Channel]
    end
    
    EDI --> Validation[Validate BC (Business Connection)]
    Validation --> Filter[Filter List by Channel]
    Filter --> Display[Return to UI]
```

## Channel Determination

### 1. Explicit Routing (Overrides)
Invoices can be manually assigned a channel in the UI. This preference is stored in the local `documents_invoice_send` table.
-   **Priority**: High. Overrides implicit group settings.
-   **Logic**: If an invoice ID exists in the local DB with a specific type, it is treated as that type regardless of contact groups.

### 2. Implicit Routing (Contact Groups)
If no explicit override exists, the routing defaults to the Contact's Group in Bexio.
-   **Groups**:
    -   `EDI`: Contacts with valid Business Connections.
    -   `Print` / `Post`: Contacts in the "Print" or "Post" group.
    -   `Email`: Contacts in the "Email" group.
    -   `eBill`: Contacts in the "eBill" group.

### 3. EDI Resolution
EDI is special because it requires a valid technical connection.
-   The system looks up `party_account` -> `companyregistered` -> `contact_bc`.
-   It filters for connections where `type = 'EDI'` and the supported document type is `Invoice`.

## Dispatch Process (`sendInvoice`)

When the user clicks "Send", the backend:
1.  **Groups Invoices**: Splits the request by channel (`emailInvoices`, `printInvoices`, etc.).
2.  **Validates**: Ensures the target channel is valid for each invoice.
3.  **Offloads**: Uses `PushWorkerHost` to process each batch in a background thread.
    -   **Email**: Sends via SMTP (Postmark/SendGrid etc.).
    -   **EDI**: Pushes XML/JSON to the Gate2B/IO-Market API.
    -   **Print**: Queues for the print provider.
