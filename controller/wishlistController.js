const express = require('express')
const fs = require('fs')
const Wishlist = require('../models/wishlist-model')
const Product = require('../models/product-model')
const { env } = require('process');

exports.addWishlist = async (req, res) => {
    try {
        const wishlisttrue = "true"
        const mainStoreId = req.headers.mainStoreId 
        let updatewishlistData = []
        const { productId, userId } = req.body
        const wishlist = await Wishlist.findOne({ userId: userId  })
        const iswishlist = await Wishlist.findOne({ userId: userId, "productIds": productId })
        if (!wishlist) {
            const mywishlist = new Wishlist({
                userId: userId,
                productIds: req.body.productId,
                mainStoreId:mainStoreId
            });
            
            const mydata = await mywishlist.save()
            if (mydata) {
                await Product.findOneAndUpdate({ _id: productId }, { $set: { wishlist: wishlisttrue } })
                res.json({ message: 'OK', data: "product add succesfull in wishlist" })
            }
            else {
                res.status(400).json("please try again")
            }
        }
        else if (iswishlist && iswishlist != null) {
            res.status(200).json("product alredy exists in your wishlist")
        }
        else {
            let updateproductIds = []
            if (wishlist.productIds) {
                for (let j in wishlist.productIds) {
                    updateproductIds.push(wishlist.productIds[j])
                }
            }
            if (req.body.productId) {
                updateproductIds.push(productId)
            }
            const updateddata = await Wishlist.findOneAndUpdate({ _id: wishlist._id }, { $set: { productIds: updateproductIds } })
            if (updateddata) {
                await Product.findOneAndUpdate({ _id: productId }, { $set: { wishlist: wishlisttrue } })
                res.status(200).json("wishlist update")
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.removeWishlist = async (req, res) => {
    try {
        const wishlistfalse= "false"
        const { productId, userId } = req.body
        const isproductid = await Wishlist.findOne({ userId: userId, "productIds": productId })
        if (isproductid) {
            let mywishlistData = []
            for (let i in isproductid.productIds)
            {
                if (productId != isproductid.productIds[i]) {
                    mywishlistData.push(isproductid.productIds[i])
                }
            }
            const isupdate = await Wishlist.findOneAndUpdate({ _id: isproductid.id }, { $set: { productIds: mywishlistData } })
            if (isupdate) {
                await Product.findOneAndUpdate({ _id: productId }, { $set: { wishlist: wishlistfalse } })
                res.status(200).json({ message: "ok", data: "product remove from your wishlist" })
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
exports.getUserWishlist = async (req, res) => {
    try {
        const userId = req.body.userId
        const finaldata = []
        const mainStoreId = req.headers.mainStoreId 
        const userwishlist = await Wishlist.findOne({ userId: userId ,mainStoreId:mainStoreId })
        if(userwishlist){
        for (let i in userwishlist.productIds) 
        {
            const productData = await Product.findOne({ _id: userwishlist.productIds[i]})
            finaldata.push(productData)
        }
        res.status(200).json({ message: "ok", data: finaldata })
        }
        else{
            res.status(200).json("please trt again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}