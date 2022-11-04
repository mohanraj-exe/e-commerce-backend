const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// listing all products in a cart
router.get('/', async (req, res) => {
    const products = await Cart.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(products)
})

// Adding products in a cart
router.post('/', async (req, res) => {

    const addToCartItems = req.body.cartItems.map(async item => {

        const product = await Product.findOne({ productId: item.productId });
        if(!product.productQuantity){
            return res.status(500).json({Message: 'Internal Server Error!!!'})
        }

        await Cart.create({
            cartItems: item, 
            userId: req.user._id,
            userName: req.user.userName,
            email: req.user.email
        });
        
        return { Message: 'Items added to cart!!!', productId: item.productId, productName: item.productName }
        
    })
    const data = await Promise.all([...addToCartItems])
    return res.status(200).json(data)
})

// Remove products from cart
router.delete('/', async (req, res) => {

    await Cart.deleteMany({ userId: req.user._id }, { new: true })
    res.status(200).json({ Message: 'All items removed, Your Cart is Empty!!!' });
})

// Remove products from cart
router.put('/:productId', async (req, res) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.productId)){
        return res.status(404).json({Error: 'Product not found'})
    }
    const cart = await Cart.findOne({ userId: req.user._id, "cartItems.productId": req.params.productId });
    // const responses = await res.status(200).json(cart)
    // console.log(responses);

    cart.cartItems.map(async item =>{
        let filter = { userId: req.user._id, "cartItems.productId": item.productId }

        let update = { "cartItems.$.productQuantity": item.productQuantity - parseInt(req.query.quantity) }

        if(!item.productQuantity){
            await Cart.deleteOne({ cartId: cart._id})
            return res.status(200).json({Message: 'All items removed!!!'})
        }
        await Cart.updateOne(filter, update)
        return res.status(200).json({Message: 'cart item quantity updated', update});
    })
})

module.exports = router;