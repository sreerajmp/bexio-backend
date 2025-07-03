-- Rename columns and retain data for `contact_bc`
ALTER TABLE "contact_bc" ADD COLUMN "accepted_date" TIMESTAMPTZ(6);
UPDATE "contact_bc" SET "accepted_date" = "accepteddate";
ALTER TABLE "contact_bc" DROP COLUMN "accepteddate";

ALTER TABLE "contact_bc" ADD COLUMN "created_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
UPDATE "contact_bc" SET "created_date" = "createddate";
ALTER TABLE "contact_bc" DROP COLUMN "createddate";

ALTER TABLE "contact_bc" ADD COLUMN "invite_code" INTEGER;
UPDATE "contact_bc" SET "invite_code" = "invitecode"::INTEGER;
ALTER TABLE "contact_bc" DROP COLUMN "invitecode";

ALTER TABLE "contact_bc" ADD COLUMN "receiver_customerid" VARCHAR;
UPDATE "contact_bc" SET "receiver_customerid" = "receivercustomerid";
ALTER TABLE "contact_bc" DROP COLUMN "receivercustomerid";

ALTER TABLE "contact_bc" ADD COLUMN "receiver_email" VARCHAR;
UPDATE "contact_bc" SET "receiver_email" = "receiveremail";
ALTER TABLE "contact_bc" DROP COLUMN "receiveremail";

ALTER TABLE "contact_bc" ADD COLUMN "recipient_id" VARCHAR(17);
UPDATE "contact_bc" SET "recipient_id" = "recipientid";
ALTER TABLE "contact_bc" DROP COLUMN "recipientid";

ALTER TABLE "contact_bc" ALTER COLUMN "cid" SET DATA TYPE INTEGER;
ALTER TABLE "contact_bc" ALTER COLUMN "fk_companyregistered" SET DATA TYPE INTEGER;

-- Rename columns for `documents_dispatchnotification_send`
ALTER TABLE "documents_dispatchnotification_send" ADD COLUMN "deliverynotes_number" VARCHAR;
UPDATE "documents_dispatchnotification_send" SET "deliverynotes_number" = "deliverynotesnumber";
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "deliverynotesnumber" CASCADE;

ALTER TABLE "documents_dispatchnotification_send" ADD COLUMN "deliverynotes_params" JSON;
UPDATE "documents_dispatchnotification_send" SET "deliverynotes_params" = "deliverynotesparams"::JSON;
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "deliverynotesparams";

ALTER TABLE "documents_dispatchnotification_send" ADD COLUMN "deliverynotes_type" VARCHAR;
UPDATE "documents_dispatchnotification_send" SET "deliverynotes_type" = "deliverynotestype";
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "deliverynotestype";

ALTER TABLE "documents_dispatchnotification_send" ADD COLUMN "ebill_referenceId" VARCHAR;
UPDATE "documents_dispatchnotification_send" SET "ebill_referenceId" = "ebillReferenceId";
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "ebillReferenceId";

ALTER TABLE "documents_dispatchnotification_send" ADD COLUMN "object_id" UUID DEFAULT gen_random_uuid();
UPDATE "documents_dispatchnotification_send" SET "object_id" = "objectid"::UUID;
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "objectid";

ALTER TABLE "documents_dispatchnotification_send" ADD COLUMN "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
UPDATE "documents_dispatchnotification_send" SET "time_stamp" = "timestamp";
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "timestamp";

-- Rename columns for `documents_invoice_receive`
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "companyname" TO "company_name";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "createddate" TO "created_date";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "documentnumber" TO "document_number";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "grossamount" TO "gross_amount";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "invoicedate" TO "invoice_date";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "netamount" TO "net_amount";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "vendorname" TO "vendor_name";
ALTER TABLE "documents_invoice_receive" RENAME COLUMN "vendorreference" TO "vendor_reference";

ALTER TABLE "documents_invoice_receive" ALTER COLUMN "cid" SET DATA TYPE INTEGER;
ALTER TABLE "documents_invoice_receive" ALTER COLUMN "fk_companyregistered" SET DATA TYPE INTEGER;

-- Rename columns for `documents_invoice_send`
ALTER TABLE "documents_invoice_send" RENAME COLUMN "invoicenumber" TO "invoice_number";
ALTER TABLE "documents_invoice_send" RENAME COLUMN "invoiceparams" TO "invoice_params";
ALTER TABLE "documents_invoice_send" RENAME COLUMN "invoicetype" TO "invoice_type";
ALTER TABLE "documents_invoice_send" RENAME COLUMN "isNotifyed" TO "is_notifyed";
ALTER TABLE "documents_invoice_send" RENAME COLUMN "objectid" TO "object_id";
ALTER TABLE "documents_invoice_send" RENAME COLUMN "referenceId" TO "reference_id";
ALTER TABLE "documents_invoice_send" RENAME COLUMN "timestamp" TO "time_stamp";

