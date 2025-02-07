const UserModel = require('../models/UserModel');

// Middleware pour vérifier si l'utilisateur est admin
module.exports = async (req, res, next) => {
    const user = await UserModel.findById(req.session.user._id); // req.userId doit être défini via l'authentification
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Accès refusé, admin requis." });
    }
    next();
};