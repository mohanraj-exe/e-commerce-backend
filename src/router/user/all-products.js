const { Router } = require('express');
const router = Router();
const Product = require("../../models/Product");
const mongoose = require("mongoose");

// read/list all products
router.get('/', async (req, res) => {

    const products = await Product.find({ productStatus: { $ne: false } })
    res.status(200).json({ products })

});

// read/list a product by its name
router.get('/:productName', async (req, res) => {

    const {productName} = req.params;
    const products = await Product.findOne({ productName: productName, productStatus: true});
    
    if(!products){
        res.status(404).json({Message: 'No such product'})
    }
    else res.status(200).json(products);
});

// read/list a product by id
router.get('/:id', async (req, res) => {

    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Product not found'})
    }

    const productStatus = await Product.where("productStatus").equals(false)
    if(productStatus){
        res.status(404).json({Message: 'No such product'})
    }

    const product = await Product.findById(id)
    res.status(200).json(product)

});

module.exports = router;