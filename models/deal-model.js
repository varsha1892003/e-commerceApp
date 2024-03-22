var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type :String,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
},
    {
        timestamps: true,
    });

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;