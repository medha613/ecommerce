const mongoose = require("bluebird").promisifyAll(require("mongoose"));
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoosePopulate = require("mongoose-autopopulate");

const user = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
  },
  role: {
    type: String,
    enum: ["Customer", "Admin", "Vendor"],
    default: "Customer",
  },
});

user.plugin(mongoosePaginate);
user.plugin(mongoosePopulate);
module.exports = mongoose.model("user", user);
