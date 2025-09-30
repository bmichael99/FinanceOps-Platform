const PUB_KEY = fs.readFileSync(__dirname + "/../id_rsa_pub.pem", "utf8");
//const PRIV_KEY = fs.readFileSync(__dirname + "/../id_rsa_priv.pem", "utf8");
import * as db from "../repositories/userRepository";
import fs from "fs";
import jwt from "jsonwebtoken";

export const verifyJWT = (req,res,next) => {
  const authHeader = req.headers['authorization'];
  if(!authHeader){
    return res.sendStatus(401); //unauthorized
  }
  console.log(authHeader); //Bearer token

  const token = authHeader.split(' ')[1];

  jwt.verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, payload) => {
    if (err.name === "TokenExpiredError") {
      res.sendStatus(403);
    }

    if (err.name === "JsonWebTokenError") {
      res.sendStatus(403);
    }

    if (err === null) {
      console.log("Your JWT was successfully validated!");
      req.user = db.getUserById(payload.sub);
    }
    next();
  });
}