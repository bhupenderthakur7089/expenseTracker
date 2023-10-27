const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
    const userToken = req.header('authorization');
    const user = jwt.verify(userToken, 'h31k2h128dqdhdia');
    const id = user.userId;
    User
        .findByPk(id)
        .then(user => {
            console.log(user);
            req.user = user;
            console.log(req.user);
            next();
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({ success: false });
        });

}