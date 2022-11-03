const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {type: String, required: true},
    productDesc: {type: String, required: true},
    productImage: {type: Array, required: true},
    productCost: {type: Number, default: true},
    productQuantity: {type: Number, default: true, min:0},
    productStatus: {type: Boolean, default: true},
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    categoryName: {
        type: mongoose.Schema.Types.String,
        required: true,
        ref: 'Category'
    }

},
{timestamps: true})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;