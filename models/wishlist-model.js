var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productIds: {
        type: Array,
        required: true,
    },
    mainStoreId : {
        type:String,
        default:null
        // require :true
    }
},
{
 timestamps: true,
});

const Wishlist = new mongoose.model("Wishlist", wishlistSchema)
module.exports = Wishlist;