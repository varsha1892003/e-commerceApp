var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
},
    {
        timestamps: true,
    });

const Category = new mongoose.model("Category", categorySchema)
module.exports = Category;