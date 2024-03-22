var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productData: {
        type: Object, 
        required: true,
    },
    mainStoreId:{
        type: String,
        // required: true,
    },
},
{
 timestamps: true,
});

const Cart = new mongoose.model("Cart", cartSchema)
module.exports = Cart;