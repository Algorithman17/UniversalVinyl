const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

// Fonction pour recevoir les données du formulaire d'enregistrement
exports.register = async (req, res) => {
    try {
        const { 
            email, password, username, 
            first, last, avatar,  
            bio, adress 
        } = req.body;

        let userExist = await UserModel.findOne({ email });
        
        if (userExist) {
            req.session.message = { type: 'error', text: "Cet email existe déjà !" };
            return res.redirect('/register-form'); // Rediriger vers le formulaire d'inscription
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashedPassword, first, last, avatar, bio, adress });
        await user.save();

        // Stocker le message de succès
        req.session.message = { type: 'success', text: `${email} vient d\'être créé !` };
        return res.redirect('/login-form'); // Redirection vers la page de connexion

    } catch (err) {
        req.session.message = { type: 'error', text: "Une erreur est survenue !" };
        return res.redirect('/register-form');
    }
};

// Fonction pour se connecter
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        let isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Créer un token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Clé secrète stockée dans .env
            { expiresIn: '2h' } // Expiration du token (ex: 2 heures)
        );

        // Stocker le token dans la session
        req.session.token = token;
        req.session.user = user;

        return res.redirect('/');

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Fonction pour afficher le profil de l'utilisateur
exports.profil = async (req, res) => {
    try {
        const user = req.session.user
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
        return res.render('./pages/userPages/profil', { user });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Fonction pour afficher le formulaire d'enregistrement
exports.registerForm = (req, res) => {
    return res.render('./pages/globalPages/register', { user: req.session.user});
};

// Fonction pour afficher le formulaire de connexion
exports.loginForm = (req, res) => {
    return res.render('./pages/globalPages/login', { user: req.session.user});
}

// Fonction pour afficher la page d'accueil
exports.home = (req, res) => {
    return res.render('./pages/globalPages/home', { user: req.session.user});
}

exports.logout = (req, res) => {
    // Supprimer le token de la session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        return res.redirect('/');
    });
};

exports.adminDashboard = (req, res) => {
    return res.render('./pages/adminPages/adminDashboard', { user: req.session.user });
};

exports.myAnnonces = (req, res) => {
    return res.render('./pages/userPages/myAnnonces', { user: req.session.user });
};