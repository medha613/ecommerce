const express = require('express')
const router = express.Router()

const userRouter = require('./api/user/user.router')
const productRouter = require("./api/product/product.router")
const cartRouter = require("./api/cart/cart.router")
const paymentRouter = require("./api/payment/payment.router")


router.use('/users', userRouter)
router.use("/product", productRouter)
router.use("/cart", cartRouter )
router.use("/payment", paymentRouter)

module.exports= router