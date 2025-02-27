const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {    
        const token = req.cookies.token; // Récupérer le token stocké en cookie
        
        if (!token) {
            return res.status(403).redirect('/')
        }
        
        next();
    } catch (error) {
        next()
    }
};