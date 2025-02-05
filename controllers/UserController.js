const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

// Fonction pour recevoir les données du formulaire d'enregistrement
exports.register = async function (req, res) {
    try {
        const { email, password, first, last, avatar, age } = req.body;

        let userExist = await User.findOne({ email });
        if (userExist) {
            req.session.message = { type: 'error', text: "Cet email existe déjà !" };
            return res.redirect('/register-form'); // Rediriger vers le formulaire d'inscription
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword, first, last, avatar, age });
        await user.save();

        // Stocker le message de succès
        req.session.message = { type: 'success', text: `${email} vient d\'être créé !` };

        res.redirect('/login-form'); // Redirection vers la page d'accueil

    } catch (err) {
        req.session.message = { type: 'error', text: "Une erreur est survenue !" };
        res.redirect('/register-form');
    }
};

// Fonction pour se connecter
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

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

        return res.status(200).json({
            message: `Bienvenue ${user.first} !`,
            token 
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Fonction pour afficher le profil de l'utilisateur
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        console.log(req)
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
        return res.status(200).json({ message: `Bienvenue, ${req.user.email}` });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Fonction pour afficher le formulaire d'enregistrement
exports.showRegisterForm = (req, res) => {
    res.render('./pages/register');
};

// Fonction pour afficher le formulaire de connexion
exports.showLoginForm = (req, res) => {
    res.render('./pages/login');
}

// Fonction pour afficher la page d'accueil
exports.home = (req, res) => {
    res.render('./pages/home');
}