require("dotenv").config()
const express = require("express");
const app = express()
const path = require('path')
const {logger, logEvents} = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())



app.use('/',()=>console.log("homepage"))


app.use(errorHandler)

mongoose.connection.once("open",()=>{
    console.log("connected to mongodb")
    app.listen(PORT,()=>console.log("Server running"))
})

mongoose.connection.on("error",err=>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log")
})
