var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const mainstoreSchema = new mongoose.Schema({
    mainStoreName: {
        type: String , 
        required: true,
    },
},
{
 timestamps: true,
});

const MainStore = new mongoose.model("MainStore", mainstoreSchema)
module.exports = MainStore;