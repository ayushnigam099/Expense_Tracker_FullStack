const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, '61b809c35a715f69b20b1911b54c09c62f96806377161da4b8fa598c29b0893a');
        User.findByPk(user.userId).then(user => {
            req.user = user; 
            next();
        })
      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
      }
}

module.exports = {
    authenticate
}