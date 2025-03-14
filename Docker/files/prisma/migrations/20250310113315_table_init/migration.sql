-- CreateTable
CREATE TABLE "companyregistered" (
    "cid" SERIAL NOT NULL,
    "object_id" UUID DEFAULT gen_random_uuid(),
    "rk_party" INTEGER,
    "rk_csn" VARCHAR(250),
    "created_date" TIMESTAMPTZ(6),
    "netcomid" VARCHAR,
    "refresh_token" VARCHAR,
    "is_authorized" BOOLEAN,
    "authorized_by" INTEGER,
    "default_tax" VARCHAR,
    "tax_type" VARCHAR,
    "settings" JSON,

    CONSTRAINT "companyregistered_pkey1" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "contact_bc" (
    "cid" BIGSERIAL NOT NULL,
    "fk_companyregistered" INTEGER,
    "rk_contact" INTEGER,
    "rk_businessconnection" INTEGER,
    "rk_party_account" INTEGER,
    "rk_partyreceived" INTEGER,
    "rk_netcomidsender" VARCHAR,
    "sendercustomerid" VARCHAR,
    "rk_netcomidreceived" VARCHAR,
    "receiver_customerid" VARCHAR,
    "receiver_email" VARCHAR,
    "invite_code" INTEGER,
    "created_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "accepted_date" TIMESTAMPTZ(6),
    "status" INTEGER,
    "type" VARCHAR,
    "recipient_id" VARCHAR(17),
    "rk_sendercontactid" BIGINT,
    "rk_receivercontactid" BIGINT,
    "docType" VARCHAR,

    CONSTRAINT "contact_bc_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "documents_dispatchnotification_send" (
    "cid" SERIAL NOT NULL,
    "fk_companyregistered" INTEGER,
    "rk_deliverynotes" BIGINT,
    "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deliverynotes_number" VARCHAR,
    "rk_globaltransaction" UUID,
    "status" INTEGER,
    "sender_contactid" BIGINT,
    "receiver_contactid" BIGINT,
    "deliverynotes_type" VARCHAR,
    "deliverynotes_params" JSON,
    "object_id" UUID DEFAULT gen_random_uuid(),
    "ebill_referenceId" VARCHAR,

    CONSTRAINT "companyregistered_documentsdispatchnotificationsend_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "documents_invoice_receive" (
    "cid" BIGSERIAL NOT NULL,
    "fk_companyregistered" INTEGER NOT NULL,
    "rk_globaltransaction" UUID NOT NULL,
    "rk_invoice" VARCHAR,
    "created_date" TIMESTAMPTZ(6),
    "invoice_date" TIMESTAMPTZ(6),
    "duedate" TIMESTAMPTZ(6),
    "document_number" VARCHAR,
    "gross_amount" DECIMAL,
    "net_amount" DECIMAL,
    "company_name" VARCHAR,
    "vendor_name" VARCHAR,
    "vendor_reference" VARCHAR,
    "title" VARCHAR,
    "status" VARCHAR,
    "filepath" VARCHAR,
    "rk_businessconnection" INTEGER,

    CONSTRAINT "documents_bill_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "documents_invoice_send" (
    "cid" BIGSERIAL NOT NULL,
    "fk_companyregistered" INTEGER,
    "rk_invoice" BIGINT,
    "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "invoice_number" VARCHAR,
    "rk_globaltransaction" UUID,
    "status" INTEGER,
    "sender_contactid" BIGINT,
    "receiver_contactid" BIGINT,
    "invoice_type" VARCHAR,
    "invoice_params" JSON,
    "object_id" UUID DEFAULT gen_random_uuid(),
    "is_notifyed" BOOLEAN DEFAULT true,
    "reference_id" VARCHAR,

    CONSTRAINT "companyregistered_invoicesend_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "documents_order_receive" (
    "cid" BIGSERIAL NOT NULL,
    "fk_companyregistered" INTEGER NOT NULL,
    "rk_globaltransaction" UUID NOT NULL,
    "rk_order" VARCHAR,
    "created_date" TIMESTAMPTZ(6),
    "order_date" TIMESTAMPTZ(6),
    "document_number" VARCHAR,
    "gross_amount" DECIMAL,
    "net_amount" DECIMAL,
    "company_name" VARCHAR,
    "vendor_name" VARCHAR,
    "vendor_reference" VARCHAR,
    "title" VARCHAR,
    "status" VARCHAR,
    "filepath" VARCHAR,
    "rk_businessconnection" INTEGER,

    CONSTRAINT "documents_order_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "documents_order_send" (
    "cid" BIGSERIAL NOT NULL,
    "fk_companyregistered" INTEGER,
    "rk_order" BIGINT,
    "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "order_number" VARCHAR,
    "rk_globaltransaction" UUID,
    "status" INTEGER,
    "sender_contactid" BIGINT,
    "receiver_contactid" BIGINT,
    "order_type" VARCHAR,
    "order_params" JSON,
    "object_id" UUID DEFAULT gen_random_uuid(),
    "ebill_referenceId" VARCHAR,

    CONSTRAINT "companyregistered_ordersend_pkey" PRIMARY KEY ("cid")
);

-- AddForeignKey
ALTER TABLE "contact_bc" ADD CONSTRAINT "contact_bc_fk_companyregistered_fkey" FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_dispatchnotification_send" ADD CONSTRAINT "documents_dispatchnotification_send_fk_companyregistered_fkey" FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_invoice_receive" ADD CONSTRAINT "documents_invoice_receive_fk_companyregistered_fkey" FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_invoice_send" ADD CONSTRAINT "documents_invoice_send_fk_companyregistered_fkey" FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_order_receive" ADD CONSTRAINT "documents_order_receive_fk_companyregistered_fkey" FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_order_send" ADD CONSTRAINT "documents_order_send_fk_companyregistered_fkey" FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;
