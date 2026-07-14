import { Injectable } from '@nestjs/common';
import { PrismaClientsService } from '../db/prisma-clients.service';
import config from '../common/config/index';
import * as request from 'request';
import { Request, Response } from 'express';
import commonErrors from '../common/utils/commonError'
import status_code from '../common/utils/statusCodes';

import warningMessage from '../common/utils/warningMessage'
const path = require('path')

const { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } =
  PrismaClientsService.getClients();

@Injectable()
export class DashboardService {
  async getTransactionList(req: Request, res: Response): Promise<any> {
    try {
      const formData = req.body;
      const recordsPerPage = parseInt(formData.records_per_page);
      const pageNumber = parseInt(formData.page_number);
      const showFrom = recordsPerPage * (pageNumber - 1);
      const showTo = showFrom + recordsPerPage;

      const partyId = formData.partyId;
      const filterType = formData.type?.toLowerCase();
      const filterTitle = formData.title?.toLowerCase();

      // Fetch data
      const [invoiceSend, invoiceReceive, deliveryNotesSend, orderSend, orderReceive] = await Promise.all([
        connectBexio.documents_invoice_send.findMany({
          where: { companyregistered: { rk_party: Number(partyId) } },
          include: { companyregistered: true },
        }),
        connectBexio.documents_invoice_receive.findMany({
          where: { companyregistered: { rk_party: Number(partyId) } },
          include: { companyregistered: true },
        }),
        connectBexio.documents_dispatchnotification_send.findMany({
          where: { companyregistered: { rk_party: Number(partyId) } },
          include: { companyregistered: true },
        }),
        connectBexio.documents_order_send.findMany({
          where: { companyregistered: { rk_party: Number(partyId) } },
          include: { companyregistered: true },
        }),
        connectBexio.documents_order_receive.findMany({
          where: { companyregistered: { rk_party: Number(partyId) } },
          include: { companyregistered: true },
        }),
      ]);

      console.log("orderSend------------", orderSend);
      console.log("orderReceive------------", orderReceive);


      // Merge all documents into one array
      const mergedData = [
        ...invoiceSend.map((item) => ({
          fk_companyregistered: item.fk_companyregistered,
          rk_invoice: String(item.rk_invoice),
          rk_globaltransaction: item.rk_globaltransaction,
          status: item.status,
          documentnumber: item.invoice_number,
          type: 'invoice',
          timestamp: item.time_stamp,
          companyregistered: item.companyregistered,
          process: 'invoicesend',
          title: '',
          channel: item.invoice_type
        })),
        ...invoiceReceive.map((item) => ({
          fk_companyregistered: item.fk_companyregistered,
          rk_invoice: item.rk_invoice,
          rk_globaltransaction: item.rk_globaltransaction,
          status: item.status,
          documentnumber: item.document_number,
          type: 'invoice',
          timestamp: item.created_date,
          companyregistered: item.companyregistered,
          process: 'invoicereceive',
          title: item.title,
          channel: 'EDI'
        })),
        ...deliveryNotesSend.map((item) => ({
          fk_companyregistered: item.fk_companyregistered,
          rk_invoice: String(item.rk_deliverynotes),
          rk_globaltransaction: item.rk_globaltransaction,
          status: item.status,
          documentnumber: item.deliverynotes_number,
          type: 'deliverynotes',
          timestamp: item.time_stamp,
          companyregistered: item.companyregistered,
          process: 'deliverynotessend',
          title: '',
          channel: item.deliverynotes_type
        })),
        ...orderSend.map((item) => ({
          fk_companyregistered: item.fk_companyregistered,
          rk_invoice: String(item.rk_order),
          rk_globaltransaction: item.rk_globaltransaction,
          status: item.status,
          documentnumber: item.order_number,
          type: 'order',
          timestamp: item.time_stamp,
          companyregistered: item.companyregistered,
          process: 'ordersend',
          title: '',
          channel: item.order_type

        })),
        ...orderReceive.map((item) => ({
          fk_companyregistered: item.fk_companyregistered,
          rk_invoice: item.rk_order,
          rk_globaltransaction: item.rk_globaltransaction,
          status: item.status,
          documentnumber: item.document_number,
          type: 'order',
          timestamp: item.created_date,
          companyregistered: item.companyregistered,
          process: 'orderreceive',
          title: item.title,
          channel: 'EDI'
        })),
      ];


      // STEP 1: Filter only by type — for `totalCounts`
      let baseFilteredData = mergedData.filter((item) => {
        const matchesType = filterType ? item.type.toLowerCase().includes(filterType) : true;
        return matchesType;
      });

      console.log("baseFilteredData---------", baseFilteredData);


      // STEP 2: Filter further with title, doc number, and invoice no — for `filteredCount` and paginated data
      let finalFilteredData: any = baseFilteredData.filter((item) => {
        const searchValue = (filterTitle || '').toString().toLowerCase().trim();

        const docNo = (item.documentnumber || '').toString().toLowerCase().trim();

        const matches =
          docNo.includes(searchValue)

        return matches;
      });
      finalFilteredData = finalFilteredData.map((item) => {
        console.log("finalFilteredData without sorting---------", finalFilteredData);

        if (item.companyregistered && item.companyregistered.refresh_token) {

          const { refresh_token, ...rest } = item.companyregistered;
          return {
            ...item,
            companyregistered: rest,
          };
        }

        return item;
      });

      // Sort by timestamp
      finalFilteredData.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });
      console.log('finalFilteredData count:', finalFilteredData.length);

