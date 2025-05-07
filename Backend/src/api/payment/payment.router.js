const express = require('express')
const { createPaymentIntent } = require('./payment.controller')
const { authJwt } = require('../../util/common')
const route = express.Router()

route.post("/create-payment", authJwt, createPaymentIntent )

module.exports = route