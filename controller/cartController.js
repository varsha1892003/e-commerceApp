const express = require('express')
const Cart = require('../models/cart-model')
const { env } = require('process');
const User = require('../models/user-model');
const Product = require('../models/product-model');

exports.addCart = async (req, res) => {
    try {
        const carttrue = "true"
        const storeId = req.headers.storeid 
        let updateproductData = []
        const cart = await Cart.findOne({ userId: req.body.userId})
        const isproductid = await Cart.findOne({ userId: req.body.userId, "productData.productId": req.body.productId , storeId:storeId})
        if (!cart) {
            console.log("i am if")
            const myproductData = []
            if (req.body.productId) {
                const obj = {
                    "productId": req.body.productId,
                    "productQuantity": 1
                }
                myproductData.push(obj)
            }
            const mycart = new Cart({
                userId: req.body.userId,
                productData: myproductData,
                storeId:storeId
            });
            const mydata = await mycart.save()
            if (mydata) {
                await Product.findOneAndUpdate({ _id: req.body.productId }, { $set: { cart: carttrue } })
                res.json({ message: 'OK', data: "Cart add succesfully" })
            }
            else {
                res.status(400).json("please try again")
            }
        }
        else if (isproductid && isproductid != null) {
            res.status(200).json("product alredy exists in your cart")
        }
        else {
            if (cart.productData) {
                for (let j in cart.productData) {
                    updateproductData.push(cart.productData[j])
                }
            }
            if (req.body.productId) {
                const obj = {
                    "productId": req.body.productId,
                    "productQuantity": 1
                }
                updateproductData.push(obj)
            }

            const updateddata = await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { productData: updateproductData } })
            if (updateddata) {
                await Product.findOneAndUpdate({ _id: req.body.productId }, { $set: { cart: carttrue } })
                res.status(200).json("cart update")
            } else {
                res.status(400).json("product not add in cart")
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.getUserCart = async (req, res) => {
    try {
        const storeId = req.headers.storeid 
        const userId = req.body.userId
        const finaldata = []
        const usercart = await Cart.findOne({ userId: userId })
        if (usercart) {
            for (let i in usercart.productData) {
                const newd = {
                    "product": '',
                    "quantity": ''
                }
                const productData = await Product.findOne({ _id: usercart.productData[i].productId } , {storeId:storeId})
                newd.product = productData
                newd.quantity = usercart.productData[i].productQuantity
                finaldata.push(newd)
            }
            res.status(200).json({ message: "ok", data: finaldata })
        } else {
            res.status(200).json("please try again")
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.removeCart = async (req, res) => {
    try {
        const cartId = req.body.cartId
        const mydata = await Cart.findOneAndDelete({ _id: cartId })

        if (mydata) {
            res.json({ message: 'OK', data: "Cart remove successfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity, userId } = req.body
        const isproductid = await Cart.findOne({ userId: userId, "productData.productId": productId })
        if (isproductid) {
            let myproductData = []
            for (let i in isproductid.productData) {
                if (productId == isproductid.productData[i].productId) {
                    const obj = {
                        "productId": isproductid.productData[i].productId,
                        "productQuantity": quantity
                    }
                    myproductData.push(obj)
                }
                else {
                    const obj = {
                        "productId": isproductid.productData[i].productId,
                        "productQuantity": isproductid.productData[i].productQuantity
                    }
                    myproductData.push(obj)
                }
            }
            const isupdate = await Cart.findOneAndUpdate({ _id: isproductid.id }, { $set: { productData: myproductData } })
            if (isupdate) {
                res.status(200).json({ message: "ok", data: "quentity upadeted" })
            } else {
                res.status(400).json("please try again")
            }
        }
        else {
            res.status(400).json("product not found")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}
exports.removeProductFromCart = async (req, res) => {
    try {
        const cartfalse = "false"
        const { productId, userId } = req.body
        const isproductid = await Cart.findOne({ userId: userId, "productData.productId": productId })
        if (isproductid) {
            let myproductData = []
            for (let i in isproductid.productData) {
                if (productId != isproductid.productData[i].productId) {
                    myproductData.push(isproductid.productData[i])
                }
            }
            const isupdate = await Cart.findOneAndUpdate({ _id: isproductid.id }, { $set: { productData: myproductData } })
            if (isupdate) {
                await Product.findOneAndUpdate({ _id: req.body.productId }, { $set: { cart: cartfalse } })
                res.status(200).json({ message: "ok", data: "product remove from your cart" })
            } else {
                res.status(400).json("please try again")
            }
        }
        else {
            res.status(400).json("product not found")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}