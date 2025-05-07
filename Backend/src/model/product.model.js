const mongoose = require("bluebird").promisifyAll(require("mongoose"));
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoosePopulate = require("mongoose-autopopulate");

const product = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },
});

product.plugin(mongoosePaginate);
product.plugin(mongoosePopulate);
module.exports = mongoose.model("product", product);
