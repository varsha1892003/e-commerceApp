const jwt = require("jsonwebtoken");
const { env } = require('process');

const verifyToken = async (req, res, next) => {
    const token = req.headers["token"];
   

    if (!token) {
        return res.status(403).json({ status: 403 });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY);

        req.user = decoded;
        req.body.user = decoded;
        

    } catch (err) {
        return res.status(401).json(err);
    }
    return next();
}
module.exports = verifyToken;