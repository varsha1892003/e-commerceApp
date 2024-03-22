const express = require('express')
const fs = require('fs')
const Deal = require('../models/deal-model')
const { env } = require('process');

exports.addDeal = async (req, res) => {
    try {
        const mydeal = new Deal(req.body);
        const mydata = await mydeal.save()
        if (mydata) {
            res.json({ message: 'OK', data: "deal added succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.removeDeal = async(req , res)=>{
    try {
        const mydata = await Deal.findOneAndDelete({_id:req.body.dealid});
        if (mydata) {
            res.json({ message: 'OK', data: "deal remove done" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}