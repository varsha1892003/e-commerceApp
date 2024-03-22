const express = require('express')
const router = express.Router()
const promocodeController = require('../../controller/promocodeController');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()


router.post('/addPromoCode',adminAuth ,  promocodeController.addPromoCode);
router.post('/getPromoCodes', auth ,  promocodeController.getPromoCodes);
router.post('/getOnePromoCode',  promocodeController.getOnePromoCode);
router.post('/updatePromoCode',  adminAuth , promocodeController.updatePromoCode);
router.post('/removePromoCode',  promocodeController.removePromoCode);


module.exports = router