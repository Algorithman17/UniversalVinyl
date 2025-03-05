const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const UserModel = require('../models/UserModel');
const AnnonceModel = require('../models/AnnonceModel');
const { log } = require('console');

// Fonction pour recevoir les données du formulaire d'enregistrement
exports.register = async (req, res) => {
    try {
        const { 
            email, password, confirmPassword, username, 
            first, last, birthday, number, street, zip, 
            city, country
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

        let userExist = await UserModel.find({ $or: [{ email }, { username }] });

        if (userExist.length === 1) {
            userExist.forEach(user => {
                if (user.email === email) {
                    req.session.message = { type: 'error', text: "Cet email existe déjà !" };
                }
                if (user.username === username) {
                    req.session.message = { type: 'error', text: "Ce nom d'utilisateur existe déjà !" };
                }
            });

            return res.redirect('/register-form'); // Rediriger vers le formulaire d'inscription
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ 
            email, password: hashedPassword, 
            username, first, last, birthday, 
            address, bio: "", avatarUrl: "" 
        });
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
        
        const findUser = await UserModel.findOne({ email });
        
        if (!findUser) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        let isValid = await bcrypt.compare(password, findUser.password);

        if (!isValid) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Supprimer le mot de passe de l'objet utilisateur
        const user = { ...findUser._doc };
        delete user.password;
        
        // Créer un token JWT
        const token = jwt.sign(
            { user }, // Payload
            process.env.JWT_SECRET, // Clé secrète stockée dans .env
            { expiresIn: "2h" } // Expiration du token (ex: 2 heures)
        );
        
        // Stocker le token dans la session
        res.cookie("token", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 }); // 2 heures
        
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

    let userRole = ""
    if (res.locals.user.role === "admin") {
        userRole = "ADMINISTRATEUR"
    } else {
        userRole = "UTILISATEUR"
    }

    return res.render('./pages/profil', { age, userRole, styleUrl: "profil" });
};

// Fonction pour afficher le formulaire d'enregistrement
exports.registerForm = (req, res) => {
    if (req.session.message) {
        res.locals.message = req.session.message 
        delete req.session.message       
    } else {
        res.locals.message = undefined
    }
    return res.render('./pages/register');
};

// Fonction pour afficher le formulaire de connexion
exports.loginForm = (req, res) => {
    if (req.session.message) {
        res.locals.message = req.session.message 
        delete req.session.message       
    } else {
        res.locals.message = undefined
    }
    return res.render('./pages/login');
    
};

// Fonction pour afficher la page d'accueil
exports.home = (req, res) => {
    return res.render('./pages/home');
};

exports.logout = (req, res) => {
    // Supprimer le token des cookies
    res.clearCookie('token');
    return res.redirect('/');
};

exports.myAnnonces = async (req, res) => {
    let annonces = [];
    
    const userId = res.locals.user.id;
    
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
    
    return res.render('./pages/myAnnonces', { annonces: annoncesWithImages, styleUrl: "annonceCard" });
};

exports.addAnnonceForm = (req, res) => {
    return res.render('./pages/addAnnonce');
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
        
        // Créer une liste d'URLs d'images
        const images = req.files.map(file => ({
            name: file.originalname,
            contentType: file.mimetype,
            imageUrl: `${file.filename}` // Stocker l'URL relative dans la base de données
        }));
        
        const newAnnonce = new AnnonceModel({
            title,
            description,
            images,
            price,
            musicStyle,
            userId: res.locals.user.id, // Stocke l'ID de l'utilisateur pour lier l'annonce
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
    
    return res.render('./pages/showAllAnnonces', { annonces: annoncesWithImages, styleUrl: "annonceCard" });
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

        return res.render('./pages/editAnnonce', { annonce });
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

        const userAnnonce = await UserModel.findById({ _id: annonce.userId })
        
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
        
        return res.render('./pages/showAnnonce', { annonce, myAnnonce, styleUrl: "showAnnonce", userAnnonce })
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'affichage de l\'annonce', error });
    }
}

exports.updateProfilForm = (req, res) => {
    try {
    let keyInfo = req.params.info
    const valueInfo = res.locals.user[keyInfo]

    let keyInfoTranslate;

    switch(keyInfo) {
        case "username": keyInfoTranslate = "Nom d'utilisateur" 
        break;
        case "last": keyInfoTranslate = "Nom de famille"
        break;
        case "first": keyInfoTranslate = "Prénom"
        break;
        case "address": keyInfoTranslate = "Adresse"
        break;
        case "bio": keyInfoTranslate = "Bio"
    }

    return res.render('./pages/updateProfil', { keyInfoTranslate, keyInfo, valueInfo })
    } catch (error){
        return res.status(500).json({ message: 'Erreur lors de l\'affichage du formulaire', error });
    }
}

