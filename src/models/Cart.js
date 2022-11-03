const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({

    cartItems: [{
        categoryName:{
            type: mongoose.Schema.Types.String,
            required: true,
            ref: 'Category'
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        productName:{
            type: mongoose.Schema.Types.String,
            required: true,
            ref: 'Product'
        },
        productQuantity:{
            type: Number,
            required: true
        }
    }],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName:{
        type: mongoose.Schema.Types.String,
        required: true,
        ref: 'User'
    },
    email:{
        type: mongoose.Schema.Types.String,
        required: true,
        ref: 'User'
    }
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;