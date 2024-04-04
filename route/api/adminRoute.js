const express = require('express')
const router = require('express').Router();
const adminController = require('../../controller/adminController')
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
const superAdminAuth = require('../../middleware/superAdminAuth') 
const formData = require('express-form-data');
const newdata = formData.parse()

router.get('/getUsers',superAdminAuth, adminController.getUsers);
router.post('/addUser' , adminAuth , adminController.addUser)
router.post('/removeUser' , adminAuth , adminController.removeUser)
router.post('/getOneUser' , adminAuth , adminController.getOneUser)
router.post('/getUsersByStore' , adminAuth , adminController.getUsersByStore)

module.exports = router