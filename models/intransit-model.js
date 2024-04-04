var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const intransitSchema = new mongoose.Schema({
    listName : {
        type:String,
        default :"inprocess"
    },
    orderId:{
        type: Array,
        // required: true,
        default:null
    },
    storeId:{
        type:String,
        default : null
    },
},
    {
        timestamps: true,
    });

const Intransit = new mongoose.model("Intransit", intransitSchema)
module.exports = Intransit;