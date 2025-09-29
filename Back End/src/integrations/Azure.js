const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: '../.env' });

const endpoint = process.env.AZURE_ENDPOINT_ADANTA;
const apiKey = process.env.AZURE_API_KEY_ADANTA;

 async function getDocumentData(invoice_path){

  try{
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
    const stream = fs.createReadStream(invoice_path);

    const poller = await client.beginAnalyzeDocument("prebuilt-invoice", stream);
    const result = await poller.pollUntilDone();

    if (!result){
      const failedFilePath = path.resolve(__dirname, "../invoices/failedFiles.txt")
      fs.appendFile(failedFilePath, `No result: ${invoice_path}\n`);
      throw new Error("Failed to analyze document.");
    } 

    return result;
  } catch(err){
    const failedFilePath = path.resolve(__dirname, "../invoices/failedFiles.txt")
    await fs.promises.appendFile(failedFilePath, `Failed to analyze: ${path.basename(invoice_path)}\nReason: ${err?.details?.error?.innererror?.message}\n\n`);
    throw new Error("Failed to analyze document.");
  }
  

  
}

module.exports = {
  getDocumentData
}

