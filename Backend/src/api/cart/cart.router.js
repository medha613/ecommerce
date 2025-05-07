const express = require('express')
const { addProductToCart, updateCart, getCart, clearCart, checkout } = require('./cart.controller')
const { authJwt } = require('../../util/common')
const route = express.Router()


route.post("/add", authJwt, addProductToCart)
route.post("/update", authJwt, updateCart)
route.get("/", authJwt, getCart)
route.delete("/clear", authJwt, clearCart)
route.get("/checkout", authJwt, checkout)

module.exports = route