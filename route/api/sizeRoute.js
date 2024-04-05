const express = require('express')
const router = require('express').Router();
const sizeController = require('../../controller/sizeController')
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
const superAdminAuth = require('../../middleware/superAdminAuth') 

router.post('/addSize', adminAuth, sizeController.addSize);
router.post('/updateSize', adminAuth, sizeController.updateSize);
router.post('/removeSize', adminAuth, sizeController.removeSize);
router.get('/getSizes',  sizeController.getSizes);
router.post('/getOnesize', adminAuth, sizeController.getOnesize);
router.post('/getSizeByStore', adminAuth, sizeController.getSizeByStore);



module.exports = router