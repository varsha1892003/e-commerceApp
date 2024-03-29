const express = require('express')
const router = express.Router()
const userController = require('../../controller/userController');
const multer = require('multer');
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()

router.use('/profilepic', express.static('images/userImage'))

const storage = multer.diskStorage({
    destination: function(req ,file, cb){
      cb(null, './images/userImage/')
    },
    filename :function(req , file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({storage :storage})

router.post('/register',userController.register);
router.post('/activate',userController.activationKey)
router.post('/login' ,  userController.login)

router.post('/frgtpassword' , userController.frgtpassword)
router.post('/resetpass' ,  userController.resetpass)
router.post('/getUserProfile' ,  userController.getUserProfile)
router.post('/addAddress' , auth , userController.addAddress)
router.post('/removeAddress' , auth ,  userController.removeAddress)

router.post('/updateProfile' , upload.single('profilePic') , userController.updateProfile)
router.post('/createOrderInRp' ,  userController.createOrderInRp)
router.post('/verifyPayment' ,  userController.verifyPayment)
router.post('/removeUserImage', auth ,  userController.removeUserImage)


module.exports = router