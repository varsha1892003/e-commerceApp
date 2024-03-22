var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const ColorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true // Ensure each color has a unique code
    },
    available: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
    });

const Color = new mongoose.model("Color", ColorSchema)
module.exports = Color;