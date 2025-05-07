const express = require('express')
require('./src/config/db')
require('dotenv').config()
const routes  = require('./src/index.routes')
// wihout config, getting error, as such, just dotenv--- it import the package
//but by using config()-- this actually loads the env, vairables from env to process.env

const PORT = 3001;
const app = express();


app.use(express.json())

app.use('/api', routes)

app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`)
})