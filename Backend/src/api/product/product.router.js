const express = require("express");
const {
  saveProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("./product.controller");
const { authJwt, isAdmin, isVendor } = require("../../util/common");
const route = express.Router();

route.post("/save",  authJwt, isVendor, saveProduct);
route.get("/", getAllProducts);
route.put("/:id", authJwt, isVendor, updateProduct);
route.delete("/:id",  authJwt, isVendor,deleteProduct);
module.exports = route;
