var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const newordersSchema = new mongoose.Schema({
    listName : {
        type:String,
        default :"new-orders"
    },
    orderId:{
        type: Array,
        // required: true,
        default:null
    }
},
    {
        timestamps: true,
    });

const Neworders = new mongoose.model("Neworders", newordersSchema)
module.exports = Neworders;