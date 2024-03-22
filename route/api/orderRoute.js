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

// router.get('/updateKanban',adminAuth , orderController.updateKanban);




module.exports = router