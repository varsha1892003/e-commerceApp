const express = require('express')
const Color = require('../models/color-model')

exports.addColor = async (req, res) => {
    try {
        const newColor = new Color(req.body);
        const mydata = await newColor.save()
        if (mydata) {
            res.json({ message: 'OK', data: "Color add succesfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updateColor = async(req , res)=>{
    try {
        const { ColorId , name , code ,available } = req.body
        const mydata = await Color.findOneAndUpdate({_id : ColorId} , { $set :{name: name , available: available , code: code}});
        
        if (mydata) {
            res.json({ message: 'OK', data: "Color update succesfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }  
}

exports.removeColor = async(req , res)=>{
    try {
        const {ColorId} = req.body
        const mydata = await Color.findOneAndRemove({_id : ColorId});
        
        if (mydata) {
            res.json({ message: 'OK', data: "Color remove succesfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }  
}

exports.getColors = async(req , res) =>{
    try {
        const mydata = await Color.find()
        
        if (mydata) {
            res.json({ message: 'OK', data: mydata})
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    } 
}

exports.getOneColor = async(req , res)=>{
    try {
        const mydata = await Color.findOne({_id : req.body._id})
        
        if (mydata) {
            res.json({ message: 'OK', data: mydata})
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    } 
}
