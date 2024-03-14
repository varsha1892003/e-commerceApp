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


app.listen(process.env.PORT, '0.0.0.0')
