const express = require("express");
const {
  saveUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  loginUser,
} = require("./user.controller");
const { authJwt, isAdmin } = require("../../util/common");
const route = express.Router();

route.post("/save", saveUser);
route.post("/login", loginUser);
route.get("/", authJwt, getAllUsers);
route.get("/:id", authJwt, getUserById);
route.delete("/:id", authJwt, deleteUserById);
route.put("/:id", authJwt, updateUserById);
module.exports = route;
