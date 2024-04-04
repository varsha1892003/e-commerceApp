var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    apartment:{
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    storeId:{
        type: String,
        default:null
    }
},
    {
        timestamps: true,
    });

const Address = new mongoose.model("Address", addressSchema)
module.exports = Address;