const express = require('express')
const fs = require('fs')
const Size = require('../models/size-model')

exports.addSize = async (req, res) => {
    try {
        const newsize = new Size({
            name:req.body.name,
            storeId:req.headers.storeid
        });
        const mydata = await newsize.save()
        if (mydata) {
            res.json({ message: 'OK', data: "size add succesfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updateSize = async (req, res) => {
    try {
        const { sizeId, name } = req.body
        const mydata = await Size.findOneAndUpdate({ _id: sizeId }, { $set: { name: name } });

        if (mydata) {
            res.json({ message: 'OK', data: "size update succesfully" })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.removeSize = async (req, res) => {
    try {
        const { sizeId } = req.body
        const mydata = await Size.findOneAndDelete({ _id: sizeId});

        if (mydata) {
            res.json({ message: 'OK', data: "size remove succesfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getSizes = async (req, res) => {
    try {
        const mydata = await Size.find()

        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getOnesize = async (req, res) => {
    try {
        const mydata = await Size.find({ _id: req.body.sizeId })

        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getSizeByStore = async (req, res) => {
    try {

        const storeId = req.headers.storeid
        const mydata = await Size.find({ storeId: storeId })

        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}