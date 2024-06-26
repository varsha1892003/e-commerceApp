const express = require('express')
const fs = require('fs')
const Category = require('../models/category-model')
const { env } = require('process');

exports.addCategory = async (req, res) => {
    try {
        let formdata = JSON.parse(req.body.formData)
        const storeId = req.headers.storeid 
        let myfile = null
        if (req.file) {
            myfile = process.env.CATEGORYIMAGE + req.file.filename
        }
        const mycategory = new Category({
            categoryName: formdata.categoryName,
            description: formdata.description,
            images: myfile,
            storeId: storeId,
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
        res.status(500).json(err)
    }
}
exports.updateCategory = async (req, res) => {
    try {
        let allfile = null
        let formdata = JSON.parse(req.body.formData)
        const categoryId = req.body.categoryId
        const category = await Category.findOne({ _id: categoryId })
        if (req.file) {
            if (category.images) {
                const splitimage = category.images[0].split('/').pop()
                const imagePath = './images/categoryImage/' + splitimage
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/categoryImage/' + splitimage)
                    }
                });
                allfile =  process.env.CATEGORYIMAGE + req.file.filename
            }
        }
        else{
            allfile = category.images
        }
        const mydata = await Category.findOneAndUpdate({ _id: categoryId }, {
            $set: {
                categoryName: formdata.categoryName,
                description: formdata.description,
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
        res.status(500).json(err)
    }
}
exports.removeCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId
        const category = await Category.findOne({ _id: categoryId })
        if(category.images){
        const splitimage = category.images[0].split('/').pop()
        console.log(splitimage)
        const imagePath = './images/categoryImage/' + splitimage
        console.log(imagePath)
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Image does not exist');
            } else {
                fs.unlinkSync('./images/categoryImage/' + splitimage)
            }
        });
    }
        const mydata = await Category.findOneAndDelete({ _id: categoryId })

        if (mydata) {
            res.json({ message: 'OK', data: "category remove succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.getCategorys = async (req, res) => {
    try {
        console.log("i am clall")
        const mydata = await Category.find()
        if (mydata && mydata.length > 0) {
            res.status(200).json({ message: "Categories found", data: mydata });
        } else {
            // Send an empty array if no categories are found
            res.status(200).json({ message: "No categories found", data: [] });
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
exports.getOneCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId
        const mydata = await Category.find({ _id: categoryId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({message: "No categories found", data: [] })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}
exports.getCategoryByStore = async (req , res)=>{
    try {
         
        const storeId = req.headers.storeid
        if(storeId){
        const mydata = await Category.find({storeId:storeId})
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({message: "No categories found", data: []})
        }
    }
        else{
            res.status(500).json({message: "not get storeid "})
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}