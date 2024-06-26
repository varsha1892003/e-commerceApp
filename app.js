require('dotenv').config();
const express = require('express')
const app = express()
let cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const fs = require('fs')
const https = require('https')
const http = require('http')


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
const  sizeRoute = require('./route/api/sizeRoute')
app.use('/' , sizeRoute)
const  colorRoute = require('./route/api/colorRoute')
app.use('/' , colorRoute)

app.get( '/test' , (req , res)=>{
    res.send("hey")

})
// const passphrase = 'varsha@123';

// const options = {
//     key: fs.readFileSync("./key/private.key"), // replace it with your key path
//     cert: fs.readFileSync("./key/certificate.crt"), // replace it with your certificate path
// }

app.get('/', (req, res) => {
    res.send('Now using https..');
});

// const server = http.createServer(options, app);

app.listen(process.env.PORT, () => {
   console.log("Server starting on port : " + process.env.PORT)
});

// app.listen(process.env.PORT ,)