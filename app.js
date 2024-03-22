require('dotenv').config();
const express = require('express')
const app = express()
let cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const userRoute = require('./route/api/userRoute');
app.use('/', userRoute);
const adminRoute = require('./route/api/adminRoute');
app.use('/', adminRoute);
const productRoute = require('./route/api/productRoute');
app.use('/', productRoute);
const categoryRoute = require('./route/api/categoryRoute');
app.use('/', categoryRoute);
const cartRoute = require('./route/api/cartRoute');
app.use('/', cartRoute);
const orderRoute = require('./route/api/orderRoute');
app.use('/', orderRoute);
const storeRoute = require('./route/api/storeRoute');
app.use('/', storeRoute);
const wishlistRoute = require('./route/api/wishlistRoute')
app.use('/', wishlistRoute);
const  notificationRoute = require('./route/api/notificationRoute')
app.use('/' , notificationRoute)
const  promocodeRoute = require('./route/api/promocodeRoute')
app.use('/' , promocodeRoute)

app.listen(process.env.PORT, '0.0.0.0')