exports.updateProfil = async (req, res) => {
    try {
        const findUser = await UserModel.findById(res.locals.user.id)
        const { deleteAvatar } = req.body

        if(deleteAvatar) {
            const imagePath = path.join(__dirname, '..', 'public/uploads', findUser.avatarUrl);  // Assurez-vous que le nom correspond bien au fichier dans "uploads"
                
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);  // Supprime l'image du système de fichiers
            }
            findUser.avatarUrl = ""
        }
        
        // Vérifier si de nouvelles images ont été téléchargées
        if (req.file) {
            if(findUser.avatarUrl === "") {
                findUser.avatarUrl = req.file.filename
            } else {
                // Supprimer les anciennes images du dossier "uploads"
                const imagePath = path.join(__dirname, '..', 'public/uploads', findUser.avatarUrl);  // Assurez-vous que le nom correspond bien au fichier dans "uploads"
                
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);  // Supprime l'image du système de fichiers
                }
                findUser.avatarUrl = req.file.filename
            }
        }
        
        let obj = req.body
        
        if(req.body.number) {
            findUser.address.number = req.body.number
            findUser.address.street = req.body.street
            findUser.address.zip = req.body.zip
            findUser.address.city = req.body.city
            findUser.address.country = req.body.country
        }
        
        const key = Object.keys(obj)[0]
        
        switch(key) {
            case "username": 
            let userExist = await UserModel.find({ username: obj[key] });
            console.log("userExist", userExist);
            
            if (userExist.length) {
                console.log("Ce nom d'utilisateur existe déjà !");
                // req.session.message = { type: 'error', text: "Ce nom d'utilisateur existe déjà !" };
                return res.redirect('/profil')
            }
            findUser.username = obj[key]
            break;
            case "first": findUser.first = obj[key]
            break;
            case "last": findUser.last = obj[key]
            break;
            case "bio": findUser.bio = obj[key]
            break;
            case "number": findUser.address.number = obj[key]
            break;
            case "street": findUser.address.street = obj[key]
            break;
            case "zip": findUser.address.zip = obj[key]
            break; 
            case "city": findUser.address.city = obj[key]
            break;
            case "country": findUser.address.country = obj[key]
            break;
            default: console.log("defaut");
        }

        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = decodedToken.user
        user.avatarUrl = findUser.avatarUrl
        user.address.number = findUser.address.number
        user.address.street = findUser.address.street
        user.address.zip = findUser.address.zip
        user.address.city = findUser.address.city
        user.address.country = findUser.address.country
        user.bio = findUser.bio
        user.username = findUser.username
        user.last = findUser.last
        user.first = findUser.first


        const newToken = jwt.sign(
                        { user }, 
                        process.env.JWT_SECRET, 
                        { expiresIn: "2h" }
                    );

        res.clearCookie('token');
        res.cookie('token', newToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000});

        await findUser.save()
        
        return res.redirect('/profil')
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'envoi du formulaire', error });
    }
}

exports.adminDashboard = (req, res) => {
    try {
        let userSearch = {}
        
        return res.render('./pages/adminDashboard', { userSearch })
    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de l\'affichage', error });
    }
}

exports.searchUser = async (req, res) => {
    try {
        const { username } = req.body
        const userSearch = await UserModel.findOne({ username })

        return res.render('./pages/adminDashboard', { userSearch })
    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de l\'affichage', error });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body
        
        // Trouver l'annonce à supprimer
        const annonces = await AnnonceModel.find({ userId: userId });
        
         if (annonces) {
             // Supprimer les images du dossier "uploads"
             annonces.forEach(annonce => {
                 annonce.images.forEach(img => {
     
                      const imagePath = path.join(__dirname, '..', 'public/uploads', img.imageUrl);  // Assurez-vous que le nom correspond bien au fichier dans "uploads"
     
                      if (fs.existsSync(imagePath)) {
                          fs.unlinkSync(imagePath);  // Supprime l'image du système de fichiers
                      }
                 });
             });
      
              // Supprimer l'annonce de la base de données
              await AnnonceModel.deleteMany({ userId: userId });
         }

        await UserModel.deleteOne({ _id: userId })

        return res.redirect('/adminDashboard')
    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de la suppression', error });
    }
}

exports.sendMessageForm = (req, res) => {
    const annonceUsername = req.params.username
    const annonceId = req.params.annonceId
    
    return res.render('./pages/sendMessage', { annonceUsername, annonceId })
}

exports.sendMessage = async (req, res) => {
    const annonceId = req.params.annonceId
    const usernameParams = req.params.username
    console.log(req.params);
    
    // const userAnnonce = await UserModel.find({ username: usernameParams })

    console.log("userAnnonce", annonceId);
    
    // envoyer les données vers la base de l'utilisateur
    return res.redirect(`/showAnnonce/${annonceId}`)
}

exports.cookieTheme = (req, res, next) => {
    res.cookie("theme", "#6efaf3", { httpOnly: true, maxAge: 1000000000 }); // 115 jours
    res.redirect('/');
}