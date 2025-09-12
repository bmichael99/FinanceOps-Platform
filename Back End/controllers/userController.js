const { body, validationResult } = require("express-validator");
const db = require("../repositories/userRepository")
require('dotenv').config()

exports.getAllUsers = async (req,res) => {
  //console.log(req.user);
  res.status(200).json({success: true, msg: "you are authorized!"});
  //console.log("yuh");
};

exports.createUser = async (req,res) => {

};

exports.updateUser = async (req,res) => {
  const {userId} = req.params;
};

exports.deleteUser = async (req,res) => {
  const {userId} = req.params;
};

exports.getUserById = async (req,res) => {
  const {userId} = req.params;
};

