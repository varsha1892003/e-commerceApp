const express = require('express')
const router = express.Router()
const categoryController = require('../../controller/categoryController');
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()
const superAdminAuth = require('../../middleware/superAdminAuth') 

router.use('/category', express.static('images/categoryImage'))

const storage3 = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/categoryImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload3 = multer({storage :storage3})

router.get('/getCategorys' ,  superAdminAuth , categoryController.getCategorys);
router.post('/updateCategory',  adminAuth , upload3.single('images'), categoryController.updateCategory);
router.post('/addCategory', adminAuth ,  upload3.single('images') , categoryController.addCategory);
router.post('/removeCategory', newdata , adminAuth  , categoryController.removeCategory);
router.post('/getOneCategory', newdata ,  categoryController.getOneCategory);
router.post('/getCategoryByStore', categoryController.getCategoryByStore);



module.exports = router