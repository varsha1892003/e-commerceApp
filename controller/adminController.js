const express = require('express')
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const User = require('../models/user-model')
const Cart = require('../models/cart-model')
const category = require('../models/category-model')
const Order = require('../models/order-model')
const Product = require('../models/product-model')
const Store = require('../models/store-model')
const Category = require('../models/category-model');



exports.addProduct = async (req, res) => {
    try {
        let allfile = []
        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(req.files[i].filename)
            }
        }
        const product = new Product({
            productName: req.body.productName,
            price: req.body.price,
            description: req.body.description,
            categoryId: req.body.categoryId,
            storeId: req.body.storeId,
            stock: req.body.stock,
            discountPrice: req.body.discountPrice,
            images: allfile
        });
        const mydata = await product.save()
        if (mydata) {
            res.json({ message: 'OK', data: "product add succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.addStore = async (req, res) => {
    try {
        let allfile = []
        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(req.files[i].filename)
            }
        }
        const mystore = new Store({
            storeName: req.body.storeName,
            description: req.body.description,
            address: req.body.address,
            ownerName: req.body.ownerName,
            phoneNumber: req.body.phoneNumber,
            images: allfile
        });
        const mydata = await mystore.save()
        if (mydata) {
            res.json({ message: 'OK', data: "store add succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.addCategory = async (req, res) => {
    try {
        const myfile = null
        if(req.file){
            myfile = req.file.filename
        }
        const mycategory = new Category({
            categoryName: req.body.categoryName,
            description: req.body.description,
            images: myfile
        });
        const mydata = await mycategory.save()
        if (mydata) {
            res.json({ message: 'OK', data: "Category add succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.getStore = async (req, res) => {
    try {
        const mydata = await Store.find()
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no Store found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getCategory = async (req, res) => {
    try {
        const mydata = await Category.find()
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no Category found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getOrder = async (req, res) => {
    try {
        const mydata = await Order.find()
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no Order found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getUser = async (req, res) => {
    try {
        const mydata = await User.find()
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no User found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.updateProduct = async (req, res) => {
    try {
        let allfile = []
        const productId = req.body.productId
        const product = await Product.findOne({ _id: productId })
        if (product.images.length > 0) {
            for (const i in product.images) {
                allfile.push(product.images[i])
            }
        }

        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(req.files[i].filename)
            }
        }
        const mydata = await Product.findOneAndUpdate({ _id: productId }, {
            $set: {
                productName: req.body.productName,
                price: req.body.price,
                description: req.body.description,
                categoryId: req.body.categoryId,
                storeId: req.body.storeId,
                stock: req.body.stock,
                discountPrice: req.body.discountPrice,
                images: allfile
            }
        })

        if (mydata) {
            res.json({ message: 'OK', data: "product update succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.removeProduct = async (req, res) => {
    try {
        let allfile = []
        const productId = req.body.productId
        const product = await Product.findOne({ _id: productId })
        if (product.images.length > 0) {
            for (const i in product.images) {
                let imagePath = './images/productImage/' + product.images[i]
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/productImage/' + product.images[i])
                    }
                });
            }
        }
        const mydata = await Product.findOneAndDelete({ _id: productId })

        if (mydata) {
            res.json({ message: 'OK', data: "product remove succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.removeCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId
        const category = await Category.findOne({ _id: categoryId })
        const imagePath = './images/categoryImage/' + category.images

        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Image does not exist');
            } else {
                fs.unlinkSync('./images/categoryImage/' + category.images)
            }
        });

        const mydata = await Category.findOneAndDelete({ _id: categoryId })

        if (mydata) {
            res.json({ message: 'OK', data: "category remove succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        console.log(req.file)
        let allfile = null
        const categoryId = req.body.categoryId
        const category = await Category.findOne({ _id: categoryId })
        const imagePath = './images/categoryImage/' + category.images
        if (req.file) {
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error('Image does not exist');
                } else {
                    fs.unlinkSync('./images/categoryImage/' + category.images)
                }
            });
            allfile = req.file.filename
        }
        else if (category.images) {
            allfile = category.images
        }
        const mydata = await Category.findOneAndUpdate({ _id: categoryId }, {
            $set: {
                categoryName: req.body.categoryName,
                description: req.body.description,
                images: allfile
            }
        })

        if (mydata) {
            res.json({ message: 'OK', data: "Category update succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.removeStore = async (req, res) => {
    try {
        let allfile = []
        const storeId = req.body.storeId
        const store = await Store.findOne({ _id: storeId })
        if (store.images.length > 0) {
            for (const i in store.images) {
                let imagePath = './images/storeImage/' + store.images[i]
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/storeImage/' + store.images[i])
                    }
                });
            }
        }
        const mydata = await Store.findOneAndDelete({ _id: storeId })
        if (mydata) {
            res.json({ message: 'OK', data: "store remove succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}

exports.updateStore = async (req, res) => {
    try {
        let allfile = []
        const storeId = req.body.storeId
        const store = await Store.findOne({ _id: storeId })
        if (req.files) {
            console.log("i am if")
            for (const i in store.images) {
                let imagePath = './images/storeImage/' + store.images[i]
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/storeImage/' + store.images[i])
                    }
                });

            }
            for (const i in req.files) {
                allfile.push(req.files[i].filename)
            }
        }
        else if (store.images) {
            console.log("i am else")
            for (const i in store.images.length) {
                allfile.push(store.images[i].filename)
            }
        }
        const mydata = await Store.findOneAndUpdate({ _id: storeId }, {
            $set: {
                storeName: req.body.storeName,
                description: req.body.description,
                address: req.body.address,
                ownerName: req.body.ownerName,
                phoneNumber: req.body.phoneNumber,
                images: allfile
            }
        })
        if (mydata) {
            res.json({ message: 'OK', data: "store update succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.json({ message: 'OK', data: err })
    }
}