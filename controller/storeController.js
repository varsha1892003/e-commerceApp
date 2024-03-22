const express = require('express')
const fs = require('fs')
const Store = require('../models/store-model')
const { env } = require('process');

exports.addStore = async (req, res) => {
    const mainStoreId = req.headers.mainstoreid 
    let formdata = JSON.parse(req.body.formData)
    try {
        let allfile = []
        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(process.env.SROTEIMAGE + req.files[i].filename)
            }
        }
        const mystore = new Store({
            storeName: formdata.storeName,
            description: formdata.description,
            address: formdata.address,
            ownerName: formdata.ownerName,
            phone: formdata.phone,
            images: allfile,
            mainStoreId:mainStoreId
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
        res.status(500).json(err)
    }
}
exports.getStores = async (req, res) => {
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
exports.getStoreByStore = async (req, res) => {
    try {
        const mainStoreId = req.headers.mainstoreid
        const mydata = await Store.find({mainStoreId:mainStoreId})
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no Store found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}
exports.removeStore = async (req, res) => {
    try {
        const storeId = req.body.storeId
        const store = await Store.findOne({ _id: storeId })
        if (store.images) {
            for (const i in store.images) {
                const splitimage = store.images[i].split('/').pop()
                let imagePath = './images/storeImage/' + splitimage
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/storeImage/' + splitimage)
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
        res.status(500).json(err)
    }
}
exports.updateStore = async (req, res) => {
    try {
        let fromdata = JSON.parse(req.body.formData)
        let allfile = []
        const storeId = req.body.storeId
        const store = await Store.findOne({ _id: storeId })
        if (store.images) {
            for (const i in store.images) {
                allfile.push(store.images[i])
            }
        }
        if (req.files.length > 0) {
            for (const i in req.files) {
                allfile.push(process.env.SROTEIMAGE  + req.files[i].filename)
            }
        }
        const mydata = await Store.findOneAndUpdate({ _id: storeId }, {
            $set: {
                storeName: fromdata.storeName,
                description: fromdata.description,
                address: fromdata.address,
                ownerName: fromdata.ownerName,
                phone: fromdata.phone,
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
        res.status(500).json(err)
    }
}
exports.getOneStore = async (req, res) => {
    const storeId = req.body.storeId
    try {
        const mydata = await Store.find({ _id: storeId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no Store found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}
exports.removeStoreImage = async (req, res) => {
    try {
        const newimages = []
        const storeId = req.body.storeId
        const imageUrl = req.body.imageUrl
      
        const store = await Store.findOne({ _id: storeId })
        if (store.images) {
            for (const i in store.images) {
                if (store.images[i] == imageUrl) {
                    const splitimage = store.images[i].split('/').pop()
                    let imagePath = './images/storeImage/' + splitimage
                    fs.access(imagePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            console.error('Image does not exist');

                        } else {
                            fs.unlinkSync('./images/storeImage/' + splitimage)

                        }
                    });
                }
                else {
                    newimages.push(store.images[i])
                }
            }
        }
         const mydata = await Store.findOneAndUpdate({ _id: storeId }, {$set: { images: newimages}})
        if (mydata) {
            res.status(200).json({ message: "ok", data: "image remove succesfully" })
        }
        else {
            res.status(400).json("Image does not exist")
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}