const express = require('express')
const Payment = require('../models/payment-model')
const { env } = require('process');


exports.getUserPayment = async (req, res) => {
    try {
        const storeId = req.headers.storeid 
        const userId = req.body.userId
        const paymentdata = await Payment.find({ userId: userId , storeId: storeId})
        if (usercart) {
            res.status(200).json({ message: "ok", data: paymentdata })
        } else {
            res.status(200).json("please try again")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.getpayments = async (req, res) => {
    try {
        const storeId = req.headers.storeid 
        const paymentdata = await Payment.find({storeId:storeId})
        if (usercart) {
            res.status(200).json({ message: "ok", data: paymentdata })
        } else {
            res.status(200).json("please try again")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}