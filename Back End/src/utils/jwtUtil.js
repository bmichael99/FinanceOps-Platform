const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const PUB_KEY = fs.readFileSync(__dirname + "/../id_rsa_pub.pem", "utf8");
const PRIV_KEY = fs.readFileSync(__dirname + "/../id_rsa_priv.pem", "utf8");

function issueJWT(user) {
  const user_id = user.id;

  const refreshExpiresIn = "30d";
  const accessExpiresIn = "30m";

  const payload = {
    sub: user_id,
    iat: Date.now()/1000,
  };

  const accessToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: accessExpiresIn,
    algorithm: "RS256",
  });

  const refreshToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: refreshExpiresIn,
    algorithm: "RS256",
  });

  return {
    accessToken: "Bearer " + accessToken,
    refreshToken: refreshToken,
    refreshExpires: refreshExpiresIn,
    accessExpires: accessExpiresIn
  };
}


module.exports = {
  issueJWT,
}