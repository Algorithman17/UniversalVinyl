const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decodedToken.user._id);

        if (!user || user.role !== 'admin') {
            res.clearCookie('token');
            return res.status(403).redirect('/');
        }

        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(403).redirect('/');
    }
};