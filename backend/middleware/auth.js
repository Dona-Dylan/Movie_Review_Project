// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports = function (req, res, next) {
//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY4ZTkxNjIyMDU4ODM0ZjU5ZmNlNzMwIn0sImlhdCI6MTcyMDYyMDE3MCwiZXhwIjoxNzIwNjIzNzcwfQ.8n5Xuub3w24o6zHF7ABrKGvwr_8JM-osLn7Rmql7TtY';
//     console.clear()
//     console.log("request here",token)

//     try {
        
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.user;
//         next();
//     } catch (err) {
       
//         res.status(401).json({ msg: 'Error occurred in authentication middleware', error: err });
//     }

//     // if (!token) {
//     //     // return res.status(401).json({ msg: 'Not allowed, permission denied' });
//     //     // return res.status(200).json({ msg: "ok" })
//     //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     //     req.user = decoded.user;
//     //     next();
//     // }
// };





const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.clear();
    console.log("Request received with token:", token);

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Error occurred in authentication middleware', error: err });
    }
};
