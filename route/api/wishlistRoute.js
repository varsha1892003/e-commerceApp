const express = require('express')
const router = express.Router()
const wishlistController = require('../../controller/wishlistController');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()

// cart api 
router.post('/addWishlist',wishlistController.addWishlist);
router.post('/removeWishlist', auth , wishlistController.removeWishlist);
router.post('/getUserWishlist',auth , wishlistController.getUserWishlist);

module.exports = router