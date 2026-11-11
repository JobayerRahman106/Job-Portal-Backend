require('dotenv').config()
const cors = require('cors')
const express = require('express');
const router = require('./router');
const  {dbConnect}  = require('./config/db');
const apiResponse = require('./utils/apiResponse');
const app = express()

dbConnect()
app.use(express.json())
app.use(cors())
app.use(router)

app.use((err, req, res, next) => {

  const statusCode = err.statusCode || 500; 
  apiResponse(res, statusCode, err.message || 'Internal Server Error')

});


module.exports = app