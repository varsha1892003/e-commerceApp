const express = require('express')
const router = require('express').Router();
const colorController = require('../../controller/colorController')
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')

router.post('/addColor', adminAuth, colorController.addColor);
router.post('/updateColor', adminAuth, colorController.updateColor);
router.post('/removeColor', adminAuth, colorController.removeColor);
router.get('/getColors',  colorController.getColors);
router.post('/getOneColor', adminAuth, colorController.getOneColor);
router.post('/getColorByStore', adminAuth, colorController.getColorByStore);





module.exports = router