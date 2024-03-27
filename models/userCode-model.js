var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const usercodeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    promoCodeId: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    });

const UserCode = new mongoose.model("UserCode", usercodeSchema)
module.exports = UserCode;