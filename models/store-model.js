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
      required: true,
    },
    images:{ 
        type : Array, 
        required: true
    },
    address:{
        type: String
    },  
    ownerName:{
        type:String,
    },
    phoneNumber:{
        type:String
    }
},
   {
    timestamps: true,
});

const Store = new mongoose.model("Store", storeSchema)
module.exports = Store;