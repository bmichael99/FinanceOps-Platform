//import db from "../repositories/invoiceRepository";

export function createInvoice(req, res) {
  console.log("hello");
  console.log(req.headers["content-type"])
  //console.log(req.files);

  req.files.forEach(file => {
    console.log(file);
    //TODO: add current status, mimetype, filename, originalname, path, to prisma schema
    //db.createUnprocessedInvoice({fileName: file.originalname, })
  });

  
  res.sendStatus(200);
}