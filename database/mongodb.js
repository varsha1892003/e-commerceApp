var mongoose = require('mongoose')

const db = mongoose.connect("mongodb://localhost:27017/ecommerceapp")
.then(() => console.log("conncted"))
.catch((err) => console.log(err))