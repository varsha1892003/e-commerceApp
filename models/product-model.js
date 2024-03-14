var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const productSchema =  new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId:{
      type: String,
    //   required: true,
    },
    storeId:{
        type: String,
    },
    stock: { 
        type: Number,
        min:[0, 'wrong min stock'], 
        default:0
    },
    images:{ 
        type :Array, 
        required: true
    },
    discountPrice: { 
        type: Number
    },
},
   {
    timestamps: true,
});

const Product = new mongoose.model("Product", productSchema)
module.exports = Product;