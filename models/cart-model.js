var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    price:{
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
},
{
 timestamps: true,
});

const Cart = new mongoose.model("Cart", cartSchema)
module.exports = Cart;