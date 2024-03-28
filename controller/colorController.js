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
        const { colorId , name} = req.body
        const mydata = await Color.findOneAndUpdate({_id : colorId} , { $set :{name: name }});
        
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
        const {colorId} = req.body
        const mydata = await Color.findOneAndDelete({_id : colorId});
        
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
        const mydata = await Color.find({_id : req.body.colorId})
        
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
