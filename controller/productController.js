const express = require('express')
const fs = require('fs')
const Product = require('../models/product-model')
const Store = require('../models/store-model')
const Category = require('../models/category-model')

exports.addProduct = async (req, res) => {
    try {
        const storeId = req.headers.storeid

        const formdata = JSON.parse(req.body.formData)
        const storedata = await Store.findOne({ _id: storeId })

        const categorydata = await Category.findOne({ _id: formdata.categoryId })

        let allfile = []
        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(process.env.PRODUCTIMAGE + req.files[i].filename)
            }
        }
        const product = new Product({
            productName: formdata.productName,
            price: formdata.price,
            description: formdata.description,
            categoryId: formdata.categoryId,
            categoryName: categorydata.categoryName,
            storeId: storeId,
            storeName: storedata.storeName,
            stock: formdata.stock,
            discountPrice: formdata.discountPrice,
            discount: formdata.discount,
            size: formdata.size,
            color: formdata.color,
            images: allfile,
        });
        const mydata = await product.save()
        if (mydata) {
            res.json({ message: 'OK', data: "product add succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.updateProduct = async (req, res) => {
    try {
        let allfile = []
        const formdata = JSON.parse(req.body.formData)
        const productId = req.body.productId
        const product = await Product.findOne({ _id: productId })
        if (product.images) {
            for (const i in product.images) {
                allfile.push(product.images[i])
            }
        }
        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(process.env.PRODUCTIMAGE + req.files[i].filename)
            }
        }
        const mydata = await Product.findOneAndUpdate({ _id: productId}, {
            $set: {
                productName: formdata.productName,
                price: formdata.price,
                description: formdata.description,
                categoryId: formdata.categoryId,
                storeId: formdata.storeId,
                discount: formdata.discount,
                stock: formdata.stock,
                discountPrice: formdata.discountPrice,
                size: formdata.size,
                color : formdata.color,
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
        res.status(500).json(err)
    }
}
exports.removeProduct = async (req, res) => {
    try {
        const productId = req.body.productId
        const product = await Product.findOne({ _id: productId})
        if (product.images.length > 0) {
            for (const i in product.images) {
                const splitimage = product.images[i].split('/').pop()
                let imagePath = './images/productImage/' + splitimage
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/productImage/' + splitimage)
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
        res.status(500).json(err)
    }
}
exports.getProducts = async (req, res) => {
    try {
        const mydata = await Product.find()
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(400).json(err)
    }
}
exports.getOneProduct = async (req, res) => {
    try {
        const productId = req.body.productId
        const mydata = await Product.find({ _id: productId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(400).json(err)
    }
}
exports.getProductByCategory = async (req, res) => {
    try {
        const storeId = req.headers.storeid 
        const categoryId = req.body.categoryId
        if(storeId){
        const mydata = await Product.find({ categoryId: categoryId ,mainStoreId: mainStoreId})
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        }
        else {
            res.status(500).json({message: "No data found", data: []})
        }
    }
    else{
        res.status(500).json({message: "not get storeid "})
    }
    }
    catch (err) {
        res.status(500).json(err)
    }
}
exports.getProductByStore = async (req, res) => {
    try {
        const storeId = req.body.storeId
        if(storeId){
        const mydata = await Product.find({ storeId: storeId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        }
        else {
            res.status(500).json({message: "No data found", data: []})
        }
    }
    else{
        res.status(500).json({message: "not get storeid "})
    }
    }
    catch (err) {
        res.status(500).json(err)
    }
}
exports.getProductByFilter = async (req, res) => {
    try {
        const alldata = []
        // const mainStoreId = req.headers.mainstoreid 
        let query = {};
       
        if (req.body && req.body.pricefrom && req.body.priceto) {
            query.price = {
                $gte: req.body.pricefrom,
                $lte: req.body.priceto,
            };
        }
        if (req.body.color && req.body.color.length > 0) {
            query.color = { $in: req.body.color };
        }
        if (req.body.size && req.body.size.length > 0) {
            query.size = { $in: req.body.size };
        }
        console.log(query)
        const mydata = await Product.find(query);
        
        mydata.forEach(function (product) {
            alldata.push(product)
        });

        if (alldata.length > 0) {
            res.status(200).json({ message: "ok", data: alldata });
        } else {
            res.status(200).json({message: "No data found", data: []});
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.removeProductImage = async (req, res) => {
    try {
        const newimages = []
        const productId = req.body.productId
        const imageUrl = req.body.imageUrl

        const product = await Product.findOne({ _id: productId })
        if (product.images) {
            for (const i in product.images) {
                if (product.images[i] == imageUrl) {
                    const splitimage = product.images[i].split('/').pop()
                    let imagePath = './images/productImage/' + splitimage
                    fs.access(imagePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            console.error('Image does not exist');

                        } else {
                            fs.unlinkSync('./images/productImage/' + splitimage)

                        }
                    });
                }
                else {
                    newimages.push(product.images[i])
                }
            }
        }
        const mydata = await Product.findOneAndUpdate({ _id: productId }, { $set: { images: newimages } })
        if (mydata) {
            res.status(200).json({ message: "ok", data: "image remove succesfully" })
        }
        else {
            res.status(400).json("Image does not exist")
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
}