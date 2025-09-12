const { Router } = require("express");
const refreshTokenController = require("../controllers/refreshTokenController");
const refreshRouter = Router();


refreshRouter.get("/refresh", refreshTokenController.handleRefreshToken);

module.exports = refreshRouter;


