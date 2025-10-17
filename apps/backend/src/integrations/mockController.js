import dotenv from 'dotenv';
dotenv.config();
import path from "path";
import * as db from "../repositories/invoiceRepository";
import {tablesToMarkdown} from "./tablesToMarkdown.js";
import * as azure from "./Azure.js";


// function transformCellsToRows(cells) {
//   const headers = [];
//   const rows = {};

//   for (const cell of cells) {
//     const { kind, content, columnIndex, rowIndex } = cell;

//     if (kind === "columnHeader" && rowIndex === 0) {
//       headers[columnIndex] = content.replace(/\n/g, ' ').trim();
//     } else if (kind === "content") {
//       if (!rows[rowIndex]) rows[rowIndex] = {};
//       const key = headers[columnIndex] || `Column ${columnIndex}`;
//       rows[rowIndex][key] = content.replace(/\n/g, ' ').trim();
//     }
//   }

//   //Remove rows that are entirely empty
//   return Object.values(rows).filter(row => {
//     return Object.values(row).some(value => value && value.trim() !== "");
//   });
// }

function mergeTables(tables){
    for(let i = 0; i < tables.length;i++){
      if(i+1 < tables.length && (tables[i].columnCount == tables[i+1].columnCount)
        && (tables[i]?.cells?.[0]?.boundingRegions?.[0]?.pageNumber+1 == tables[i+1]?.cells?.[0]?.boundingRegions?.[0]?.pageNumber)
      ){
        const current = tables[i];
        const next    = tables[i + 1];

        /* how many rows are already in the current table? */
        const rowOffset = Math.max(
          0,
          ...current.cells.map(c => c.rowIndex + (c.rowSpan ?? 1))
        );

        /* shift next-page cells so they start after the last row */
        const shiftedCells = next.cells.map(cell => ({
          ...cell,
          rowIndex: cell.rowIndex + rowOffset
        }));

        /* merge the cells */
        current.cells.push(...shiftedCells);

        /* update rowCount if you track it */
        if (typeof current.rowCount === 'number') {
          const nextRowCount = Math.max(
            0,
            ...next.cells.map(c => c.rowIndex + (c.rowSpan ?? 1))
          );
          current.rowCount += nextRowCount;
        }

        /* delete the merged table and rewind the index */
        tables.splice(i + 1, 1);
        i--; // so the loop processes the just-extended table again
      }
    }

    return tables;
}

//export async function processDocumentData(fileName, projectName, invoiceType, paymentStatus, fileId){
export async function processDocumentData(fileName){
  try{
    const invoicePath = path.resolve(__dirname, "../../uploads",fileName);
    const rawData = await azure.getDocumentData(invoicePath);
    if(!rawData){
      throw new Error("Unable to extract document data with azure");
    }

    let fieldsData = {};
    //let invoiceTotalConfidence = 1;
    // let fieldConfidences = [];
    const documentFields = rawData.documents?.[0]?.fields;

    if(documentFields){
      for (const [fieldName, fieldData] of Object.entries(documentFields)) {
        const content = fieldData?.content?.replace(/\n/g, ' ').trim();

        // if(fieldName == "InvoiceTotal"){
        //   invoiceTotalConfidence = fieldData?.confidence;
        // }

        // if(fieldData && fieldData.confidence)
        //   fieldConfidences.push({fieldName: fieldName, confidence: fieldData?.confidence});
        
        fieldsData[fieldName] = content;
      }
    }
    //fieldsData['fileName'] = fileName;
    // fieldsData['projectName'] = projectName;
    // fieldsData['invoiceType'] = invoiceType;
    // fieldsData['paymentStatus'] = paymentStatus;

    console.log(fileName, " processing success.");

    return(fieldsData);
    //fieldsData['fileIdSharepoint'] = fileId; //for sharepoint

    //TODO: Change this to update, we create the record when file is first uploaded and keep track of status,
    //update status here as well
    //const storeUnprocessedInvoice = await db.createUnprocessedInvoice({...fieldsData, fieldConfidences});

    //const storeUnprocessedInvoice = await db.updateUnprocessedInvoice({currentProcessingStatus: "SAVING" , ...fieldsData});
    //if(!storeUnprocessedInvoice){
      //throw new Error("Unable to update unprocessed invoice");
    //}

    //convert tables from invoice to markdown then store in db
    //commenting out this code for now, it's used for processing table data if wanted in the future:

    // let tables = mergeTables(rawData.tables);
    // const markdownTables = tablesToMarkdown(tables);
    // for(let table of markdownTables){
    //   //console.log(table);
    //   await db.createUnprocessedInvoiceTable({invoiceTableDataAsMarkdown: table, invoiceId: storeUnprocessedInvoice.id});
    // }

    
  } catch(err){
    console.error(err);
    console.log(fileName, " processing failed.");
    throw new Error("Unable to extract document data with azure");
  }
}

