/*
  Warnings:

  - The primary key for the `contact_bc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `cid` on the `contact_bc` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `documents_invoice_receive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `cid` on the `documents_invoice_receive` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `documents_invoice_send` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `cid` on the `documents_invoice_send` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `documents_order_receive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `cid` on the `documents_order_receive` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `documents_order_send` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `cid` on the `documents_order_send` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "contact_bc" DROP CONSTRAINT "contact_bc_pkey",
ALTER COLUMN "cid" TYPE INTEGER,
ADD CONSTRAINT "contact_bc_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_invoice_receive" DROP CONSTRAINT "documents_bill_pkey",
ALTER COLUMN "cid" TYPE INTEGER,
ADD CONSTRAINT "documents_bill_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_invoice_send" DROP CONSTRAINT "companyregistered_invoicesend_pkey",
ALTER COLUMN "cid" TYPE INTEGER,
ADD CONSTRAINT "companyregistered_invoicesend_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_order_receive" DROP CONSTRAINT "documents_order_pkey",
ALTER COLUMN "cid" TYPE INTEGER,
ADD CONSTRAINT "documents_order_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "documents_order_send" DROP CONSTRAINT "companyregistered_ordersend_pkey",
ALTER COLUMN "cid" TYPE INTEGER,
ADD CONSTRAINT "companyregistered_ordersend_pkey" PRIMARY KEY ("cid");
