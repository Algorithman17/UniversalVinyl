const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const UserModel = require('../models/UserModel');
const AnnonceModel = require('../models/AnnonceModel');

// Fonction pour recevoir les données du formulaire d'enregistrement
exports.register = async (req, res) => {
    try {
        const { 
            email, password, confirmPassword, username, 
            first, last, birthday, number, street, zip, city, country
        } = req.body;

        const address = {number, street, zip, city, country}
        
        if(password !== confirmPassword) {
            req.session.message = { type: 'error', text: "La confirmation du mot de passe a échoué !" };
            return res.redirect('/register-form'); // Rediriger vers le formulaire d'inscription
        }

        const birthdayParse = Date.parse(birthday)
        const currentDate = Date.now();
        const age = Math.floor((currentDate - birthdayParse) / (1000 * 60 * 60 * 24 * 365.25));

        if (age < 18) {
            req.session.message = { type: 'error', text: "Vous n'avez pas l'âge requis" };
            return res.redirect('/register-form'); // Rediriger vers le formulaire d'inscription
        }

        let userExist = await UserModel.findOne({ email });

        if (userExist) {
            req.session.message = { type: 'error', text: "Cet email existe déjà !" };
            return res.redirect('/register-form'); // Rediriger vers le formulaire d'inscription
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashedPassword, username, first, last, birthday, address });
        await user.save();
        
        // Stocker le message de succès
        req.session.message = { type: 'success', text: `${email} vient d\'être créé !` };

        res.locals.message = req.session.message
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
            { user }, // Payload
            process.env.JWT_SECRET, // Clé secrète stockée dans .env
            { expiresIn: '2h' } // Expiration du token (ex: 2 heures)
        );
        
        // Stocker le token dans la session
        res.cookie("token", token, { httpOnly: true, maxAge: 10000000000 });

        return res.redirect('/');

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Fonction pour afficher le profil de l'utilisateur
exports.profil = (req, res) => {
    const birthday = Date.parse(res.locals.user.birthday)
    const currentDate = Date.now();
    const age = Math.floor((currentDate - birthday) / (1000 * 60 * 60 * 24 * 365.25));

    return res.render('./pages/userPages/profil', { age });
};

// Fonction pour afficher le formulaire d'enregistrement
exports.registerForm = (req, res) => {
    if (req.session.message) {
        res.locals.message = req.session.message 
        delete req.session.message       
    } else {
        res.locals.message = undefined
    }
    return res.render('./pages/globalPages/register');
};

// Fonction pour afficher le formulaire de connexion
exports.loginForm = (req, res) => {
    if (req.session.message) {
        res.locals.message = req.session.message 
        delete req.session.message       
    } else {
        res.locals.message = undefined
    }
    return res.render('./pages/globalPages/login');
    
};

// Fonction pour afficher la page d'accueil
exports.home = (req, res) => {
    return res.render('./pages/globalPages/home');
};

exports.logout = (req, res) => {
    // Supprimer le token des cookies
    res.clearCookie('token');
    return res.redirect('/');
};

exports.adminDashboard = (req, res) => {
    return res.render('./pages/adminPages/adminDashboard');
};

exports.myAnnonces = async (req, res) => {
    let annonces = [];
    
    const userId = res.locals.user._id;
    
    annonces = await AnnonceModel.find({ userId });
    
    const annoncesWithImages = annonces.map(annonce => {
        return {
            ...annonce._doc, // Copie des données de l'annonce
            images: annonce.images.map(img => ({
                name: img.name,
                contentType: img.contentType,
                imageUrl: img.imageUrl // Utiliser l'URL relative pour l'affichage
            }))
        };
    });
    
    return res.render('./pages/userPages/myAnnonces', { annonces: annoncesWithImages, styleUrl: "annonceCard" });
};

exports.addAnnonceForm = (req, res) => {
    return res.render('./pages/userPages/addAnnonce');
};

