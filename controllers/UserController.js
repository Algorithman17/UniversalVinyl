const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const UserModel = require('../models/UserModel');
const AnnonceModel = require('../models/AnnonceModel');
const ConversationModel = require('../models/ConversationModel');

// Fonction pour recevoir les données du formulaire d'enregistrement
exports.register = async (req, res) => {
    try {
        const { email, password, confirmPassword, username, first, last, birthday, number, street, zip, city, country } = req.body;
        const address = { number, street, zip, city, country };

        const errors = [];

        if (!username || username.length < 3) {
            errors.push("Le nom d'utilisateur doit contenir au moins 3 caractères.");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            errors.push("L'adresse e-mail n'est pas valide. Elle doit contenir : lettres, chiffres, points (.), tirets (-), underscores (_), et un domaine comme exemple.com");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            errors.push("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
        }

        if (password !== confirmPassword) {
            errors.push("La confirmation du mot de passe a échoué !");
        }

        const age = Math.floor((Date.now() - Date.parse(birthday)) / (1000 * 60 * 60 * 24 * 365.25));
        if (age < 18) {
            errors.push("Vous n'avez pas l'âge requis.");
        }

        const userExist = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (userExist) {
            errors.push(userExist.email === email ? "Cet email existe déjà !" : "Ce nom d'utilisateur existe déjà !");
        }

        if (errors.length > 0) {
            req.session.message = { type: 'error', text: errors };
            return res.redirect('/register-form');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashedPassword, username, first, last, birthday, address, bio: "", avatarUrl: "" });
        await user.save();
        
        req.session.message = { type: 'success', text: [`${email} vient d'être créé !`] };
        return res.redirect('/login-form');
    } catch (err) {
        req.session.message = { type: 'error', text: ["Une erreur est survenue !"] };
        return res.redirect('/register-form');
    }
};

// Fonction pour se connecter
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const findUser = await UserModel.findOne({ email });
        
        if (!findUser) {
            req.session.message = { type: 'error', text: [`${email} introuvable !`] };
            return res.redirect('/login-form')
        }

        let isValid = await bcrypt.compare(password, findUser.password);

        if (!isValid) {
            req.session.message = { type: 'error', text: [`Mot de passe incorrect !`] };
            return res.redirect('/login-form')
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

    return res.render('./pages/profil', { age, userRole, styleUrl: ["components/profil"] });
};

// Fonction pour afficher le formulaire d'enregistrement
exports.registerForm = (req, res) => {
    if (req.session.message) {
        res.locals.message = req.session.message 
        delete req.session.message       
    } else {
        res.locals.message = undefined
    }
    return res.render('./pages/register', { styleUrl: ["components/register"] });
};

// Fonction pour afficher le formulaire de connexion
exports.loginForm = (req, res) => {
    if (req.session.message) {
        res.locals.message = req.session.message 
        delete req.session.message       
    } else {
        res.locals.message = undefined
    }
    return res.render('./pages/login', { styleUrl: ["components/login"] });
    
};

// Fonction pour afficher la page d'accueil
exports.home = (req, res) => {
    return res.render('./pages/home', { styleUrl: ["components/home"] });
};

exports.logout = (req, res) => {
    // Supprimer le token des cookies
    res.clearCookie('token');
    return res.redirect('/');
};

exports.myAnnonces = async (req, res) => {
    try {
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
    
    return res.render('./pages/myAnnonces', { annonces: annoncesWithImages, styleUrl: ["components/annonceCard"] });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'affichage des annonces', error });
    }
};

exports.addAnnonceForm = (req, res) => {
    return res.render('./pages/addAnnonce', { styleUrl: ["components/addAnnonce"] });
};

exports.addAnnonce = async (req, res) => {
    try {
        const { title, description, price, musicStyle } = req.body;

        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ message: "Veuillez envoyer au moins une image" });
        }
        if (req.files.length > 3) {
            return res.status(400).json({ message: "Vous ne pouvez envoyer que 3 images maximum" });
        }

        // Upload images sur Cloudinary
        const images = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "universalvinyl/annonces",
                format: "webp"
            });
            images.push({
                imageUrl: result.secure_url,
                publicId: result.public_id
            });
        }

        const newAnnonce = new AnnonceModel({
            title,
            description,
            images,
            price,
            musicStyle,
            userId: res.locals.user._id
        });

        await newAnnonce.save();
        return res.redirect('/my-annonces');
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.annonces = async (req, res) => {
    try {
        let filter = req.params.filter
        if (filter !== "all") {
            let annonces = await AnnonceModel.find({musicStyle: filter});
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
            filter = filter.toUpperCase()
            return res.render('./pages/showAllAnnonces', { filter, annonces: annoncesWithImages, styleUrl: ["components/annonceCard"] });
        }

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

        return res.render('./pages/showAllAnnonces', { filter, annonces: annoncesWithImages, styleUrl: ["components/annonceCard"] });
    } catch (error) {   
        return res.status(500).json({ message: 'Erreur lors de l\'affichage des annonces', error });
    }
};

