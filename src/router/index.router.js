const express = require("express");
const router = express.Router();
const {register, login, logout} = require("../controller/userController");
const { isAuth, isAdmin } = require("../middleware/requireAuth");
const adminRouter = require('./admin/index.admin');
const userRouter = require('./user/index.user');
const cartItems = require("./user/cartItems");
const bookOrders = require("./user/bookOrders");

// register/login
router.post('/register', register)
router.post('/user-login', login)

// admin routes- private api
router.use('/admin', isAuth, isAdmin, adminRouter);
router.get('/user-logout', logout);

// user routes- public api
router.use('/user', userRouter);

// add to cart
router.use('/cartItems', isAuth, cartItems);

// booking orders
router.use('/bookOrders', isAuth, bookOrders);

module.exports = router;