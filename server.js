const express = require("express");
const app = express()

const path = require('path')
const PORT = process.env.PORT || 3000

app.use('/',()=>console.log("homepage"))

app.listen(PORT,()=>console.log("Server running"))