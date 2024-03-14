const express = require('express')
const router = require('express').Router();
const adminController = require('../../controller/adminController')
const cors = require('cors');
const multer = require('multer');

router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const formData = require('express-form-data');
const newdata = formData.parse()

router.use('/product', express.static('images/productImage'))
router.use('/store', express.static('images/storeImage'))
router.use('/category', express.static('images/categoryImage'))

const storage = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/productImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({storage :storage})

const storage2 = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/storeImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload2 = multer({storage :storage2})

const storage3 = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/categoryImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload3 = multer({storage :storage3})

// add apis 
router.post('/addProduct',  upload.array('images' ,10) , adminController.addProduct);
router.post('/addStore',  upload2.array('images' ,10) , adminController.addStore);
router.post('/addCategory',  upload3.single('images') , adminController.addCategory);

//get apis
router.get('/getStore', adminController.getStore);
router.get('/getCategory', adminController.getCategory);
router.get('/getOrder', adminController.getOrder);
router.get('/getUser', adminController.getUser);
// update apis

router.post('/updateStore', upload2.array('images' ,10) , adminController.updateStore);
router.post('/updateCategory', upload3.single('images'), adminController.updateCategory);
router.post('/updateProduct',  upload.array('images' ,10) , adminController.updateProduct);

// remove apis 
router.post('/removeStore', newdata , adminController.removeStore);
router.post('/removeCategory', newdata , adminController.removeCategory);
router.post('/removeCategory', newdata , adminController.removeProduct);



module.exports = router