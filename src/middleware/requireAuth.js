const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  // verify user is authenticated
  const token = req.cookies.jwt;
 
  if (!token) {
    return res.status(401).json({ error: "You need to sign in" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }, { password: 0 })
    console.log(req.user)
    next();
  }
  catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const isAdmin = (req, res, next) =>{
  if(req.user && req.user.isAdmin){
    next()
  }else{
    res.status(401).send({ message: 'Invalid Admin token'})
  }
};  

module.exports = { isAuth, isAdmin };