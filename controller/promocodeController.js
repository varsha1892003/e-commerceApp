const express = require('express')
const { env } = require('process');
const Promocode = require('../models/promocode-model');
const UserCode = require('../models/userCode-model');

exports.addPromoCode = async (req, res) => {
    try {
        const storeId = req.headers.storeid 
        const mypromocode = new Promocode({
            code: req.body.code,
            type: req.body.type,
            amount: req.body.amount,
            description: req.body.description,
            expireDate: req.body.expireDate,
            isActive: req.body.isActive,
            storeId : storeId,

        });
        const mydata = await mypromocode.save()
        if (mydata) {
            res.json({ message: 'OK', data: "Promocode add successfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(422).send({ succes: false, message: 'please enter unique promocode' });
        }
        else {
            res.status(500).json(err)
        }
    }
}
exports.getPromoCodes = async (req, res) => {
    try {
        const mydata = await Promocode.find();
        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.getOnePromoCode = async (req, res) => {
    try {
        const promocodeId = req.body.promocodeId
        const mydata = await Promocode.find({ _id: promocodeId });
        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.updatePromoCode = async (req, res) => {
    try {
        const promocodeId = req.body.promocodeId
        // const mainStoreId = req.headers.mainstoreid 
        const mydata = await Promocode.findOneAndUpdate({ _id: promocodeId },
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
            console.log(mydata)
        if (mydata) {
            res.json({ message: 'OK', data: "promocode update done" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
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
exports.searchPromoCode = async (req, res) => {
    try {
        const code = req.body.Promocode
        const storeId = req.headers.storeid 
        const userId = req.body.userId
        const isActive = "true"
        const mydata = await Promocode.findOne({ code: code , isActive : isActive , storeId:storeId})
        if(mydata){
            const usercode = await UserCode.findOne({userId : userId , promoCodeId : mydata._id})
            if (usercode) {
                res.json({ message: 'OK', data: "you are not able to use promocode"})
            }
            else {
                res.json({ message: 'OK', data: mydata })
            }
        }
        else{
            res.status(400).json("promocode is inactive")
        }
        
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.getPromoCodesByStore = async (req , res)=>{
    try {
        const storeId = req.headers.storeid
        const mydata = await Promocode.find({ storeId: storeId });
        if (mydata) {
            res.json({ message: 'OK', data: mydata })
        }
        else {
            res.json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    } 
}