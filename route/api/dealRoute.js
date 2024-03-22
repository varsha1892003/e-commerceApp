const express = require('express')
const router = express.Router()
const dealController = require('../../controller/dealController');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()

// cart api 
router.post('/addDeal', newdata,auth , dealController.addDeal);
router.post('/removeDeal', newdata,auth , dealController.removeDeal);


module.exports = router