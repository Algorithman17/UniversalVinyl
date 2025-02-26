const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log("Authentification...");
        
        const token = req.cookies.token; // Récupérer le token stocké en cookie
        
        if (!token) throw new Error("Pas de token");

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        
        // Vérifier si le token est sur le point d'expirer (ex: < 10 min restantes)
        const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        // console.log("Expiration du token:", decodedToken.exp - now, "secondes");
        
        if (decodedToken.exp - now < 600) { // Si expiration < 10 minutes
            console.log("Token bientôt expiré, génération d'un nouveau...");
            const newToken = jwt.sign(
                { token }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2h' }
            );
            req.cookies.token = newToken; // Stocker le nouveau token en cookie
        }
        
        next();
    } catch (error) {
        next()
    }
};