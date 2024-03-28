const express = require('express')
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const User = require('../models/user-model')
const Address = require('../models/address-model')
const { env } = require('process');
const fs = require('fs')
const Razorpay = require('razorpay');
var crypto = require('crypto');
const { RAZORPAYTESTKEYID, RAZORPAYTESTKEYSECRET } = process.env
var razorpay = new Razorpay({ key_id: RAZORPAYTESTKEYID, key_secret: RAZORPAYTESTKEYSECRET });


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
        if (email == process.env.ADMINEMAIL) {
            const mailOptions = {
                from: "kemin@hubresolution.com",
                to: email,
                subject: "for verification email",
                html: '<p>hy ' + firstname + ', please click the link <a href="' + process.env.adminVerPage + token + '/' + email + '">verify email </a> and verify email'
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
        else {
            const mailOptions = {
                from: "kemin@hubresolution.com",
                to: email,
                subject: "for verification email",
                html: '<p>hy ' + firstname + ', please click the link <a href="' + process.env.newVerPage + token + '/' + email + '">verify email </a> and verify email'
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

    }
    catch (err) {
        console.log(err)
    }
}
exports.activationKey = async (req, res) => {
    // const token = req.headers["token"];
    const token = req.body.token
    console.log(token)
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
const sendsetpass = async (firstname, email, token) => {
    try {

        const mytoken = jwt.sign({ token: token }, process.env.VERIFICATIONKEY, { expiresIn: '1h' })

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
        if (email == process.env.ADMINEMAIL) {
            const mailOptions = {
                from: "kemin@hubresolution.com",
                to: email,
                subject: "for reset password",
                html: '<p>hy' + firstname + ', please click the link <a href="' + process.env.ADMINRESETPASSPAGE + token + '/' + email + '">reset your passowrd</a> and reset password</p>'

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
        else {
            const mailOptions = {
                from: "kemin@hubresolution.com",
                to: email,
                subject: "for reset password",
                html: '<p>hy' + firstname + ', please click the link <a href="' + process.env.RESETPASSPAGE + token + '/' + email + '">reset your passowrd</a> and reset password</p>'

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
    }
    catch (err) {
        res.json({ message: 'OK', data: err })
    }
}
exports.frgtpassword = async (req, res) => {
    try {
        const email = req.body.email;
        const userdata = await User.findOne({ email: email })

        if (userdata) {
            const token = userdata.token;

            sendsetpass(userdata.firstName, userdata.email, token)

            return res.json({ message: 'OK', data: "check your email" })
        }
        else {
            res.status(400).json("invalid email address")
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err);
    }
}
exports.resetpass = async (req, res) => {
    const { password, email, token } = req.body;
    const userdata = await User.findOne({ email: email, token: token })
    if (userdata) {
        userdata.password = password

        await userdata.save()
        return res.json({ message: 'OK', data: "your password reset succesfully" })
    }
    else {
        res.status(400).json("this link has been expired")
    }

}
exports.updateProfile = async (req, res) => {
    try {
        let formdata = JSON.parse(req.body.formdata)
        let password = await bcrypt.hash(formdata.password, 10)
        const userId = req.body.userId;
        let profilepic = null
        const olddata = await User.findOne({ _id: userId })
        if (req.file) {
            if (olddata.profilePic) {
                const splitimage = olddata.profilePic[0].split('/').pop()
                let imagePath = './images/userImage/' + splitimage
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Image does not exist');
                    } else {
                        fs.unlinkSync('./images/userImage/' + splitimage)
                    }
                });
            }
            profilepic = process.env.USERIMAGE + req.file.filename
        }
        else {
            profilepic = olddata.profilePic
        }
        const mydata = await User.findOneAndUpdate({ _id: userId }, {
            $set: {
                firstName: formdata.firstName,
                lastName: formdata.lastName,
                email: formdata.email,
                password: password,
                profilePic: profilepic,
                phone: formdata.phone,
                address: formdata.address,
                gender: formdata.gender
            }
        })
        if (mydata) {
            res.json({ message: "ok", "data": "user update succesfully" })
        }
        else {
            res.status(500).json({ message: "please try again" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
exports.getUserProfile = async (req, res) => {
    try {
        const mydata = await User.findOne({ _id: req.body.userId })
        const addressdata = await Address.find({userId : req.body.userId })
        mydata.address = addressdata
        if (mydata) {
            res.json({ message: "ok", data: mydata })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}
exports.addAddress = async (req, res) => {
    try {
        const { address , city, state ,country , zip , userId , apartment } = req.body
        const newaddess = new Address(req.body)
        const mydata = await newaddess.save()
        if (mydata) {
            res.status(200).json({ message: "ok", data: "address add succesfully" })
        }
        else {
            res.status(400).json("please try again")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.removeAddress = async(req , res)=>{
    try{
    const addressId = req.body.addressId

    const mydata = await Address.find({_id : addressId})
    if(mydata){
        res.json({message : ok , data : "remove succesfully"})
    }
    else{
        res.status(400).json("please try again")
    }
}
catch(err){
    console.log(err)
    res.status(500).json(err)
}
}
exports.createOrderInRp = async (req, res) => {
    try {

        const amount = Number(req.body.amount) * 100 
        const order = await testCreateOrder(amount)
        // await testFetchOrder(order.id);
        res.json({ message: "ok", data: order })
    } catch (err) {
        res.status(500).json(err)
        console.error('Error testing order flow:', err);
    }
}
async function testCreateOrder(amount) {
    const currency = 'INR';
    try {
        const options = {
            amount: amount,
            currency: currency,
            receipt: 'order_rcptid_11'
        };

        const order = await razorpay.orders.create(options);
        return order
    } catch (error) {
        console.error('Error creating test order:', error);
        return error
    }
}
// async function testFetchOrder(orderId) {
//     try {
//         const order = await razorpay.orders.fetch(orderId);
//         return order
//     } catch (error) {
//         console.error('Error fetching test order:', error);
//         return error
//     }
// }
exports.verifyPayment = async (req, res) => {
    console.log(verifyPayment)
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
    var verifysign = crypto.createHmac('sha256', process.env.RAZORPAYTESTKEYSECRET)
        .update(body.toString())
        .digest('hex');
    console.log("sig received", req.body.response.razorpay_signature)
    console.log("sig genrated", verifysign)
    var response = { "signatureIsValid": "false" }
    if (verifysign == req.body.response.razorpay_signature)
        response = { "signatureIsValid": "true" }
    res.send(response)
}
exports.removeUserImage = async (req, res) => {
    try {
        const newimages = []
        const userId = req.body.userId
        const imageUrl = req.body.imageUrl

        const user = await User.findOne({ _id: userId })
        if (user.profilePic) {
            for (const i in user.profilePic) {
                if (user.profilePic[i] == imageUrl) {
                    const splitimage = user.profilePic[i].split('/').pop()
                    let imagePath = './images/userImage/' + splitimage
                    fs.access(imagePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            console.error('Image does not exist');

                        } else {
                            fs.unlinkSync('./images/userImage/' + splitimage)

                        }
                    });
                }
                else {
                    newimages.push(user.images[i])
                }
            }
        }
        const mydata = await User.findOneAndUpdate({ _id: userId }, { $set: { profilePic: newimages } })
        if (mydata) {
            res.status(200).json({ message: "ok", data: "image remove succesfully" })
        }
        else {
            res.status(400).json("Image does not exist")
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
}