exports.deleteAnnonce = async (req, res) => {
    try {
        const annonceId = req.params.id;
        const annonce = await AnnonceModel.findById(annonceId);

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Supprimer les images de Cloudinary
        for (const img of annonce.images) {
            if (img.publicId) {
                await cloudinary.uploader.destroy(img.publicId);
            }
        }

        await ConversationModel.deleteMany({ annonceId: annonceId });
        await AnnonceModel.deleteOne({ _id: annonceId });

        return res.redirect('/my-annonces');
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce', error });
    }
}

exports.editAnnonceForm = async (req, res) => {
    try {
        const annonceId = req.params.id
        const data = req.params.data

        const annonce = await AnnonceModel.findById(annonceId)

        let dateAnnonce = annonce.createdAt
        const dayAnnonce = dateAnnonce.getDate()
        const monthAnnonce = dateAnnonce.getMonth() + 1
        const yearAnnonce = dateAnnonce.getFullYear()
        dateAnnonce = `${dayAnnonce}/${monthAnnonce}/${yearAnnonce}`

        const userAnnonce = res.locals.user.username

        return res.render(`./pages/editAnnonce`, { data, annonce, dateAnnonce, userAnnonce, styleUrl: ['components/showAnnonce', 'components/editAnnonce'], carousel: "annonceCarousel" })
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
}

exports.editAnnonce = async (req, res) => {
    try {
        const annonceId = req.params.id;
        const { title, description, price, musicStyle } = req.body;
        const annonce = await AnnonceModel.findById(annonceId);

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        if (req.files && req.files.length > 0) {
            // Supprimer les anciennes images Cloudinary
            for (const img of annonce.images) {
                if (img.publicId) {
                    await cloudinary.uploader.destroy(img.publicId);
                }
            }
            // Upload des nouvelles images
            const images = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "universalvinyl/annonces",
                    format: "webp"
                });
                images.push({
                    imageUrl: result.secure_url,
                    publicId: result.public_id
                });
                fs.unlinkSync(file.path);
            }
            annonce.images = images;
        }

        if (typeof title !== "undefined") annonce.title = title;
        if (typeof description !== "undefined") annonce.description = description;
        if (typeof price !== "undefined") annonce.price = price;
        if (typeof musicStyle !== "undefined") annonce.musicStyle = musicStyle;

        await annonce.save();
        return res.redirect(`/show-annonce/${annonce.id}`);
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
}

exports.showAnnonce = async (req, res) => {
    try {
        let userConnected = false

        if(res.locals.user) {
            userConnected = true
        }
        
        const { annonceId } = req.params
        
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
        } else if (annonce.userId.toHexString() === user._id) {
            myAnnonce = true  
        }

        let musicStyle = String(annonce.musicStyle).charAt(0).toUpperCase() + String(annonce.musicStyle).slice(1);
        
        let dateAnnonce = annonce.createdAt
        const dayAnnonce = dateAnnonce.getDate()
        const monthAnnonce = dateAnnonce.getMonth() + 1
        const yearAnnonce = dateAnnonce.getFullYear()
        dateAnnonce = `${dayAnnonce}/${monthAnnonce}/${yearAnnonce}`
        
        return res.render('./pages/showAnnonce', { userConnected, annonce, musicStyle, myAnnonce, styleUrl: ["components/showAnnonce"], carousel: "annonceCarousel", userAnnonce, dateAnnonce })

    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'affichage de l\'annonce', error });
    }
}