ALTER TABLE "documents_invoice_send" ALTER COLUMN "invoice_params" SET DATA TYPE JSON;
ALTER TABLE "documents_invoice_send" ALTER COLUMN "is_notifyed" SET DEFAULT true;
ALTER TABLE "documents_invoice_send" ALTER COLUMN "object_id" SET DEFAULT gen_random_uuid();
ALTER TABLE "documents_invoice_send" ALTER COLUMN "time_stamp" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "documents_invoice_send" ALTER COLUMN "cid" SET DATA TYPE INTEGER;

-- Rename columns for `documents_order_receive`
ALTER TABLE "documents_order_receive" RENAME COLUMN "companyname" TO "company_name";
ALTER TABLE "documents_order_receive" RENAME COLUMN "createddate" TO "created_date";
ALTER TABLE "documents_order_receive" RENAME COLUMN "documentnumber" TO "document_number";
ALTER TABLE "documents_order_receive" RENAME COLUMN "grossamount" TO "gross_amount";
ALTER TABLE "documents_order_receive" RENAME COLUMN "netamount" TO "net_amount";
ALTER TABLE "documents_order_receive" RENAME COLUMN "orderdate" TO "order_date";
ALTER TABLE "documents_order_receive" RENAME COLUMN "vendorname" TO "vendor_name";
ALTER TABLE "documents_order_receive" RENAME COLUMN "vendorreference" TO "vendor_reference";

ALTER TABLE "documents_order_receive" ALTER COLUMN "cid" SET DATA TYPE INTEGER;
ALTER TABLE "documents_order_receive" ALTER COLUMN "fk_companyregistered" SET DATA TYPE INTEGER;

-- Rename columns for `documents_order_send`
ALTER TABLE "documents_order_send" RENAME COLUMN "ebillReferenceId" TO "ebill_referenceId";
ALTER TABLE "documents_order_send" RENAME COLUMN "objectid" TO "object_id";
ALTER TABLE "documents_order_send" RENAME COLUMN "ordernumber" TO "order_number";
ALTER TABLE "documents_order_send" RENAME COLUMN "orderparams" TO "order_params";
ALTER TABLE "documents_order_send" RENAME COLUMN "ordertype" TO "order_type";
ALTER TABLE "documents_order_send" RENAME COLUMN "timestamp" TO "time_stamp";

ALTER TABLE "documents_order_send" ALTER COLUMN "order_params" SET DATA TYPE JSON;
ALTER TABLE "documents_order_send" ALTER COLUMN "object_id" SET DEFAULT gen_random_uuid();
ALTER TABLE "documents_order_send" ALTER COLUMN "time_stamp" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "documents_order_send" ALTER COLUMN "cid" SET DATA TYPE INTEGER;

-- Foreign Keys
ALTER TABLE "contact_bc" ADD CONSTRAINT "contact_bc_fk_companyregistered_fkey" 
FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "documents_dispatchnotification_send" ADD CONSTRAINT "documents_dispatchnotification_send_fk_companyregistered_fkey" 
FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "documents_invoice_receive" ADD CONSTRAINT "documents_invoice_receive_fk_companyregistered_fkey" 
FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "documents_invoice_send" ADD CONSTRAINT "documents_invoice_send_fk_companyregistered_fkey" 
FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "documents_order_receive" ADD CONSTRAINT "documents_order_receive_fk_companyregistered_fkey" 
FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "documents_order_send" ADD CONSTRAINT "documents_order_send_fk_companyregistered_fkey" 
FOREIGN KEY ("fk_companyregistered") REFERENCES "companyregistered"("cid") ON DELETE SET NULL ON UPDATE CASCADE;
-- DropTable
DROP TABLE "bexiocompany";

-- DropTable
DROP TABLE "bexiocompany1";

-- DropTable
DROP TABLE "documents_deliverynotes_send";

-- DropTable
DROP TABLE "user_party_inviteCompany";

ALTER TABLE "companyregistered" ADD COLUMN "object_id" UUID DEFAULT gen_random_uuid();
UPDATE "companyregistered" SET "object_id" = "objectId"::UUID;
ALTER TABLE "companyregistered" DROP COLUMN "objectId";

ALTER TABLE "companyregistered" ADD COLUMN "refresh_token" VARCHAR;
UPDATE "companyregistered" SET "refresh_token" = "refreshtoken";
ALTER TABLE "companyregistered" DROP COLUMN "refreshtoken";

-- Step 1: Add new columns with the same data types
ALTER TABLE "companyregistered" 
ADD COLUMN "is_authorized" BOOLEAN,
ADD COLUMN "authorized_by" INTEGER;

-- Step 2: Copy data from old columns to new columns
UPDATE "companyregistered" 
SET "is_authorized" = "isAuthorized",
    "authorized_by" = "authorizedBy";

-- Step 3: Drop the old columns
ALTER TABLE "companyregistered" 
DROP COLUMN "isAuthorized",
DROP COLUMN "authorizedBy";

ALTER TABLE "companyregistered" ADD COLUMN "created_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
UPDATE "companyregistered" SET "created_date" = "createdDate";
ALTER TABLE "companyregistered" DROP COLUMN "createdDate";