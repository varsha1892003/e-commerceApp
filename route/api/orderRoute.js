const express = require('express')
const router = express.Router()
const orderController = require('../../controller/orderController');
const multer = require('multer');
const adminAuth = require('../../middleware/adminAuth')
const auth = require('../../middleware/userAuth')

// order api 
router.post('/addOrder',orderController.addOrder);
router.post('/getUserOrder' ,adminAuth, orderController.getUserOrder);
router.get('/getOrders',adminAuth , orderController.getOrders);
router.post('/getOrdersByStore',adminAuth , orderController.getOrdersByStore);
router.post('/updateOrderStatus',adminAuth , orderController.updateOrderStatus);
router.post('/kanbanData',adminAuth , orderController.kanbanData);
//user can get their order status 
router.post('/getUserOrderStatus', auth , orderController.getUserOrderStatus);
router.post('/getOneOrder', auth , orderController.getOneOrder);



module.exports = router