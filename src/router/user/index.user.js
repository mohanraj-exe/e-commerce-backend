const { Router } = require('express');
const router = Router();
const categoriesRoute = require("./all-categories");
const productsRoute = require("./all-products");

router.use('/all-categories',categoriesRoute);
router.use('/all-products',productsRoute);

module.exports = router;