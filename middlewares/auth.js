const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Récupérer le token (Bearer token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token
        req.user = decodedToken; // Ajouter les infos de l'utilisateur au `req`
        next(); // Passer au middleware suivant
    } catch (error) {
        res.status(401).json({ message: "Accès non autorisé !" });
    }
};