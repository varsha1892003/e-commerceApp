var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const promocodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['percentage', 'flat'],
        default: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description :{
        type: String,
        required: true,
    },
    expireDate: {
        type: String,
        required: true,
        default: '',
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    mainstoreid:{
        type: String,
        // required: true,
        default:null
    }
},
    {
        timestamps: true,
    });

const Promocode = new mongoose.model("Promocode", promocodeSchema)
module.exports = Promocode;