-- AlterTable
ALTER TABLE "contact_bc" DROP CONSTRAINT "contact_bc_pkey",
DROP COLUMN "accepteddate",
DROP COLUMN "createddate",
DROP COLUMN "invitecode",
DROP COLUMN "receivercustomerid",
DROP COLUMN "receiveremail",
DROP COLUMN "recipientid",
ADD COLUMN     "accepted_date" TIMESTAMPTZ(6),
ADD COLUMN     "created_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "docType" VARCHAR,
ADD COLUMN     "invite_code" INTEGER,
ADD COLUMN     "receiver_customerid" VARCHAR,
ADD COLUMN     "receiver_email" VARCHAR,
ADD COLUMN     "recipient_id" VARCHAR(17),
ALTER COLUMN "cid" SET DATA TYPE INTEGER,
ALTER COLUMN "fk_companyregistered" SET DATA TYPE INTEGER,
ADD CONSTRAINT "contact_bc_pkey" PRIMARY KEY ("cid");



-- AlterTable
ALTER TABLE "documents_dispatchnotification_send" DROP COLUMN "deliverynotesnumber" CASCADE,
DROP COLUMN "deliverynotesparams",
DROP COLUMN "deliverynotestype",
DROP COLUMN "ebillReferenceId",
DROP COLUMN "objectid",
DROP COLUMN "timestamp",
ADD COLUMN     "deliverynotes_number" VARCHAR,
ADD COLUMN     "deliverynotes_params" JSON,
ADD COLUMN     "deliverynotes_type" VARCHAR,
ADD COLUMN     "ebill_referenceId" VARCHAR,
ADD COLUMN     "object_id" UUID DEFAULT gen_random_uuid(),
ADD COLUMN     "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "documents_invoice_receive" DROP CONSTRAINT "documents_bill_pkey",
DROP COLUMN "companyname",
DROP COLUMN "createddate",
DROP COLUMN "documentnumber",
DROP COLUMN "grossamount",
DROP COLUMN "invoicedate",
DROP COLUMN "netamount",
DROP COLUMN "vendorname",
DROP COLUMN "vendorreference",
ADD COLUMN     "company_name" VARCHAR,
ADD COLUMN     "created_date" TIMESTAMPTZ(6),
ADD COLUMN     "document_number" VARCHAR,
ADD COLUMN     "gross_amount" DECIMAL,
ADD COLUMN     "invoice_date" TIMESTAMPTZ(6),
ADD COLUMN     "net_amount" DECIMAL,
ADD COLUMN     "vendor_name" VARCHAR,
ADD COLUMN     "vendor_reference" VARCHAR,
ALTER COLUMN "cid" SET DATA TYPE INTEGER,
ALTER COLUMN "fk_companyregistered" SET DATA TYPE INTEGER,
ADD CONSTRAINT "documents_bill_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_invoice_send" DROP CONSTRAINT "companyregistered_invoicesend_pkey",
DROP COLUMN "invoicenumber",
DROP COLUMN "invoiceparams",
DROP COLUMN "invoicetype",
DROP COLUMN "isNotifyed",
DROP COLUMN "objectid",
DROP COLUMN "referenceId",
DROP COLUMN "response",
DROP COLUMN "timestamp",
ADD COLUMN     "invoice_number" VARCHAR,
ADD COLUMN     "invoice_params" JSON,
ADD COLUMN     "invoice_type" VARCHAR,
ADD COLUMN     "is_notifyed" BOOLEAN DEFAULT true,
ADD COLUMN     "object_id" UUID DEFAULT gen_random_uuid(),
ADD COLUMN     "reference_id" VARCHAR,
ADD COLUMN     "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "cid" SET DATA TYPE INTEGER,
ADD CONSTRAINT "companyregistered_invoicesend_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_order_receive" DROP CONSTRAINT "documents_order_pkey",
DROP COLUMN "companyname",
DROP COLUMN "createddate",
DROP COLUMN "documentnumber",
DROP COLUMN "grossamount",
DROP COLUMN "netamount",
DROP COLUMN "orderdate",
DROP COLUMN "vendorname",
DROP COLUMN "vendorreference",
ADD COLUMN     "company_name" VARCHAR,
ADD COLUMN     "created_date" TIMESTAMPTZ(6),
ADD COLUMN     "document_number" VARCHAR,
ADD COLUMN     "gross_amount" DECIMAL,
ADD COLUMN     "net_amount" DECIMAL,
ADD COLUMN     "order_date" TIMESTAMPTZ(6),
ADD COLUMN     "vendor_name" VARCHAR,
ADD COLUMN     "vendor_reference" VARCHAR,
ALTER COLUMN "cid" SET DATA TYPE INTEGER,
ALTER COLUMN "fk_companyregistered" SET DATA TYPE INTEGER,
ADD CONSTRAINT "documents_order_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_order_send" DROP CONSTRAINT "companyregistered_ordersend_pkey",
DROP COLUMN "ebillReferenceId",
DROP COLUMN "objectid",
DROP COLUMN "ordernumber",
DROP COLUMN "orderparams",
DROP COLUMN "ordertype",
DROP COLUMN "timestamp",
ADD COLUMN     "ebill_referenceId" VARCHAR,
ADD COLUMN     "object_id" UUID DEFAULT gen_random_uuid(),
ADD COLUMN     "order_number" VARCHAR,
ADD COLUMN     "order_params" JSON,
ADD COLUMN     "order_type" VARCHAR,
ADD COLUMN     "time_stamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "cid" SET DATA TYPE INTEGER,
ADD CONSTRAINT "companyregistered_ordersend_pkey" PRIMARY KEY ("cid");

-- DropTable
DROP TABLE "bexiocompany";

-- DropTable
DROP TABLE "bexiocompany1";

-- DropTable
DROP TABLE "documents_deliverynotes_send";

-- DropTable
DROP TABLE "user_party_inviteCompany";

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

