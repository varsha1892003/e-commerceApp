var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const storeSchema =  new mongoose.Schema({
    storeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images:{ 
        type : Array, 
    },
    address:{
        type: String
    },  
    ownerName:{
        type:String,
    },
    phone:{
        type:String
    },
},
   {
    timestamps: true,
});

const Store = new mongoose.model("Store", storeSchema)
module.exports = Store;