const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    
    const token = req.cookies.token;

    
    if (!token) {
        return res.status(401).json({ msg: 'Not allowed, permission denied' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
       
        res.status(401).json({ msg: 'Error occurred in authentication middleware' });
    }
};
