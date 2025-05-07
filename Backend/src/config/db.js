const mongoose = require('mongoose')
const Promise = require('bluebird')
require('dotenv').config()


mongoose.Promise = Promise
const {DB_URL, DB_NAME} = process.env
mongoose.connect(DB_URL,
    { dbName: DB_NAME}
)
.then(()=> console.log("Mongoose connected successfully"))
.catch((err) => console.log("Connection failed", err))
