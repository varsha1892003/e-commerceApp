const express = require('express')
const router = express.Router()
const notificationController = require('../../controller/notificationController');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')
const formData = require('express-form-data');
const newdata = formData.parse()


router.post('/addNotification', newdata , adminAuth , notificationController.addNotification);
router.post('/addBulkNotification', newdata , adminAuth ,notificationController.addBulkNotification);
router.post('/RemoveNotication', newdata , adminAuth , notificationController.RemoveNotication);
router.post('/getOneNotication', newdata ,  notificationController.getOneNotication);
router.get('/getNotificatons' , auth ,  notificationController.getNotificatons);
router.get('/updateNotication' , adminAuth ,newdata , notificationController.updateNotication);
router.get('/updateReadNot' , auth ,newdata , notificationController.updateReadNot);
router.get('/getUserNotificaton' , auth ,newdata , notificationController.getUserNotificaton);

module.exports = router




