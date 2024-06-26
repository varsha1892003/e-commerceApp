const express = require('express')
const router = require('express').Router();
const storeController = require('../../controller/storeController')
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
const formData = require('express-form-data');
const newdata = formData.parse()
const superAdminAuth = require('../../middleware/superAdminAuth') 

router.use('/store', express.static('images/storeImage'))

const storage2 = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/storeImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload2 = multer({storage :storage2})

// store api 
router.post('/addStore', upload2.array('images' ,10) , storeController.addStore);
router.get('/getStores', adminAuth , storeController.getStores);
router.post('/updateStore', upload2.array('images' ,10) ,adminAuth ,  storeController.updateStore);
router.post('/removeStore', newdata ,adminAuth ,  storeController.removeStore);
router.post('/getOneStore',  storeController.getOneStore);
router.post('/removeStoreImage',adminAuth ,  storeController.removeStoreImage);


module.exports = router