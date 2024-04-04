const express = require('express')
const router = express.Router()
const cartController = require('../../controller/cartController');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()
const superAdminAuth = require('../../middleware/superAdminAuth') 

// cart api 
router.post('/addCart', auth ,  cartController.addCart);
router.post('/getUserCart' ,auth , cartController.getUserCart);
router.post('/removeCart',auth , cartController.removeCart);
router.post('/updateCartQuantity', auth , cartController.updateCartQuantity);
router.post('/removeProductFromCart', auth , cartController.removeProductFromCart);

module.exports = router


