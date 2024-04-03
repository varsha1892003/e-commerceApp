var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 50,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 128,
    },
    token: {
        type: String,
        unique: true
    },
    active:{
        type: String,
        default: "FALSE"
    },
    role: {
        type: Number,
        default: "0",
    },
    profilePic: {
        type: Array,
        default: null
    },
    phone: {
        type: Number,
        default: null
    },
    address:{
        type:Array,
        default :null
    },
    gender:{
        type:String,
        default :null
    },
    storeId : {
        type:String,
        // require :true
    }
}, {
    timestamps: true,
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRETKEY)
    this.token = token
    await this.save();
    return token
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log("heo")
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = new mongoose.model("User", userSchema)
module.exports = User;
