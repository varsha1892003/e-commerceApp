const express = require('express')
const Order = require('../models/order-model')
const Product = require('../models/product-model')
const { env } = require('process');
const Intransit = require('../models/intransit-model')
const Delivered = require('../models/delivered-model')
const Neworders = require('../models/neworders-model')
const Shipped = require('../models/shipped-model')
const User = require('../models/user-model')

exports.getUserOrder = async (req, res) => {
    try {
        const mainStoreId = req.headers.mainstoreid
        const userId = req.body.userId
        const mydata = await Order.find({ userId: userId, mainStoreId: mainStoreId })
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
        const product = await Product.findOne({ _id: req.body.productId })
        const user = await User.findOne({_id : req.body.userId })
        if (product) {
            const newstock = Number(product.stock) - Number(req.body.quantity);
            if (product.stock > 0 && newstock > 0) {
                const myorder = new Order({
                    productId: req.body.productId,
                    price: product.price,
                    quantity: req.body.quantity,
                    totalAmount: req.body.totalAmount,
                    paymentMethod: req.body.paymentMethod,
                    paymentStatus: req.body.paymentStatus,
                    status: req.body.status,
                    userId: req.body.userId,
                    userName : user.firstName,
                    lastName : user.lastName,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    transactionId: req.body.transactionId,
                    promoCode: req.body.promoCode
                });
                const mydata = await myorder.save()

                if (mydata) {
                    await Product.findOneAndUpdate({ _id: product._id }, { $set: { stock: newstock } })
                    const isorder = await Neworders.find()
                    if (isorder.length <= 0) {
                        const neworders = await new Neworders({ orderId: mydata._id })
                        const saveneworders = await neworders.save()
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

                    res.json({ message: 'OK', data: "order add succesfully" })
                }
            }
            else {
                res.status(400).json("not in stock")
            }
        }
        else {
            res.status(400).json("please try again product not found")
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

// exports.updateOrderStatus = async (req, res) => {
//     try {
//         const orderId = req.body.orderId
//         const mydata = await Order.findOneAndUpdate({ _id: orderId }, {
//             $set: {
//                 status: req.body.status,   // 'Requested', 'processing', 'shipped', 'delivered'
//                 paymentStatus: req.body.paymentStatus,  // 'pending', 'received '
//             }
//         })
//         if (mydata) {
//             res.json({ message: 'OK', data: "order update succesfully" })
//         }
//         else {
//             res.json({ message: 'OK', data: "please try again" })
//         }
//     } catch (err) {
//         res.status(500).json(err)
//     }
// }

exports.kanbanData = async (req, res) => {
    try {
        const { month , year } = req.body
        let kanbandata = []
        const neworderslist = await Neworders.find()
        let latesetdata = []
        if (neworderslist.length > 0) {
            for (j in neworderslist[0].orderId) {
                let output = await Order.findOne({ _id: neworderslist[0].orderId[j] })
                let output2 = await Product.findOne({ _id: output.productId })
                let listItem = {
                    "orderData": output,
                    "productData": output2
                }
                latesetdata.push(listItem)
            }
        }
        for (i in neworderslist) {
            const obj = {
                "listId": neworderslist[i]._id,
                "listName": neworderslist[i].listName,
                "listItems": latesetdata
            }
            kanbandata.push(obj)
        }
        const intransitlist = await Intransit.find({})
        let latesetdata2 = []
        if (intransitlist.length > 0) {
            for (j in intransitlist[0].orderId) {
                const output = await Order.findOne({ _id: intransitlist[0].orderId[j] })
                let output2 = await Product.findOne({ _id: output.productId })
                let listItem = {
                    "orderData": output,
                    "productData": output2
                }
                latesetdata2.push(listItem)
            }
        }
        for (i in intransitlist) {
            const obj2 = {
                "listId": intransitlist[i]._id,
                "listName": intransitlist[i].listName,
                "listItems": latesetdata2
            }
            kanbandata.push(obj2)
            latesetdata2 = []
        }
        const Deliveredlist = await Delivered.find({})
        let latesetdata3 = []
        if (Deliveredlist.length > 0) {
            for (j in Deliveredlist[0].orderId) {
                const output = await Order.findOne({ _id: Deliveredlist[0].orderId[j] })
                let output2 = await Product.findOne({ _id: output.productId })
                let listItem = {
                    "orderData": output,
                    "productData": output2
                }
                latesetdata3.push(listItem)
            }
        }
        for (i in Deliveredlist) {
            const obj3 = {
                "listId": Deliveredlist[i]._id,
                "listName": Deliveredlist[i].listName,
                "listItems": latesetdata3
            }
            kanbandata.push(obj3)
            latesetdata3 = []
        }
        const Shippedlist = await Shipped.find({})
        let latesetdata4 = []
        if (Shippedlist.length > 0) {
            for (j in Shippedlist[0].orderId) {
                const output = await Order.findOne({ _id: Shippedlist[0].orderId[j] })
                let output2 = await Product.findOne({ _id: output.productId })
                let listItem = {
                    "orderData": output,
                    "productData": output2
                }
                latesetdata4.push(listItem)
            }
        }
        for (i in Shippedlist) {
            const obj3 = {
                "listId": Shippedlist[i]._id,
                "listName": Shippedlist[i].listName,
                "listItems": latesetdata4
            }
            kanbandata.push(obj3)
            latesetdata3 = []
        }
        res.json({ message: 'OK', data: kanbandata })
    } catch (err) {
        res.status(500).json(err)
    }
}

// exports.updateOrderStatus = async (req, res) => {
//     try {
//         const { oldListId, orderId, listId } = req.body

//         const upadteddata = await Neworders.findOne({ _id: orderId })
//         if (!upadteddata) {
//             const neworders = await new Neworders({ orderId: orderId })
//             await neworders.save()
//         }

//         const Intransitdata = await Intransit.findOne({ _id: orderId })
//         if (!Intransitdata) {
//             const newintransit = await new Intransit({ orderId: orderId })
//             await newintransit.save()
//         }
      
//         const Delivereddata = await Delivered.findOne({ _id: orderId })
//         if (!Delivereddata) {
//             const newdelivered = await new Delivered()
//             await newdelivered.save()
//         }

//         const Shippeddata = await Shipped.findOne({ _id: orderId })
//         if (Shippeddata) {
//             const newShipped = await new Shipped()
//             await newShipped.save()
//         }
       
//         if (upadteddata || Intransitdata || Delivereddata || Shippeddata) {
//             const isNeworders = await Neworders.findOne({ _id: listId })
//             if (isNeworders) {
//                 let olddata = []
//                 if (isNeworders.orderId) {
//                     for (j in isNeworders.orderId) {
//                         olddata.push(isNeworders.orderId[j])
//                     }
//                 }
//                 olddata.push(orderId)
//                 await Neworders.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata } })
//             }

//             const isintransit = await Intransit.findOne({ _id: listId })
//             if (isintransit) {
//                 let olddata = []
//                 if (isintransit.orderId) {
//                     for (j in isintransit.orderId) {
//                         olddata.push(isintransit.orderId[j])
//                     }
//                 }
//                 olddata.push(orderId)
//                 await Intransit.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata } })
//             }

//             const isDelivered = await Delivered.findOne({ _id: listId })
//             if (isDelivered) {
//                 let olddata2 = []
//                 if (isDelivered.orderId) {
//                     for (j in isDelivered.orderId) {
//                         olddata2.push(isDelivered.orderId[j])
//                     }
//                 }
//                 olddata2.push(orderId)
//                 await Delivered.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata2 } })
//             }

//             const isShipped = await Shipped.findOne({ _id: listId })
//             if (isShipped) {
//                 let olddata3 = []
//                 if (isShipped.orderId) {
//                     for (j in isShipped.orderId) {
//                         olddata3.push(isShipped.orderId[j])
//                     }
//                 }
//                 olddata3.push(orderId)
//                 await Shipped.findOneAndUpdate({ _id: listId }, { $set: { orderId: olddata3 } })
//             }

//             res.json({ message: 'OK', data: "done" })
//         }
//         else {
//             res.json({ message: 'OK', data: "please try again" })
//         }
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json(err)
//     }
// }

exports.addOrder = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.body.productId })
        const user = await User.findOne({_id : req.body.userId })
        if (product) {
            const newstock = Number(product.stock) - Number(req.body.quantity);
            if (product.stock > 0 && newstock > 0) {
                const myorder = new Order({
                    productId: req.body.productId,
                    price: product.price,
                    quantity: req.body.quantity,
                    totalAmount: req.body.totalAmount,
                    paymentMethod: req.body.paymentMethod,
                    paymentStatus: req.body.paymentStatus,
                    status: req.body.status,
                    userId: req.body.userId,
                    userName : user.firstName,
                    lastName : user.lastName,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    transactionId: req.body.transactionId,
                    promoCode: req.body.promoCode
                });
                const mydata = await myorder.save()

                if (mydata) {
                    await Product.findOneAndUpdate({ _id: product._id }, { $set: { stock: newstock } })
                    const isorder = await Neworders.find()
                    if (isorder.length <= 0) {
                        const neworders = await new Neworders({ orderId: mydata._id })
                        const saveneworders = await neworders.save()
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

                    res.json({ message: 'OK', data: "order add succesfully" })
                }
            }
            else {
                res.status(400).json("not in stock")
            }
        }
        else {
            res.status(400).json("please try again product not found")
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
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
            await Neworders.findOneAndUpdate({ _id: oldListId}, { $set: { orderId: latesetdata } })
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