const express = require('express')
const router = express.Router()
const productController = require('../../controller/productController');
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()

router.use('/product', express.static('images/productImage'))

const storage = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/productImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({storage :storage})

// product apis 
router.post('/addProduct', adminAuth ,  upload.array('images' ,10) , productController.addProduct);
router.post('/removeProduct', newdata , adminAuth , productController.removeProduct);
router.post('/updateProduct',  upload.array('images' ,10) ,adminAuth,  productController.updateProduct);

// product api 
router.get('/getProducts' ,   productController.getProducts)
router.post('/getProductByStore' ,   productController.getProductByStore)
router.post('/getOneProduct' , newdata ,productController.getOneProduct)
router.post('/getProductByCategory', newdata ,productController.getProductByCategory)
router.post('/getProductByCategoryByStore', newdata ,productController.getProductByCategoryByStore)

// router.post('/getProductByStore', newdata ,adminAuth , productController.getProductByStore)

router.post('/getProductByFilter', newdata  , productController.getProductByFilter)
router.post('/removeProductImage',adminAuth ,  productController.removeProductImage)



module.exports = router