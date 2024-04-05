const express = require('express')
const fs = require('fs')
const Notification = require('../models/notification-model')
const { env } = require('process');

exports.addNotification = async (req, res) => {
    try {
        const mynotification = new Notification(req.body);
        const mydata = await mynotification.save()
        if (mydata) {
            res.json({ message: 'OK', data: "notification created" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
 
exports.addBulkNotification = async (req, res) => {
    try {
        for (let i in req.body.userIds) {
            const mynotification = new Notification({
                userId: req.body.userIds[i],
                message: req.body.message
            });
            await mynotification.save()
        }

        if (mydata) {
            res.json({ message: 'OK', data: "notification created" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getNotifications = async (req, res) => {
    try {
        const mydata = await Notification.find()
        if (mydata) {
            res.status(200).json({ message: "ok", data: mydata })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getOneNotification = async (req, res) => {
    try {
        const notificationId = req.body.notificationId
        const mydata = await Notification.findOne({ _id: notificationId })
        if (mydata) {
            res.status(200).json({ message: "ok", data: mydata })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.RemoveNotification = async (req, res) => {
    try {
        const notificationId = req.body.notificationId
        const mydata = await Notification.findOneAndDelete({ _id: notificationId })
        if (mydata) {
            res.status(200).json({ message: "ok", data: "notification remove" })
        }
        else {
            res.status(400).json("no data found")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updateNotification = async (req, res) => {
    try {
        const notificationId = req.body.notificationId
        const mydata = await Notification.findOneAndUpdate({ _id: notificationId }, {
            $set: {
                userId: req.body.userId,
                message: req.body.message,
                // read: req.body.read,
            }
        })
        if (mydata) {
            res.status(200).json({ message: "ok", data: "notification update" })
        }
        else {
            res.status(400).json("no data found")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updateReadNot = async (req, res) => {
    try {
        const notificationId = req.body.notificationId
        const mydata = await Notification.findOneAndUpdate({ _id: notificationId }, {
            $set: {
                read: req.body.read
            }
        })
        if (mydata) {
            res.status(200).json({ message: "ok", data: "notification read by user" })
        }
        else {
            res.status(400).json("no data found")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getUserNotification = async(req , res)=>{
    try {
        const userId = req.body.userId
        const mydata = await Notification.find({userId : userId})
        if (mydata) {
            res.status(200).json({ message: "ok", data: mydata })
        }
        else {
            res.status(400).json({message: "No data found", data: []})
        }
    } catch (err) {
        res.status(500).json(err)
    } 
}


