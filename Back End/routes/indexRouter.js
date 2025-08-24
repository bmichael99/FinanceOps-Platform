const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const { isAuth } = require("../middlewares/authMiddleware");


indexRouter.get("/", indexController.showHomePage);

module.exports = indexRouter;


