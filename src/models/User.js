const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {type: String, required: [true, 'UserName Shoulkd not be null']},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
},
{timestamps: true})

const User = mongoose.model('User', userSchema);
module.exports = User;