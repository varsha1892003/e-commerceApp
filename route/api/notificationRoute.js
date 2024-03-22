const express = require('express')
const router = express.Router()
const notificationController = require('../../controller/notificationController');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()


router.post('/addNotification', newdata , adminAuth , notificationController.addNotification);
router.post('/addBulkNotification', newdata , adminAuth ,notificationController.addBulkNotification);
router.post('/RemoveNotification', newdata , adminAuth , notificationController.RemoveNotification);
router.post('/getOneNotification', newdata ,  notificationController.getOneNotification);
router.get('/getNotifications' , auth ,  notificationController.getNotifications);
router.post('/updateNotification' , adminAuth ,newdata , notificationController.updateNotification);
router.post('/updateReadNot' , auth ,newdata , notificationController.updateReadNot);
router.post('/getUserNotification' , auth ,newdata , notificationController.getUserNotification);

module.exports = router