exports.updateProfil = async (req, res) => {
    try {
        const findUser = await UserModel.findById(res.locals.user._id);
        const { deleteAvatar } = req.body;

        // Supprimer l'image sur Cloudinary si demandé
        if (deleteAvatar && findUser.avatarPublicId) {
            await cloudinary.uploader.destroy(findUser.avatarPublicId);
            findUser.avatarUrl = '';
            findUser.avatarPublicId = '';
        }

        // Nouvelle image => supprimer l'ancienne si présente
        if (req.file) {
            if (findUser.avatarPublicId) {
                await cloudinary.uploader.destroy(findUser.avatarPublicId);
            }
            findUser.avatarUrl = req.file.path; // URL complète Cloudinary
            findUser.avatarPublicId = req.file.filename; // public_id Cloudinary
        }

        // Mise à jour des autres champs
        Object.keys(req.body).forEach(key => {
            if (key in findUser) findUser[key] = req.body[key];
        });

        // Mise à jour du token JWT avec les nouvelles infos
        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = decodedToken.user;
        user.avatarUrl = findUser.avatarUrl;
        user.address = { ...findUser.address };
        user.bio = findUser.bio;
        user.username = findUser.username;
        user.last = findUser.last;
        user.first = findUser.first;

        const newToken = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });

        res.clearCookie('token');
        res.cookie('token', newToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });

        await findUser.save();
        return res.redirect('/profil');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error });
    }
};

exports.adminDashboard = (req, res) => {
    try {
        let userSearch = false
        console.log("userSearch:", userSearch);
        let annoncesUser = []
        return res.render('./pages/adminDashboard', { userSearch, annoncesUser, styleUrl: ["components/adminDashboard"] })
    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de l\'affichage', error });
    }
}

exports.searchUser = async (req, res) => {
    try {
        const { username } = req.body

        const userSearch = await UserModel.findOne({ username })
        console.log("userSearch:", userSearch);
        
        let annoncesUser = []
        if (userSearch) {
            annoncesUser = await AnnonceModel.find({userId: userSearch._id.toString()})
        } 

        return res.render('./pages/adminDashboard', { userSearch, annoncesUser, styleUrl: ["components/adminDashboard", "components/conversations"] })
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

exports.startConversation = async (req, res) => {
    try {
        const { receiver, sender, annonceId } = req.body

        const conversationExist = await ConversationModel.find({ members: [receiver, sender], annonceId });

        if(conversationExist.length === 1) {
            return res.redirect(`/chat/${conversationExist[0]._id}`)
        } else {
            const newConversation = new ConversationModel({ members: [receiver, sender], annonceId });
            await newConversation.save();
            return res.redirect(`/chat/${newConversation._id}`)
        }

    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de l\'envoi', error });
    }
}

exports.conversations = async (req, res) => {
    try {
        const username = res.locals.user.username

        const conversations = await ConversationModel.find({ members: username })

        const annonces = []
        if(conversations.length > 0) {
            for (const conversation of conversations) {
                
                if (conversation.lastMessage === "") {
                    await conversation.deleteOne()
                    break
                }

                const dateLastMessage = conversation.messages[conversation.messages.length-1].createdAt;
                const date = new Date(dateLastMessage);
                const formattedLastDate = date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                let annonce = await AnnonceModel.findById(conversation.annonceId);
                annonces.push({
                    conversationId: conversation._id,
                    annonceId: conversation.annonceId,
                    recipient: conversation.members.filter(member => member !== username),
                    title: annonce.title,
                    price: annonce.price,
                    musicStyle: annonce.musicStyle,
                    imageUrl: annonce.images[0].imageUrl,
                    lastMessage: conversation.lastMessage,
                    dateLastMessage: formattedLastDate
                })
            }
        } else {
            return res.render('./pages/conversations', { annonces, styleUrl: ["components/conversations"] })
        }
        console.log(annonces)
        return res.render('./pages/conversations', { annonces, styleUrl: ["components/conversations"] })
    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de l\'affichage', error });
    }
}

exports.chat = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await ConversationModel.findById(id);

        let annonce = await AnnonceModel.findById(conversation.annonceId);

        const userAnnonce = await UserModel.findById(annonce.userId)

        return res.render('./pages/chat', { userAnnonce, conversation, annonce, user: res.locals.user, styleUrl: ["components/chat"] });

    } catch (error) {
        return res.status(404).json({ message: 'Erreur lors de l\'affichage', error });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params; // ID de la conversation
        const conversation = await ConversationModel.findById(id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation non trouvée' });
        }
        return res.json(conversation.messages);
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération des messages', error });
    }
};

exports.sendMessage = async (data) => {
    try {
        const { roomId, sender, message } = data;

        // Ajouter le message dans la clé 'messages' de la conversation
        await ConversationModel.findByIdAndUpdate(
            roomId,
            { $push: { messages: { sender, message, createdAt: new Date() } }, lastMessage: message },
            { new: true }
        );

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du message :', error);
    }
};

exports.cookieTheme = (req, res, next) => {
    const color = req.body.theme
    
    res.cookie("theme", `${color}`, { httpOnly: true, maxAge: 1000000000 }); // 115 jours
    
    res.redirect('/');
}
