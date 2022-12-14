const mongoose = require("mongoose");
const { Router } = require('express');
const router = Router();
const upload = require("./multer");
const cloudinary = require("./cloudinary");
const { validationResult } = require("express-validator");

const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// imports
const Product = require("../../models/Product");
const { productsValidate, productsUpdateValidate } = require("../../helper/validator.helper");

// adding multiple products images
router.post('/upload-multiple', upload.array('image'), async (req, res) => {

    const uploader = async (path) => {
        return await cloudinary.uploads(path, 'Images');
    }

    var urls = []
    const files = req.files;
    for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
    }

    res.status(201).json({
        message: 'images uploaded successfully',
        data: urls
    })
});

// adding a single image
router.post('/upload-single', upload.single('image'), async (req, res) => {

    const uploader = async (path) => {
        return await cloudinary.uploads(path, 'Image');
    }

    const url = []
    const file = req.file;
    const { path } = file;
    const uploadedImage = await uploader(path)
    url.push(uploadedImage)
    fs.unlinkSync(path)

    res.status(201).json({
        message: 'image uploaded successfully',
        data: url
    })
    console.log(url)

});


// create product with single image
router.post('/', upload.single('image'), productsValidate(), async (req, res) => {
    try {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.json({ errors: errors.array() })
        }

        const { productName, productDesc,
            productCost, productQuantity, productStatus, categoryId, categoryName } = req.body;

        const findProduct = await Product.findOne({ productName })
        if (findProduct) {
            return res.status(400).json({ Message: 'Product already exists!!!' })
        }

        else {
            const uploader = async (path) => {
                return await cloudinary.uploads(path, 'Image');
            }

            const url = []
            const file = req.file;
            console.log(file.mimetype)

            const { path } = file;
            // console.log(path)
            if (file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/jpg' || file.mimetype !== 'image/png' || file.mimetype !== '') {
                return res.status(422).json({ Message: 'File not supported!!!' })
            }

            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
                const uploadedImage = await uploader(path)
                url.push(uploadedImage)
                fs.unlinkSync(path)

                // const imgUrl = url.map((data) =>(data.url))
                // console.log(url[0].url)

                const product = await Product.create({
                    productName, productDesc, productImage: url[0].url,
                    productCost, productQuantity, productStatus, categoryId, categoryName
                })
                console.log(product)
                return res.status(201).json(product)
            }
        }
    } catch (error) {
        console.log(error)
    }

});

// create product with multiple images
router.post('/product-images', upload.array('image'), productsValidate(), async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json({ errors: errors.array() })
    }
    const img_array = ['image/jpeg', 'image/png', 'image/jpg']

    for (const file of req.files) {
        if (!img_array.includes(file.mimetype)) {
            return res.status(422).json({ Message: 'File format not supported!!!' })
        }
    }

    const { productName, productDesc,
        productCost, productQuantity, productStatus, categoryId, categoryName } = req.body;

    const findProduct = await Product.findOne({ productName })
    if (findProduct) {
        return res.status(400).json({ Message: 'Product already exists!!!' })
    }

    else {
        const uploader = async (path) => {
            return await cloudinary.uploads(path, 'Image');
        }

        var urls = []
        const files = req.files;
        for (const file of files) {
            // console.log(file)
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath.url)
            fs.unlinkSync(path)
        }

        // urls.map((data) =>{console.log(data)})
        Product.create({
            productName, productDesc, productImage: urls,
            productCost, productQuantity, productStatus, categoryId, categoryName
        })
        return res.status(201).json({ Message: 'Products created successfully!!!' })
    }
});

// read/list all products
router.get('/', async (req, res) => {

    const products = await Product.find({}).sort({ createdAt: -1 })
    res.status(200).json({ products })

});

// read/list a product by its name
router.get('/:productName', async (req, res) => {
    const { productName } = req.params;
    const product = await Product.where("productName").equals(productName)
    res.status(200).json({ product })

});

// read/list a product by id
router.get('/:id', async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Product not found' })
    }

    const product = await Product.findById(id)
    res.status(200).json(product)

});

// find and update a product by id
router.patch('/:id', productsUpdateValidate(), async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json({ errors: errors.array() })
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Product not found' })
    }

    const product = await Product.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
    if (!product) {
        return res.status(400).json({ error: 'No such category' })
    }
    res.status(201).json(product)

});

module.exports = router;