// async function retrieveAllInvoices(){
//   const invoices = await db.getAllInvoices();
//   //console.log(invoices);
//   fs.writeFileSync(
//       path.resolve(__dirname, "../invoices/newinvoice.json"),
//       JSON.stringify(invoices, null, 2)
//   );
// }

// async function retrieveInvoices(){
//   //TODO: grabbing projectName should be based off of sharepoint folder names in the future
//   const graphClient = await graphAPI.createGraphClient();
//   const rootChildren = await graphAPI.listChildren(graphClient, process.env.SHAREPOINT_INVOICES_FOLDER_ID);
//   //console.log(rootChildren);
//   const projectNames = [];

//   for(child of rootChildren){
//     if(child.name != 'Projects')
//       projectNames.push(child.name)
//   }

//   //this could've been done in the above for loop, but who cares
//   const time = new Date();
//   const safeTime = time.toISOString().replace(/[:.]/g, '-');

//   const newPath = path.resolve(__dirname, "../invoiceData", safeTime);
//   fs.mkdirSync(newPath);
  
//   for(project of projectNames){
//     let projectInvoices = await db.getAllInvoicesByProjectName(project);

//     //remove all null [key,value] pairs from objects
//     projectInvoices = projectInvoices.map((invoice) => {
//       const objectArray = Object.entries(invoice).filter(([key, value]) => {
//         return (value !== null && key != "createdAt" && key != "updatedAt");
//       })
//       return Object.fromEntries(objectArray);
//     })
      
    

//     fs.writeFileSync(
//       path.resolve(newPath, `${project}.json`),
//       JSON.stringify(projectInvoices, null, 2)
//     );

//   }
// }

// function manualInvoiceFetchFromFile() {
//   const invoicesRoot = path.join(__dirname, "../invoices");

//   fs.readdir(invoicesRoot, (err, projectFolders) => {
//     if (err) {
//       return console.error("Unable to scan invoices directory:", err);
//     }

//     projectFolders.forEach(projectName => {
//       const projectPath = path.join(invoicesRoot, projectName);

//       if (fs.statSync(projectPath).isDirectory()) {
//         walkProjectFolder(projectName, projectPath);
//       }
//     });
//   });
// }

// function walkProjectFolder(projectName, currentPath) {
//   fs.readdir(currentPath, (err, entries) => {
//     if (err) {
//       return console.error(`Error reading ${currentPath}:`, err);
//     }

//     entries.forEach(async entry => {
//       const entryPath = path.join(currentPath, entry);
//       const relativePath = path.relative(path.join(__dirname, "../invoices"), entryPath);

//       const stat = fs.statSync(entryPath);

//       if (stat.isDirectory()) {
//         // Recurse into subfolder
//         walkProjectFolder(projectName, entryPath);
//       } else {
//         const lowerName = entry.toLowerCase();
//         const isInvoice = lowerName.includes("inv") || lowerName.includes("invoice") || lowerName.includes("receipt");
//         const isPDF = lowerName.endsWith(".pdf") || lowerName.endsWith(".pdf");
//         const maxSizeBytes = 3 * 1024 * 1024; // 3MB

//         if (stat.size > maxSizeBytes) {
//           console.warn(`Skipping large file (>3MB): ${relativePath}`);
//           return;
//         }

//         if (isInvoice && isPDF) {
//           console.log(`Processing: ${relativePath}`);
//           await getDocumentData(relativePath, projectName); // or await, if using async/await
//           //console.log(relativePath, ": ", projectName);
//         } else if (isInvoice && !isPDF) {
//           console.log(`Non-PDF invoice detected, needs conversion: ${relativePath}`);
//           // TODO: Convert this file to PDF
//         }
//       }
//     });
//   });
// }

//manualInvoiceFetchFromFile();
//getDocumentData();
//retrieveInvoices();
