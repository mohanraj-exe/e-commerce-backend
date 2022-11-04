const express = require("express");
const router = express.Router();
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

// bookOrder
router.post('/', async (req, res) => {

    const cart = await Cart.find({ userId: req.user._id })
    // res.status(200).json(cart)
    // console.log(cart)

    if (!cart) {
        return res.status(404).json({ Message: 'Your cart is empty' })
    }

    cart.map(async item => {

        // console.log(item)
        const product = await Product.findOne({ productName: item.cartItems[0].productName })

        if (item.cartItems[0].productQuantity <= product.productQuantity) {
            await Order.create({ orderId: item._id })
            await Cart.deleteOne({ cartId: item._id })
            await Product.updateOne({ productName: item.cartItems[0].productName }, { productQuantity: product.productQuantity - item.cartItems[0].productQuantity })
        }

        if (item.cartItems[0].productQuantity > product.productQuantity) {
            return res.status(500).json({ Message: 'Internal Server Error!!!' })
        }

    })
    return res.status(200).json({ Message: 'Order placed successfully!!!' })
})
module.exports = router;