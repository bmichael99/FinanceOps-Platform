import path from "path"; //node module for handling paths
import dotenv from 'dotenv';
dotenv.config();
import prisma from "./config/prisma";
import passport from "passport";
import fs from "fs";
import cookieParser from "cookie-parser";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import cors from "cors";
import type {Request, Response, NextFunction} from "express";
import { PrismaClientKnownRequestError } from "./generated/prisma/runtime/edge";
import { Prisma } from './generated/prisma';
import { MulterError } from "multer";
import { PUB_KEY } from "./config/key";
import { redis } from "./config/redis";

//imports the express framework
import express from "express";

//initalizes the express application
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8000', 'http://frontend:80', process.env.FRONTEND_URL ?? ''], //frontend URL here
  credentials: true,               //enable Set-Cookie and other credentials
};
app.use(cors(corsOptions));

//set the folder containing view templates to ./views
app.set("views", path.join(__dirname, "views"));
//set the view engine to EJS, for rendering .ejs files with res.render()
app.set("view engine", "ejs");

// sets up middleware to serve static files (CSS,images,etc) from
// the public directory
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//parse json into req.body object
app.use(express.json());

//parses form data into req.body
app.use(express.urlencoded({ extended: true }));

//parse cookies
app.use(cookieParser());

/**
 *  -------------------- PASSPORT SETUP --------------------
 */

app.use(passport.initialize());

//asynchronous key, verify identity with public key.

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(), //auth header support
    cookieExtractor,                          //cookie support
  ]),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, async (payload,done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {id: Number(payload.sub)}
      });
      console.log("payload:",payload);
      if (!user) {
        return done(null, false, { message: "Incorrect id" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
});

passport.use(strategy);


/**
 *  -------------------- FAKE DELAY --------------------
 */


app.use(async (_req,_res,next) => {
  if(process.env.NODE_ENV == "dev"){
    await delay(1000);
  }
  
  next();
})

/**
 *  -------------------- SECURITY HEADERS --------------------
 */

app.use((_req: Request, res: Response, next: NextFunction) => {
  //Referrer Policy Header
  res.set("Referrer-Policy", "no-referrer-when-downgrade"); //for dev only

  //Content Security Policy Header
  const CSP = [
    "connect-src 'self' https://accounts.google.com/gsi/",
    "frame-src 'self' https://accounts.google.com/gsi/",
    "script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client",
    "style-src 'self' https://accounts.google.com/gsi/style",
    "default-src 'self' https://accounts.google.com/gsi/"
  ];
  res.set("Content-Security-Policy", CSP.join(" ; "));

  //Cross Origin Opener Policy (COOP) Header
  res.set("Cross-Origin-Opener-Policy", ["same-origin", "same-origin-allow-popups"]);

  next();
});

/**
 *  -------------------- CACHE CONTROL --------------------
 */

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method == "POST" || req.method == "PUT" || req.method == "DELETE"){
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Expires", "0");
  }
  if(req.method == "GET"){
    if (req.path.startsWith("/api")) {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.set("Expires", "0");
    } else {
      res.set("Cache-Control", "max-age=300, must-revalidate")
    }
  }
  next();
});

/**
 *  -------------------- RATE LIMITING --------------------
 */

app.use(rateLimiter({capacity: 20, refillRate: 1, refillInterval: 1, prefix: 'global'})); //up to 20 requests in a burst, refilling token bucket at 1 request per 1 second.

/**
 *  -------------------- ROUTER--------------------
 */

import indexRouter from "./routes/indexRouter";
import usersRouter from "./routes/usersRouter";
import authRouter from "./routes/authRouter";
import refreshRouter from "./routes/refreshRouter";
import invoiceRouter from "./routes/invoiceRouter";
import { delay } from './utils/delay';
import { closeAllConnections } from "./utils/clientHandler";
import { rateLimiter } from "./middlewares/rateLimitMiddleware";

app.use("/api", indexRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/api", refreshRouter);
app.use("/api", invoiceRouter);

/**
 * -------------------- ERROR HANDLING --------------------
 */

app.use((err: any, _req : Request, res : Response, _next : NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if(err.code === 'P2002'){
      console.error("P2002 Prisma error. Unique id already exists");
      return res.status(409).json({success: false, msg: "Unique constraint violation. Some unique id already exists"});
    }

    console.error("Prisma error caught: \n", err);
    return res.status(500).json({error: 'Prisma error.', code: err.code, message: err.message});
  }
  else if (err instanceof MulterError){
    console.error("Multer error caught: \n", err);
    return res.status(400).json({error: 'Multer error, invalid upload.', code: err.code, message: err.message});
  }

  console.error("No custom error catching configured for this error in app.ts: \n", err); // Log unexpected errors
  res.status(500).json({ message: 'Something went wrong' });
});

/**
 *  -------------------- SERVER --------------------
 */

//starts the server and listens on port 3000
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`My Express app - listening on port ${PORT}!`);
});

const shutdown = async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  closeAllConnections();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  //force shutdown if cleanup takes too long
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 5000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);