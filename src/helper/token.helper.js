const jwt = require("jsonwebtoken");

const maxAge = 20 * 24 * 60 * 60;
const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: maxAge});
}

module.exports = createToken;