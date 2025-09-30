// import bcrypt from 'bcryptjs';
// import passport from "passport";
// import * as db from "../repositories/userRepository"
import dotenv from 'dotenv';
import { Request, Response } from 'express';


dotenv.config();

export const showHomePage = (_req : Request, res : Response) => {
  res.render('index', {title: 'Express Template!'});
};

// export const SignUpPost = async (req : Request,res : Response, next : NextFunction) => {
//   try{
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     await db.createUser(req.body.first_name, req.body.last_name, req.body.username, hashedPassword);
//     res.redirect("/");
//   }
//   catch(err){
//     return next(err);
//   }
// };

// export const LogInPost = (req : Request,res : Response,next : NextFunction) => {
//     passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/"
//     })(req, res, next);
// };