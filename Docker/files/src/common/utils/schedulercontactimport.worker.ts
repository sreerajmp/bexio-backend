import { saleforceContactImport } from "../../common/utils/helperfn";
const { parentPort } = require('worker_threads');

if (!parentPort) {
  throw new Error("Worker must be run as a worker thread");
}

parentPort.on("message", async ({ id }) => {
  try {
    const companies: { netcomid: string; companyName: string }[] = JSON.parse(
      process.env.CONTACT_SCHEDULE_COMPANIES || "[]"
    );
   console.log(`companies`,companies);
    for (const company of companies) {
      console.log(`Starting job for ${company.companyName} (${company.netcomid})`);

      // Call your job processor
      await saleforceContactImport(company.netcomid,company.companyName);

      // Notify parent about progress
      parentPort.postMessage({
        id,
        status: "success",
        result: `Processed ${company.companyName} (${company.netcomid})`,
      });
    }
  } catch (error: any) {
    parentPort.postMessage({
      id,
      status: "error",
      error: error.message,
    });
  }
});
