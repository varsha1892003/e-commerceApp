var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    ptice: {
        type: Number
    },
    totalAmount: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        default: "Cash"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    userId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
    },
    Status: {
        type: String,
        default : "Requested"
    },
    address: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
})


const Order = new mongoose.model("Order", orderSchema)
module.exports = Order;