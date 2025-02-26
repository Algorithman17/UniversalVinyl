const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken')

// Middleware pour vérifier si l'utilisateur est admin
module.exports = async (req, res, next) => {
    const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    if(decodedToken) {
        console.log(decodedToken);
        const userId = decodedToken.user._id
        const user = await UserModel.findById(userId); // req.userId doit être défini via l'authentification
        
        if (!user || user.role !== 'admin') {
            return res.status(403).redirect('/login');
        }
    }
    next();
};