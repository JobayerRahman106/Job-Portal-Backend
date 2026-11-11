// const { default: mongoose } = require("mongoose");

const mongoose = require('mongoose');

exports.dbConnect = async ()=> {

    try {
      await  mongoose.connect(process.env.DB_URL) 
      console.log("Database is connected")
        
    } catch (error) {
        console.log(error.message || "database connection failed")
    }
}