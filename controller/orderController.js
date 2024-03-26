const express = require('express')
const Order = require('../models/order-model')
const Product = require('../models/product-model')
const { env } = require('process');
const Intransit = require('../models/intransit-model')
const Delivered = require('../models/delivered-model')
const Neworders = require('../models/neworders-model')
const Shipped = require('../models/shipped-model')
const User = require('../models/user-model')
const Payment = require('../models/payment-model')
const Razorpay = require('razorpay');
var crypto = require('crypto');
const Cart = require('../models/cart-model');
const UserCode = require('../models/userCode-model');
const Promocode = require('../models/promocode-model');
const { RAZORPAYTESTKEYID, RAZORPAYTESTKEYSECRET } = process.env
var razorpay = new Razorpay({ key_id: RAZORPAYTESTKEYID, key_secret: RAZORPAYTESTKEYSECRET });

exports.getUserOrder = async (req, res) => {
    try {
        // const mainStoreId = req.headers.mainstoreid
        const userId = req.body.userId
        const mydata = await Order.find({ userId: userId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(500).json("no order found")
        }
    } catch (err) {
        res.status(400).json(err)
    }
}
// admin can get all orders 
exports.getOrdersByStore = async (req, res) => {
    try {
        const mainStoreId = req.headers.mainstoreid
        const mydata = await Order.find({ mainStoreId: mainStoreId })
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(400).json("no Order found")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getOrders = async (req, res) => {
    try {
        const mydata = await Order.find({})
        if (mydata) {
            res.status(200).json({ message: "ok", "data": mydata })
        } else {
            res.status(400).json("no Order found")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.cancelOrder = async (req, res) => {
    const orderId = req.body.orderId;
    try {
        const order = await Order.findOne({ _id: orderId });
        if (order) {
            if (order.status === 'pending' || order.status === 'processing') {
                order.status = 'cancelled';
                await order.save();
                res.json({ message: 'Order cancelled successfully' });
            } else {
                res.status(400).json('Order cannot be cancelled');
            }
        }
        else {
            res.status(400).json('please try again');
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

exports.addOrder = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        let transactionData = null
        const fetch = await testFetchOrder(req.body.transactionData.razorpay_order_id);
        if (fetch) {
            transactionData = req.body.transactionData
        }
        const orderData = req.body.orderData
        for (let i in orderData) {
            const data = orderData[i]
            const product = await Product.findOne({ _id: data.productId })
            if (product) {
                const myorder = new Order({
                    productId: data.productId,
                    price: product.price,
                    quantity: data.quantity,
                    totalAmount: product.price,
                    paymentMethod: "online",
                    paymentStatus: "paid",
                    status: "completed",
                    userId: req.body.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    promoCode: req.body.promoCode,
                    transactionData: transactionData
                });
                const mydata = await myorder.save()

                if (mydata) {

                    const addpayment = new Payment({
                        userId: req.body.userId,
                        totalAmount: req.body.totalAmount,
                        paymentMethod:"online",
                        paymentStatus: "completed"
                    })
                    await addpayment.save()
                    
                    const promocodeData = await Promocode.findOne({code:req.body.promoCode}) 
                    const isusercode = await UserCode.findOne({  userId : req.body.userId , promoCodeId : promocodeData._id,})
                    if(isusercode){
                    const usercode = new UserCode({
                        userId : req.body.userId,
                        promoCodeId : promocodeData._id,
                    })
                    await usercode.save()
                    }
                  
                    const newstock = Number(product.stock) - Number(data.quantity)
                    await Product.findOneAndUpdate({ _id: product._id }, { $set: { stock: newstock, cart: "false" } })
                    const isorder = await Neworders.find()
                    if (isorder.length <= 0) {
                        const neworders = await new Neworders({ orderId: mydata._id })
                        await neworders.save()
                    } else {
                        let total = []
                        const newordersId = await Neworders.findOne()
                        for (v in newordersId.orderId) {
                            total.push(newordersId.orderId[v])
                        }
                        total.push(mydata._id)
                        await Neworders.findOneAndUpdate({ _id: newordersId._id }, { $set: { orderId: total } })
                    }

                    const isintransit = await Intransit.find()
                    if (isintransit.length <= 0) {
                        const newintransit = await new Intransit()
                        await newintransit.save()
                    }

                    const isDelivered = await Delivered.find()
                    if (isDelivered.length <= 0) {
                        const newdelivered = await new Delivered()
                        await newdelivered.save()
                    }

                    const isShipped = await Shipped.find()
                    if (isShipped.length <= 0) {
                        const newShipped = await new Shipped()
                        await newShipped.save()
                    }

                    const cartdata = await Cart.findOne({ userId: req.body.userId })
                    if (cartdata) {
                        let removecart = []
                        for (let i in cartdata.productData) {

                            if (cartdata.productData[i].productId != data.productId) {
                                removecart.push(cartdata.productData[i])
                            }
                        }
                        await Cart.findOneAndUpdate({ _id: cartdata._id }, { $set: { productData: removecart } })
                    }
                }
            }
        }
        res.json({ message: 'OK', data: "order add succesfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

async function testFetchOrder(orderId) {
    try {
        const order = await razorpay.orders.fetch(orderId);
        return order
    } catch (error) {
        console.error('Error fetching test order:', error);
        return error
    }
}

exports.kanbanData = async (req, res) => {
    try {
        const { month, year } = req.body
        let kanbandata = []
        const neworderslist = await Neworders.find()
        const obj = await myfilterdata(neworderslist, month, year)
        kanbandata.push(obj)

        const intransitlist = await Intransit.find()
        const obj2 = await myfilterdata(intransitlist, month, year)
        kanbandata.push(obj2)

        const Shippedlist = await Shipped.find()
        const obj4 = await myfilterdata(Shippedlist, month, year)
        kanbandata.push(obj4)

        const Deliveredlist = await Delivered.find()
        const obj3 = await myfilterdata(Deliveredlist, month, year)
        kanbandata.push(obj3)

        res.json({ message: 'OK', data: kanbandata })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { oldListId, orderId, listId } = req.body

        const upadteddata = await Neworders.findOne({ _id: oldListId })
        if (upadteddata) {
            let latesetdata = []
            for (i in upadteddata.orderId) {
                if (orderId != upadteddata.orderId[i]) {
                    latesetdata.push(upadteddata.orderId[i])
                }
            }
            await Neworders.findOneAndUpdate({ _id: oldListId }, { $set: { orderId: latesetdata } })
        }

        const Intransitdata = await Intransit.findOne({ _id: oldListId })
        if (Intransitdata) {
            let latesetdata2 = []
            for (i in Intransitdata.orderId) {
                if (orderId != Intransitdata.orderId[i]) {
                    latesetdata2.push(Intransitdata.orderId[i])
                }
            }
            await Intransit.findOneAndUpdate({ _id: oldListId }, { $set: { orderId: latesetdata2 } })

        }

        const Delivereddata = await Delivered.findOne({ _id: oldListId })
        if (Delivereddata) {
            let latesetdata3 = []
            for (i in Delivereddata.orderId) {
                if (orderId != Delivereddata.orderId[i]) {
                    latesetdata3.push(Delivereddata.orderId[i])
                }
            }
            await Delivered.findOneAndUpdate({ _id: oldListId }, { $set: { orderId: latesetdata3 } })

        }

        const Shippeddata = await Shipped.findOne({ _id: oldListId })
        if (Shippeddata) {
            let latesetdata4 = []
            for (i in Shippeddata.orderId) {
                if (orderId != Shippeddata.orderId[i]) {
                    latesetdata4.push(Shippeddata.orderId[i])
                }
            }
            await Shipped.findOneAndUpdate({ _id: oldListId }, { $set: { orderId: latesetdata4 } })

        }

        if (upadteddata || Intransitdata || Delivereddata || Shippeddata) {
            const isNeworders = await Neworders.findOne({ _id: listId })
            if (isNeworders) {
                let olddata = []
                if (isNeworders.orderId) {
                    for (j in isNeworders.orderId) {
                        olddata.push(isNeworders.orderId[j])
                    }
                }
                olddata.push(orderId)
                await Neworders.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata } })
                await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: "Requested" } })

            }

            const isintransit = await Intransit.findOne({ _id: listId })
            if (isintransit) {
                let olddata = []
                if (isintransit.orderId) {
                    for (j in isintransit.orderId) {
                        olddata.push(isintransit.orderId[j])
                    }
                }
                olddata.push(orderId)
                await Intransit.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata } })
                await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: "Intransit" } })

            }

            const isDelivered = await Delivered.findOne({ _id: listId })
            if (isDelivered) {
                let olddata2 = []
                if (isDelivered.orderId) {
                    for (j in isDelivered.orderId) {
                        olddata2.push(isDelivered.orderId[j])
                    }
                }
                olddata2.push(orderId)
                await Delivered.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata2 } })
                await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: "Delivered" } })

            }

            const isShipped = await Shipped.findOne({ _id: listId })
            if (isShipped) {
                let olddata3 = []
                if (isShipped.orderId) {
                    for (j in isShipped.orderId) {
                        olddata3.push(isShipped.orderId[j])
                    }
                }
                olddata3.push(orderId)
                await Shipped.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata3 } })
                await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: "Shipped" } })
            }

            res.json({ message: 'OK', data: "done" })
        }
        else {
            res.json({ message: 'OK', data: "please try again" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

function myfilterdata(mylist, month, year) {
    return new Promise(async resolve => {
        try {
            let latesetdata = []
            if (mylist.length > 0) {
                for (j in mylist[0].orderId) {
                    await Order.find({
                        $and: [
                            {
                                _id: mylist[0].orderId[j]
                            }],
                        $expr: {
                            $and: [
                                { $eq: [{ $month: '$createdAt' }, month] },
                                { $eq: [{ $year: '$createdAt' }, year] }
                            ]
                        }
                    }).then(async function (timedata) {
                        for (let k in timedata) {
                            let output2 = await Product.findOne({ _id: timedata[k].productId })
                            let listItem = {
                                "orderData": timedata[k],
                                "productData": output2
                            }
                            latesetdata.push(listItem)
                        }
                    })
                }
            }
            const obj = {
                "listId": mylist[0]._id,
                "listName": mylist[0].listName,
                "listItems": latesetdata
            }
            resolve(obj)
        }
        catch (e) {
            console.log(e)
        }
    })
}

exports.getUserOrderStatus = async (req, res) => {
    try {
        const userId = req.body.userId
        const mydata = await Order.find({ userId: userId })
        res.json({ message: "ok", data: mydata })
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


