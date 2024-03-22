var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const shippedSchema = new mongoose.Schema({
    listName : {
        type:String,
        default :"shipped"
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

const Shipped = new mongoose.model("Shipped", shippedSchema)
module.exports = Shipped;