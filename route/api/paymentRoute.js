const express = require('express')
const router = express.Router()
const paymentController = require('../../controller/paymentController');
const multer = require('multer');
const auth = require('../../middleware/userAuth')
const adminAuth = require('../../middleware/adminAuth')
const formData = require('express-form-data');
const { route } = require('./userRoute');
const newdata = formData.parse()
const superAdminAuth = require('../../middleware/superAdminAuth') 


router.post('/getpayments' , adminAuth , paymentController.getpayments)
router.post('/getUserPayment' , adminAuth , paymentController.getUserPayment)