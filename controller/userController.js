const express = require('express')
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

const User = require('../models/user-model')
const Cart = require('../models/cart-model')
const Category = require('../models/category-model')
const Order = require('../models/order-model')
const Product = require('../models/product-model')
const Store = require('../models/store-model')


exports.register = async (req, res) => {
    try {
        const myuser = new User(req.body);
        const mytoken = await myuser.generateAuthToken();
        const mydata = await myuser.save()
        sendverkey(myuser.firstName, myuser.email, mytoken)

        res.json({ message: 'OK', data: "please check email" })
    } catch (err) {
        res.status(500).json(err)
    }
}

const sendverkey = async (firstname, email, mytoken) => {
    try {
        const token = jwt.sign({ token: mytoken }, process.env.VERIFICATIONKEY, { expiresIn: '1h' })
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "kemin@hubresolution.com",
                pass: "soed vmkx khtc yfpx",
            }
        });
        const mailOptions = {
            from: "kemin@hubresolution.com",
            to: email,
            subject: "for verification email",
            html: '<p>hy ' + firstname + ', please click the link <a href="' + process.env.newPassPage + token + '/' + email + '">verify email </a> and verify email'


        }
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("mail has been send", info.response);
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.activationKey = async (req, res) => {
    const token = req.headers["token"];
    const email = req.body.email
    const user = jwt.verify(token, process.env.VERIFICATIONKEY);
    if (!user) {
        res.send('activation key expired.');
    } else {
        user.activationKey = undefined;
        const active = "TRUE"
        const data = await User.findOneAndUpdate({ email: email }, { $set: { active: active } })
        if (data) {
            res.json({ message: 'OK', data: "verify suceesfull" })
        }
        else {
            res.status(500).json("user not found")
        }
    }
}

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const active = "TRUE";
        const getuser = await User.findOne({ email: email, active: active })
        if (getuser) {
            const ismatch = await bcrypt.compare(password, getuser.password)
            if (ismatch) {
                res.json({ message: 'OK', data: getuser })
            }
            else {
                res.status(400).json("please enter valid detail")
            }
        } else {
            res.status(400).json("your email is not active")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.getProducts = async (req, res) => {
    try {
        const mydata = await Product.find({})
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no product found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getUserCart = async (req, res) => {
    try {
        const userId = req.body.userId
        const mydata = await Cart.find({ userId: userId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no product found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getUserOrder = async (req, res) => {
    try {
        const userId = req.body.userId
        const mydata = await Order.find({ userId: userId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no order found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getOneProduct = async (req, res) => {
    try {
        const productId = req.body.productId
        const mydata = await Product.find({ _id: productId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json({ message: "no Product found" })
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.addOrder = async (req, res) => {
    try {
        const myorder = new Order({
            productId: req.body.productId,
            price: req.body.price,
            quantity: req.body.quantity,
            totalAmount: Number(req.body.price) * Number(req.body.quantity),
            paymentMethod: req.body.paymentMethod,
            paymentStatus: req.body.paymentStatus,
            Status: req.body.Status,
            userId: req.body.userId,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address
        });
        const mydata = await myorder.save()
        if (mydata) {
            res.json({ message: 'OK', data: "Order add succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.addCart = async (req, res) => {
    try {
        const mycart = new Cart({
            userId: req.body.userId,
            productId: req.body.productId,
            quantity: req.body.quantity,
            price: req.body.price,
            totalPrice: Number(req.body.price) * Number(req.body.quantity)
        });
        const mydata = await mycart.save()
        if (mydata) {
            res.json({ message: 'OK', data: "Cart add succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.removeCart = async (req, res) => {
    try {
        const cartId = req.body.cartId
        const mydata = await Cart.findOneAndDelete({ _id: cartId })

        if (mydata) {
            res.json({ message: 'OK', data: "Cart remove succesfully" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getProductByCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId
        const mydata = await Product.find({ categoryId: categoryId })
        if (mydata) {
            res.status(200).json({ message: ok, "data": mydata })
        }
        else {
            res.status(500).json("no product found")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

}