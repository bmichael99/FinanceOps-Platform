import * as db from "../repositories/userRepository";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
const PUB_KEY = fs.readFileSync(__dirname + "/../id_rsa_pub.pem", "utf8");
const PRIV_KEY = fs.readFileSync(__dirname + "/../id_rsa_priv.pem", "utf8");



export const handleRefreshToken = async (req,res) => {
  const cookies = req.cookies;
  
  //check for jwt cookie that we saved in http-only
  if(!cookies?.jwt){
    console.log("requesting refresh token: no http-only cookie, sending unauthorized.");
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;

  try{
    const user = await db.getUserByRefreshToken(refreshToken);
    if(!user){
      console.log("requesting refresh token: no user for this refresh token.");
      res.status(403).json({success:false, msg: "Could not find user"});
    }

    jsonwebtoken.verify(refreshToken, PUB_KEY, { algorithms: ["RS256"] }, (err, payload) => {
        if (err || user.id !== payload.sub) {
          res.sendStatus(403);
        }

        const newPayload = {
          sub: user.id,
          iat: Date.now()/1000,
        };
        const expire = "30m";
        const accessToken = "Bearer " + jsonwebtoken.sign(newPayload, PRIV_KEY, {
          expiresIn: expire,
          algorithm: "RS256",
        });
        console.log("requesting refresh token: refresh token provided");
        res.status(200).json({success: true, user: {id: user.id, username: user.username}, accessToken: accessToken, expresIn: expire});
      });

  } catch(err){
    console.log(err);
  }
  
};




