var mongoose = require('mongoose')
const mongodb = require('../database/mongodb');
const { stringify } = require('querystring');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    orderId : {
        type: String,
        required: true,  
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
   
}, {
    timestamps: true,
})

const Payment = new mongoose.model("Payment", paymentSchema)
module.exports = Payment;