var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const deliveredSchema = new mongoose.Schema({
    listName : {
        type:String,
        default :"deliver"
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

const Delivered = new mongoose.model("Delivered", deliveredSchema)
module.exports = Delivered;