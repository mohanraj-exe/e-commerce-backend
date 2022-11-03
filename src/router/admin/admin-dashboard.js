const { Router } = require('express');
const router = Router();
const Order = require("../../models/Order");

router.get('/', async (req, res) =>{
    const usersOrder = await Order.find({}).sort("desc")
    if(!usersOrder){
        res.status(404).json({Message: 'No orders found!!!'})
    }
    res.status(200).json({Message: 'Orders Displaying', usersOrder})
})

module.exports = router;