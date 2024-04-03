const jwt = require("jsonwebtoken");
const { env } = require('process');

const verifyToken = (req, res, next) => {
const token = req.headers["token"];

  if (!token) {
    return res.status(403).json({status: 403}); 
  }
  try {
    const decoded = jwt.verify(token,process.env.SECRETKEY);
    req.user = decoded;
    req.body.user = decoded;
    if (req.user.email == 'pavan.hubresolution@gmail.com'){
      return res.status(401).json(err);  
    } 
  } catch (err) {
    return res.status(401).json(err);
  }
  return next();
};

module.exports = verifyToken;