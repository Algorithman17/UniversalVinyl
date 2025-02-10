const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const AnnonceModel = require('../models/AnnonceModel');

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

exports.myAnnonces = async (req, res) => {
    let annonces = [];
    annonces = await AnnonceModel.find({ userId: req.session.user._id });

    // Convertir chaque image en Base64 pour l'affichage dans EJS
    const annoncesWithImages = annonces.map(annonce => {
        return {
            ...annonce._doc, // Copie des données de l'annonce
            images: annonce.images.map(img => ({
                name: img.name,
                contentType: img.contentType,
                imageBase64: `data:${img.contentType};base64,${img.image.toString("base64")}`
            }))
        };
    });
    
    return res.render('./pages/userPages/myAnnonces', { user: req.session.user, annonces: annoncesWithImages });
};

exports.addAnnonceForm = (req, res) => {
    return res.render('./pages/userPages/addAnnonce', { user: req.session.user });
};

exports.addAnnonce = async (req, res) => {
    try {
        const { title, description, price, musicStyle } = req.body;
        console.log("Fichiers reçus :", req.files); // Vérification

        // Vérification du nombre d'images
        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ message: "Veuillez envoyer au moins une image" });
        }
        if (req.files.length > 3) {
            return res.status(400).json({ message: "Vous ne pouvez envoyer que 3 images maximum" });
        }

        // Transformation des fichiers en objets exploitables pour MongoDB
        const images = req.files.map(file => ({
            name: file.originalname,
            contentType: file.mimetype,
            image: file.buffer
        }));

        // Vérifie que la session utilisateur est bien définie
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const newAnnonce = new AnnonceModel({
            title,
            description,
            images,
            price,
            musicStyle,
            userId: req.session.user._id // Stocke l'ID de l'utilisateur pour lier l'annonce
        });
        await newAnnonce.save();

        return res.redirect('/my-annonces');
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.annonces = async (req, res) => {
    let annonces = await AnnonceModel.find({});
    // Convertir chaque image en Base64 pour l'affichage dans EJS
    const annoncesWithImages = annonces.map(annonce => {
        return {
            ...annonce._doc, // Copie des données de l'annonce
            images: annonce.images.map(img => ({
                name: img.name,
                contentType: img.contentType,
                imageBase64: `data:${img.contentType};base64,${img.image.toString("base64")}`
            }))
        };
    });
    return res.render('./pages/globalPages/showAllAnnonces', { user: req.session.user, annonces: annoncesWithImages });
}