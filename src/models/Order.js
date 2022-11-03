const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cart'
    }
    // categoryId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Category'
    // },
    // categoryName: { type: String, required: true },
    // productId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Product'
    // },
    // productName: { type: String, required: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // userName: { type: String, required: true },
    // email: { type: String, required: true }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;