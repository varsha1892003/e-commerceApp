const express = require('express')
const fs = require('fs')
const User = require('../models/user-model')
const Address = require('../models/address-model')
const { env, features } = require('process');

exports.getUsers = async (req, res) => {
    try {
        const mydata = await User.find()
        if (mydata) {
            res.json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no User found" })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

exports.addUser = async (req, res) => {
    try {
        const myuser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            storeId: req.headers.storeid
        })
        await myuser.generateAuthToken();
        const mydata = await myuser.save()
        if (mydata) {
            res.json({ message: 'OK', data: "user created" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.removeUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        const storeId = req.body.storeId
        const mydata = await User.findOneAndDelete({ _id: userId, storeId: storeId })
        if (mydata) {
            res.json({ message: "ok", "data": "user remove succesfully" })
        }
        else {
            res.status(500).json({ message: "please try again" })
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const mydata = await User.findOne({ _id: req.body.userId })
        const addressdata = await Address.find({ userId: req.body.userId })
        mydata.address = addressdata
        if (mydata) {
            res.json({ message: "ok", "data": mydata })
        }
        else {
            res.status(500).json({ message: "please try again" })
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
}

exports.getUsersByStore = async (req, res) => {
    try {
        const storeId = req.headers.storeid
        console.log(storeId)
        const mydata = await User.find({ storeId: storeId })
        if (mydata) {
            res.json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no User found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}


