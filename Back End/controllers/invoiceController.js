function createInvoice(req, res) {
  console.log("hello");
  console.log(req.headers["content-type"])
  console.log(req.files);

  res.sendStatus(200);
}


module.exports = {
  createInvoice,
}