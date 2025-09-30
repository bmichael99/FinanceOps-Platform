import * as db from "../repositories/invoiceRepository";
import * as controller from "./mockController";
import { ConfidentialClientApplication } from "@azure/msal-node";
import {Client} from "@microsoft/microsoft-graph-client";
import path from "path";
import fs from "fs";



/**
 * -------------------- SETUP --------------------
 */

const msalConfig = {
  auth: {
    clientId: process.env.AZUREGRAPH_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZUREGRAPH_DIRECTORY_TENANT_ID}`,
    clientSecret: process.env.AZUREGRAPH_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

/**
 * -------------------- LOGIC --------------------
 */

async function getAccessToken() {
  const result = await cca.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  return result.accessToken;
}

export async function createGraphClient() {
  const token = await getAccessToken();
  return Client.init({
    authProvider: (done) => done(null, token),
  });
}



async function downloadFile(graphClient, fileId, savePath) {
  try {
    const arrayBuffer = await graphClient
      .api(`/sites/${process.env.SHAREPOINT_SITE_ID}/drives/${process.env.SHAREPOINT_INVOICES_DRIVE_ID}/items/${fileId}/content`)
      .responseType('arraybuffer') // Ensure we get binary data
      .get();

    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(savePath, buffer);
    console.log(`File saved to ${savePath}`);
  } catch (error) {
    console.error('Download failed:', error.message);
    throw error;
  }
}

export async function listChildren(graphClient, folderId) {
  const response = await graphClient.api(`/sites/${process.env.SHAREPOINT_SITE_ID}/drives/${process.env.SHAREPOINT_INVOICES_DRIVE_ID}/items/${folderId}/children`).get();
  return response.value;
}

export async function getPreview(graphClient,fileId){
  try {
    const response = await graphClient.api(`/sites/${process.env.SHAREPOINT_SITE_ID}/drives/${process.env.SHAREPOINT_INVOICES_DRIVE_ID}/items/${fileId}/preview`).post();
    return response;
  } catch (error) {
    console.error('Get Preview failed:', error.message);
    throw error;
  }
}

export async function traverseAndProcess(graphClient, parentId, level = 0, context = {}) {
  const children = await listChildren(graphClient, parentId);

  for (const item of children) {
    if (item.folder) {
      if (level === 0) {
        // Project folder
        await traverseAndProcess(graphClient, item.id, 1, {
          projectName: item.name,
        });
      } else if (level === 1) {
        // Accounts Payable / Receivable
        await traverseAndProcess(graphClient, item.id, 2, {
          ...context,
          payableOrReceivable: item.name,
        });
      } else if (level === 2) {
        // Paid / Unpaid
        await traverseAndProcess(graphClient, item.id, 3, {
          ...context,
          paidOrUnpaid: item.name,
        });
      } else if(level === 3){
        await traverseAndProcess(graphClient, item.id, 4, {
          ...context,
          paidOrUnpaid: item.name,
        });
      }
    } else if (
      item.file &&
      level >= 3 &&
      (item.name.endsWith(".pdf"))
    ) {
      // Process file

      const { projectName, payableOrReceivable, paidOrUnpaid } = context;
      const fileName = item.name;

      //const filePreview = await getPreview(graphClient, item.id);
      //console.log("filePreview URL:", filePreview);
      
      const invoice = await db.findInvoiceWithFileName(fileName);

      if(invoice && invoice.fileIdSharepoint != item.id){
        const updateInvoice = await db.updateInvoice({fileName, fileIdSharepoint: item.id});

        if(updateInvoice){
          //console.log(fileName, ": updated itemId")
          
        }
      }

      //if a file is moved in Share Point in anyway, update the database to reflect the changes.
      if(invoice && (invoice.paymentStatus != paidOrUnpaid || invoice.invoiceType != payableOrReceivable || invoice.projectName != projectName)){
        const updateInvoice = await db.updateInvoice({fileName,projectName,invoiceType: payableOrReceivable,paymentStatus: paidOrUnpaid});
        if(updateInvoice){
          console.log(fileName, " updated in database");
          await fs.promises.appendFile(path.resolve(__dirname, "../invoices/duplicates.txt"), fileName + "\n");
        }
        continue;
      }
      if(invoice){
        //console.log(fileName, " already exists in database");
        continue;
      }

      const UnprocessedInvoice = await db.findUnprocessedInvoiceWithFileName(fileName);

      if(UnprocessedInvoice && UnprocessedInvoice.fileIdSharepoint != item.id){
        const updateUnprocessedInvoice = await db.updateUnprocessedInvoice({fileName, fileIdSharepoint: item.id});

        if(updateUnprocessedInvoice){
          console.log(fileName, ": updated itemId")
        }
      }

      //if a file is moved in Share Point in anyway, update the database to reflect the changes.
      if(UnprocessedInvoice && (UnprocessedInvoice.paymentStatus != paidOrUnpaid || UnprocessedInvoice.invoiceType != payableOrReceivable || UnprocessedInvoice.projectName != projectName)){
        const updateInvoice = await db.updateUnprocessedInvoice({fileName,projectName,invoiceType: payableOrReceivable,paymentStatus: paidOrUnpaid});
        if(updateInvoice){
          console.log(fileName, " updated in database. Not processed by user yet.");
        }
        continue;
      }
      if(UnprocessedInvoice){
        console.log(fileName, " already exists in database. Not processed by user yet.");
        continue;
      }

      //download file, process file with getDocumentData, then unlink and delete file.
      const tempFilePath = path.resolve(__dirname, "../invoices", fileName);
      await downloadFile(graphClient, item.id, tempFilePath);
      
      await controller.getDocumentData(fileName, projectName, payableOrReceivable, paidOrUnpaid, item.id);
      fs.unlinkSync(tempFilePath);
      console.log(`Processed: ${projectName}/${payableOrReceivable}/${paidOrUnpaid}/${fileName}`);
    }
  }
}