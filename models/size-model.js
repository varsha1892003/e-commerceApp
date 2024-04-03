var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')


const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    storeId:{
        type: String,
        required: true
    }
    // available: {
    //     type: Boolean,
    //     default: true
    // },
     
},
    {
        timestamps: true,
    });

const Size = new mongoose.model("Size", sizeSchema)
module.exports = Size;