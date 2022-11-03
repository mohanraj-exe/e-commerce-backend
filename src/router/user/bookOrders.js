const express = require("express");
const router = express.Router();
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

// bookOrder
router.post('/', async (req, res) => {

    const cart = await Cart.find({ userId: req.user._id })
    if(!cart){
        return res.status(404).json({Message: 'Your cart is empty'})
    }
    cart.map(async item => {
        await Order.create({ orderId: item._id})
        await Cart.deleteOne({ cartId: item._id })
    })
    res.status(201).json({Message: 'Success'})
})

module.exports = router;