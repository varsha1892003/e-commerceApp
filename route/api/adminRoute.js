const express = require('express')
const router = require('express').Router();
const adminController = require('../../controller/adminController')
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
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

router.get('/getUsers', adminAuth, adminController.getUsers);
router.post('/addUser' , adminAuth , upload.single('profilePic') , adminController.addUser)
router.post('/removeUser' , adminAuth , adminController.removeUser)
router.post('/getOneUser' , adminAuth , adminController.getOneUser)

router.post('/addMainStore' , adminAuth , adminController.addMainStore)



module.exports = router