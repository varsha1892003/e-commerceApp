var mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongodb = require('../database/mongodb')

const productSchema = new mongoose.Schema({
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
  categoryId: {
    type: String,
    //   required: true,
  },
  categoryName: {
    type: String,
    default: null
  },
  storeId: {
    type: String,
  },
  storeName: {
    type: String,
    default: null
  },
  stock: {
    type: Number,
    min: [0, 'wrong min stock'],
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  images: {
    type: Array,
    required: true
  },
  discountPrice: {
    type: Number
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  mainStoreId: {
    type: String,
    // required: true,
  },
  cart:{
    type:String,
     default :"false"
  },
  wishlist: {
    type: String,
    default: false
  }
},
  {
    timestamps: true,
  });

const Product = new mongoose.model("Product", productSchema)
module.exports = Product;