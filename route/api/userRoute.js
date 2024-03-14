const express = require('express')
const router = express.Router()
const userController = require('../../controller/userController');
const cors = require('cors');
const multer = require('multer');

router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const formData = require('express-form-data');
const newdata = formData.parse()

router.post('/register',userController.register);
router.post('/activate',userController.activationKey)
router.post('/login' ,  userController.login)

router.get('/getProducts' , userController.getProducts)
router.post('/getUserCart' , newdata , userController.getUserCart)
router.post('/getUserOrder' , newdata , userController.getUserOrder)
router.post('/getOneProduct' , newdata , userController.getOneProduct)

router.post('/addCart', newdata, userController.addCart);
router.post('/addOrder', newdata, userController.addOrder);

router.post('/removeCart', newdata , userController.removeCart);

router.post('/getProductByCategory', newdata , userController.getProductByCategory);


// 13/3/2024's task
// find usefull payload for all collection 1h  
// create a models cart Category Order product store 1h 
// create crud api for - Store Category Order admin side 3h
// create curd api for - Cart Products Orders with image upload - user side 3h

module.exports = router