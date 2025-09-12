const prisma = require("./repositories/prisma");
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const cookieParser = require('cookie-parser');
var cors = require('cors')
require('dotenv').config();


//imports the express framework
const express = require("express");
//node module for handling paths
const path = require("path");
//initalizes the express application
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // your frontend URL here
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

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

const strategy = new JwtStrategy(options, async (payload,done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {id: payload.sub}
      });
      console.log(payload);
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
const indexRouter = require("./routes/indexRouter");
const usersRouter = require("./routes/usersRouter");
const authRouter = require("./routes/authRouter");
const refreshRouter = require("./routes/refreshRouter");
app.use(indexRouter);
app.use(usersRouter);
app.use(authRouter);
app.use(refreshRouter);

/**
 * -------------------- ERROR HANDLING --------------------
 */

app.use((err, req, res, next) => {
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Username already exists' });
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