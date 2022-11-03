const { Router } = require('express');
const router = Router();
const mongoose = require("mongoose");
const Category = require("../../models/Category");
const Product = require('../../models/Product');

// read/list categories
router.get('/', async (req, res) => {
    const category = await Category.find({}).sort({ createdAt: -1 })
    res.status(201).json(category)
});

// read/list a category by its id
router.get('/categoryId/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such category' })
    }

    const category = await Category.findById(id)
    if (category) {
        res.status(200).json({ category })
    }
    else {
        return res.status(404).json({ error: 'No such category' })
    }

});

// read/list a product by its name
router.get('/categoryName/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    const category = await Product.find({}).where("categoryName").equals(categoryName);
    res.status(200).json({category});
});

module.exports = router;