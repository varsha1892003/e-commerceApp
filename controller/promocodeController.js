const express = require('express')
const { env } = require('process');
const Promocode = require('../models/promocode-model');

exports.addPromoCode = async (req, res) => {
    try {
        // const mainStoreId = req.headers.mainstoreid 
        const mypromocode = new Promocode({
            code: req.body.code,
            type: req.body.type,
            amount: req.body.amount,
            description: req.body.description,
            expireDate: req.body.expireDate,
            isActive: req.body.isActive,
            mainstoreid: req.body.mainstoreid
        });
        const mydata = await mypromocode.save()
        if (mydata) {
            res.json({ message: 'OK', data: "Promocode add successfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.getPromoCodes = async (req, res) => {
    try {
        // const mainStoreId = req.headers.mainstoreid 
        const mydata = await Promocode.find();
        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.getOnePromoCode = async (req, res) => {
    try {
        const promocodeId = req.body.promocodeId
        // const mainStoreId = req.headers.mainstoreid 
        const mydata = await Promocode.findOne({ _id: promocodeId });
        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.updatePromoCode = async (req, res) => {
    try {
        const promocodeId = req.body.promocodeId
        // const mainStoreId = req.headers.mainstoreid 
        const mydata = await Promocode.findOneAndUpadte({ _id: promocodeId },
            {
                $set: {
                    code: req.body.code,
                    type: req.body.type,
                    amount: req.body.amount,
                    description: req.body.description,
                    expireDate: req.body.expireDate,
                    isActive: req.body.isActive
                }
            });
        if (mydata) {
            res.json({ message: 'OK', data: "promocode update done" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.removePromoCode = async (req, res) => {
    try {
        const promocodeId = req.body.promocodeId
        // const mainStoreId = req.headers.mainstoreid 
        const mydata = await Promocode.findOneAndDelete({ _id: promocodeId });
        if (mydata) {
            res.json({ message: 'OK', data: "promocode remove" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}



  