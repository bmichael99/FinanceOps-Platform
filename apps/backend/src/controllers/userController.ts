//import * as db from "../repositories/userRepository";
import dotenv from 'dotenv';
import type {Request, Response} from "express";
dotenv.config();

export const getAllUsers = async (req : Request, res : Response) => {
  console.log(req.user);
  res.status(200).json({success: true, msg: "you are authorized!"});
  //console.log("yuh");
};

// export const createUser = async (req,res) => {

// };

// export const updateUser = async (req,res) => {
//   const {userId} = req.params;
// };

// export const deleteUser = async (req,res) => {
//   const {userId} = req.params;
// };

// export const getUserById = async (req,res) => {
//   const {userId} = req.params;
// };

