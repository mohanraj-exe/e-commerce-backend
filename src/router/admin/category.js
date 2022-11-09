const { Router } = require('express');
const { default: mongoose } = require('mongoose');
const router = Router();
const Category = require("../../models/Category");
const { categoriesValidate, categoriesUpdateValidate} = require("../../helper/validator.helper");
const { validationResult } = require("express-validator");

// create a new category
router.post('/', categoriesValidate(), async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json({ errors: errors.array() })
    }
    const { categoryName, categoryDesc } = req.body;
    const findCategory = await Category.findOne({ categoryName })

    if (!findCategory) {

        if (!categoryName || !categoryDesc) {
            res.status(400).json({ Message: 'All inputs are required!!!' })
        }
        const category = await Category.create({ categoryName, categoryDesc })
        res.status(201).json({ category })
    }
    else {
        res.send(400).json({ Message: "Category type already exists. Please try another 'Category Name' " })
    }

});

// read/list categories
router.get('/', async (req, res, next) => {
    const category = await Category.find({}).sort({ createdAt: -1 })
    res.status(201).json(category)
    next();
});

// read/list a product by its name
router.get('/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    const category = await Category.where("categoryName").equals(categoryName)
    res.status(200).json({ category })

});

// read/list a category by its id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such category' })
    }

    const category = await Category.findById(id)
    if (!category) {
        return res.status(404).json({ error: 'No such category' })
    }

    res.status(200).json(category)
});

// update category
router.patch('/:id', categoriesUpdateValidate(), async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json({ errors: errors.array() })
    }
    
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such category' })
    }

    const category = await Category.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
    if (!category) {
        return res.status(400).json({ error: 'No such category' })
    }
    res.status(201).json({ category });

});

// delete category
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such category' })
    }

    const category = await Category.findOneAndDelete({ _id: id })
    if (!category) {
        return res.status(400).json({ error: 'No such category' })
    }
    res.status(200).json({ Message: 'Category deleted successfully!!!' });
});

module.exports = router;