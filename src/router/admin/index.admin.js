const { Router } = require('express');
const router = Router();
const categoryRouter = require('./category');
const productsRouter = require('./products');
const adminDashboard = require("./admin-dashboard");

router.use('/category', categoryRouter);
router.use('/products', productsRouter);
router.use('/orders-dashboard', adminDashboard);

module.exports = router;