      // Paginate
      const paginatedData = finalFilteredData.slice(showFrom, showTo);

      console.log("paginatedData---------", paginatedData);


      return res.status(200).json({
        status: 200,
        message: 'Success',
        data: paginatedData,
        totalCounts: baseFilteredData.length,    // Type filter only
        filteredCount: finalFilteredData.length, // Type + search filters
      });


    } catch (error) {
      console.error(error);
      return res.status(200).json({ status: 500, message: 'something_went_wrong' });
    }
  }



  async getplanData(req: Request, res: Response,): Promise<any> {

    let decryptData
    try {

      let result: any = [];
      console.log(req.body);
      decryptData = req.body;
      console.log(decryptData.partyId);
      const validation = async (datas) => {
        if ((!datas.partyId) || (!datas.language)) {
          return false;
        }
        return true
      };

      const validationResult = await validation(decryptData);
      if (!validationResult) {
        return res.status(500).send({
          status_code: 500,
          message: 'missing_params',
          status: false,
        });
      }

      console.log('Fetching objectId for partyId:', decryptData.partyId);

      const objectId = await connectLibrary.$queryRaw<any[]>`
       SELECT objectid FROM party WHERE cid=${Number(decryptData.partyId)}
      `;


      console.log('objectId result:', objectId);

      if (objectId.length > 0) {
        result.push({});

        const fetchActiveplanDetails = await connectLibrary.$queryRaw<any>`
            SELECT  avps."name" AS plan_name
                    ,avp.feature_config->> 'txe' AS txe_limit
                    ,avp.feature_config->> 'connections' AS bc_limit
            FROM party_application_version_plan pavp
            INNER JOIN application_version_plan avp ON pavp.fk_application_version_plan = avp.cid
            INNER JOIN application_version_plan_spr avps ON avps.fk_application_version_plan = avp.cid
            INNER JOIN spr s ON avps.fk_spr = s.cid
            WHERE pavp.fk_party = ${Number(decryptData.partyId)}
            AND s.code = ${decryptData.language}
            AND pavp.enddate >= now()::DATE
            AND avp.active = true
          `;

        if (fetchActiveplanDetails.length > 0) {
          Object.assign(result[0], fetchActiveplanDetails[0]);

          const txeCountResult = await connectLibrary.$queryRaw<any>`
                SELECT SUM(txe) AS txe_count
                FROM analytics
                WHERE "partyObjectid" = ${objectId[0].objectid}::UUID
                AND "paidStatus" = false
                AND reserve = ${0}
                AND active = true
              `;
          if (txeCountResult.length > 0) {
            console.log("txeCountResult:", txeCountResult);
            result[0]["txe_count"] = Number(txeCountResult[0].txe_count) ?? 0;
          }
        }

        const fetchActivePackageDetails = await connectLibrary.$queryRaw<any>`
            SELECT avas."name" AS package_name,
                   pava.balance
            FROM party_application_version_addon pava
            INNER JOIN application_version_addon ava ON pava.fk_application_version_addon = ava.cid
            INNER JOIN application_version_addon_spr avas ON avas.fk_application_version_addon = ava.cid
            INNER JOIN spr s ON avas.fk_spr = s.cid
            WHERE pava.fk_party = ${Number(decryptData.partyId)}
            AND s.code = ${decryptData.language}
            AND pava.enddate >= now()::DATE
            AND ava.active = true
          `;

        if (fetchActivePackageDetails.length > 0) {
          Object.assign(result[0], fetchActivePackageDetails[0]);
        }


        const netcomId = await connectNewGate2b.$queryRaw<any>`
      SELECT e.netcomid AS netcomid
      FROM ediparty e
      WHERE e.rk_party = ${objectId[0].objectid}::UUID
    `;
        if (netcomId.length > 0) {
          console.log(netcomId[0].netcomid);
          let fomdata = {
            netcom_id: netcomId[0].netcomid
          }
          console.log(fomdata);
          let options = {
            'method': 'POST',
            'url': config.GATE2BURL + `get-counts`,
            formData: fomdata
          };
          // new Promise(function (resolve, reject) {
          request(options, async function (error, response, body) {
            //  console.log('counts',response);

            if (!error && response && response.body && JSON.parse(response.body).status == true) {
              console.log("status true");
              Object.assign(result[0], JSON.parse(response.body).data);
            } else {
              console.log("status false", response?.body);
              return res.status(500).json({
                data: [],
                status_code: 500,
                message: 'get_company_list',
                status: true,
              });
            }
            return res.status(status_code.OK).json({
              data: result,
              status_code: 200,
              message: 'get_company_list',
              status: true,
            });
          });
          // });

        }
      }


    } catch (error) {
      let responseValue = JSON.stringify(decryptData)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);

      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        status: false,
      });
    }
  }

}    
