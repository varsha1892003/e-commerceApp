const express = require('express')
const fs = require('fs')
const User = require('../models/user-model')
const MainStore = require('../models/mainStore-model')
const Address = require('../models/address-model')
const { env, features } = require('process');

exports.getUsers = async (req, res) => {
    try {
        // const storeId = req.headers.storeId
        const mydata = await User.find()
        if (mydata) {
            res.json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no User found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.addUser = async (req, res) => {
    try {
        const myuser = new User(req.body);
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
        const mydata = await User.findOneAndDelete({ _id: userId })
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
        const addressdata = await Address.find({userId : req.body.userId })
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

exports.addMainStore = async (req, res) => {
    try {

        const mydata = new MainStore({
            mainStoreName: req.body.mainStoreName
        })
        const savedata = await mydata.save()
        if (savedata) {
            res.status(200).json({ message: "ok", data: "main store created" })
        } else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getUsersByStore = async (req, res) => {
    try {
        const storeId = req.body.storeId
        const mydata = await User.find({storeId})
        if (mydata) {
            res.json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no User found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}


