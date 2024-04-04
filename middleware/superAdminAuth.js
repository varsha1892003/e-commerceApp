const jwt = require("jsonwebtoken");
const { env } = require('process');
const User = require('../models/user-model')

const verifyToken = async (req, res, next) => {
const token = req.headers["token"];

  if (!token) {
    return res.status(403).json({status: 403}); 
  }
  try {
    const decoded = jwt.verify(token,process.env.SECRETKEY);
    req.user = decoded;
    req.body.user = decoded;
     const userdata = await User.findOne({_id : req.user._id})
     if(userdata.role == 0 ||  userdata.role == 1 && req.user.email != 'pavan.hubresolution@gmail.com'){
      return res.status(401).send('Unauthorized');
     }
  } catch (err) {
    return res.status(401).json(err);
  }
  return next();
};

module.exports = verifyToken;