exports.addAnnonce = async (req, res) => {
    try {
        const { title, description, price, musicStyle } = req.body;

        // Vérification du nombre d'images
        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ message: "Veuillez envoyer au moins une image" });
        }
        if (req.files.length > 3) {
            return res.status(400).json({ message: "Vous ne pouvez envoyer que 3 images maximum" });
        }
        console.log("REQ FILES ", req.files);
        
        // Créer une liste d'URLs d'images
        const images = req.files.map(file => ({
            name: file.originalname,
            contentType: file.mimetype,
            imageUrl: `${file.filename}` // Stocker l'URL relative dans la base de données
        }));
        console.log("images", images);
        
        const newAnnonce = new AnnonceModel({
            title,
            description,
            images,
            price,
            musicStyle,
            userId: res.locals.user._id // Stocke l'ID de l'utilisateur pour lier l'annonce
        });
        await newAnnonce.save();

        return res.redirect('/my-annonces');
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.annonces = async (req, res) => {
    let annonces = await AnnonceModel.find({});
    const annoncesWithImages = annonces.map(annonce => {
        return {
            ...annonce._doc, // Copie des données de l'annonce
            images: annonce.images.map(img => ({
                name: img.name,
                contentType: img.contentType,
                imageUrl: img.imageUrl // Utiliser l'URL relative pour l'affichage
            }))
        };
    });
    
    return res.render('./pages/globalPages/showAllAnnonces', { annonces: annoncesWithImages, styleUrl: "annonceCard" });
};

exports.deleteAnnonce = async (req, res) => {
    try {
        const annonceId = req.params.id;
        
        // Trouver l'annonce à supprimer
        const annonce = await AnnonceModel.findById(annonceId);

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Supprimer les images du dossier "uploads"
        annonce.images.forEach(img => {
            const imagePath = path.join(__dirname, '..', 'public/uploads', img.imageUrl);  // Assurez-vous que le nom correspond bien au fichier dans "uploads"
            
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);  // Supprime l'image du système de fichiers
            }
        });

        // Supprimer l'annonce de la base de données
        await AnnonceModel.deleteOne({ _id: annonceId });

        return res.redirect('/my-annonces');  // Rediriger vers la liste des annonces après la suppression
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce', error });
    }
}

exports.editAnnonceForm = async (req, res) => {
    try {
        const annonceId = req.params.id;
        const annonce = await AnnonceModel.findById(annonceId);

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        return res.render('./pages/userPages/editAnnonce', { annonce });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
}

exports.editAnnonce = async (req, res) => {
    try {
        const annonceId = req.params.id;
        const { title, description, price, musicStyle } = req.body;

        if (req.files.length > 3) {
            return res.status(400).json({ message: "Vous ne pouvez envoyer que 3 images maximum" });
        }

        // Trouver l'annonce à modifier
        const annonce = await AnnonceModel.findById(annonceId);

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Vérifier si de nouvelles images ont été téléchargées
        if (req.files && req.files.length > 0) {
            // Supprimer les anciennes images du dossier "uploads"
            annonce.images.forEach(img => {
                const imagePath = path.join(__dirname, '..', 'public/uploads', img.imageUrl);  // Assurez-vous que le nom correspond bien au fichier dans "uploads"
                
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);  // Supprime l'image du système de fichiers
                }
            });

            // Créer une liste d'URLs d'images
            const images = req.files.map(file => ({
                name: file.originalname,
                contentType: file.mimetype,
                imageUrl: `${file.filename}` // Stocker l'URL relative dans la base de données
            }));
            
            annonce.images = images;
        }

        annonce.title = title;
        annonce.description = description;
        annonce.price = price;
        annonce.musicStyle = musicStyle;

        await annonce.save();

        return res.redirect('/my-annonces');
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
}

exports.showAnnonce = async (req, res) => {
    try {
        const annonceId = req.params.id
        const annonce = await AnnonceModel.findById(annonceId)
        
        const token = req.cookies.token

        let user = {}
        if(token) {
            user = jwt.verify(token, process.env.JWT_SECRET).user;
        }
        
        let myAnnonce;
        if (token === undefined) {
            myAnnonce = false
        } else if (annonce.userId === user._id) {
            myAnnonce = true  
        }
        
        return res.render('./pages/userPages/showAnnonce', { annonce, myAnnonce, styleUrl: "showAnnonce"})
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'affichage de l\'annonce', error });
    }

}

exports.cookieTheme = (req, res, next) => {
    res.cookie("theme", "#6efaf3", { httpOnly: true, maxAge: 1000000000 }); // 115 jours
    res.redirect('/');
}