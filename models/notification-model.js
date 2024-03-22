var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: String,
        default: false
    },
},
    {
        timestamps: true,
    });

const Notification = new mongoose.model("Notification", notificationSchema)
module.exports = Notification;