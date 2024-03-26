var mongoose = require('mongoose')
const mongodb = require('../database/mongodb');
const { stringify } = require('querystring');

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        default: null
    },
    totalAmount: {
        type: Number,
        default: null
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
    firstName : {
      type: String, 
    },
    lastName : {
        type: String,  
    },
    phoneNumber: {
        type: Number,
    },
    status: {
        type: String,
        default: "Requested"
    },
    transactionData: {
        type: Object,
        default: null
    },
    promoCode: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    mainStoreId: {
        type: String,
        // required: true,
    },
    transactionData:{
        type:Array,
        require:true
    }
}, {
    timestamps: true,
})

const Order = new mongoose.model("Order", orderSchema)
module.exports = Order;