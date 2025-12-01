import dotenv from 'dotenv';
dotenv.config();
import path from "path";
import * as db from "../repositories/invoiceRepository";
import * as azure from "./Azure.js";
import { stringToDate } from '../utils/dateParser';

export async function processDocumentData(fileName){
  try{
    const invoicePath = path.resolve(__dirname, "../../uploads",fileName);
    const rawData = await azure.getDocumentData(invoicePath);
    if(!rawData){
      throw new Error("Unable to extract document data with azure");
    }

    let fieldsData = {};

    const documentFields = rawData.documents?.[0]?.fields;

    if(documentFields){
      for (const [fieldName, fieldData] of Object.entries(documentFields)) {
        const content = fieldData?.content?.replace(/\n/g, ' ').trim();
        
        if(fieldName == "InvoiceTotal"){
          fieldsData[fieldName] = parseFloat(fieldData?.content?.replace(/[$,]/g,""));
          continue;
        } else if (fieldName == "InvoiceDate" || fieldName == "DueDate"){
          fieldsData[fieldName] = stringToDate(fieldData?.content);
          continue;
        }

        fieldsData[fieldName] = content;
      }
    }
    
    console.log(fileName, " processing success.");

    return(fieldsData);
  } catch(err){
    console.error(err);
    console.log(fileName, " processing failed.");
    throw new Error("Unable to extract document data with azure");
  }
}
