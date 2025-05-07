const mongoose = require("bluebird").promisifyAll(require("mongoose"));
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoosePopulate = require("mongoose-autopopulate");
const Product = require("./product.model");
const User = require("./user.model");

const cart = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: Product,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      }
    },
  ],
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

cart.plugin(mongoosePaginate)
cart.plugin(mongoosePopulate)

module.exports = mongoose.model("cart", cart)