import prisma from "./repositories/prisma";
import passport from "passport";
import fs from "fs";
import cookieParser from "cookie-parser";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import cors from "cors";
import dotenv from 'dotenv';
import type {Request, Response, NextFunction} from "express";
import { PrismaClientKnownRequestError } from "./generated/prisma/runtime/edge";
import { MulterError } from "multer";
dotenv.config({path: '../.env'});

//console.log(process.env.PING);


//imports the express framework
import express from "express";
//node module for handling paths
import path from "path";
//initalizes the express application
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4173'], // your frontend URL here
  credentials: true,               // enable Set-Cookie and other credentials
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
const pathToKey = path.join(__dirname, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options : StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
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
 *  -------------------- ROUTER--------------------
 */

//serve index router when root is visited
import indexRouter from "./routes/indexRouter";
import usersRouter from "./routes/usersRouter";
import authRouter from "./routes/authRouter";
import refreshRouter from "./routes/refreshRouter";
import invoiceRouter from "./routes/invoiceRouter";

app.use(indexRouter);
app.use(usersRouter);
app.use(authRouter);
app.use(refreshRouter);
app.use(invoiceRouter);

/**
 * -------------------- ERROR HANDLING --------------------
 */

app.use((err: any, _req : Request, res : Response, _next : NextFunction) => {
  if (err instanceof PrismaClientKnownRequestError) {
    if(err.code === 'P2002'){
      
      return res.status(409).json({message: 'Prisma error. Unique id already exists:' + err.message});
    }

    console.error(err);
    return res.status(500).json({error: 'Prisma error.', code: err.code, message: err.message});
  }
  else if (err instanceof MulterError){
    return res.status(400).json({error: 'Multer error, invalid upload.', code: err.code, message: err.message});
  }
  
  console.error(err); // Log unexpected errors
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
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);