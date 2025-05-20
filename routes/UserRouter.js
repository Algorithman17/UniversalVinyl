// Importation d'Express pour créer des routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import du middleware
const isAdmin = require('../middlewares/isAdmin'); // Import du middleware

// Importation du contrôleur des users
const Controller = require('../controllers/Controller');

const multer = require("multer");
// Définir le stockage des fichiers

const { storage } = require('../middlewares/cloudinary');

// Initialize multer
const upload = multer({ storage });

// Définition des routes
router.get("/", Controller.home);

router.get("/register-form", Controller.registerForm);

router.post("/register", Controller.register)

router.get("/login-form", Controller.loginForm)

router.post("/login", Controller.login)

router.get('/profil', auth, Controller.profil);

router.get('/logout', auth, Controller.logout);

router.get('/my-annonces', auth, Controller.myAnnonces);

router.get('/add-annonce', auth, Controller.addAnnonceForm);

router.post('/add-annonce', auth, upload.array('images', 3), Controller.addAnnonce);

router.get('/annonces/:filter', Controller.annonces);

router.post('/delete-annonce/:id', auth, Controller.deleteAnnonce)

router.get('/edit-annonce/:id/:data', auth, Controller.editAnnonceForm)

router.post('/edit-annonce/:id', auth, upload.array('images', 3), Controller.editAnnonce)

router.post('/cookie-theme', Controller.cookieTheme)

router.get('/show-annonce/:annonceId', Controller.showAnnonce)

router.post('/updateProfil', auth, upload.single('image'), Controller.updateProfil)

router.get('/adminDashboard', auth, isAdmin, Controller.adminDashboard)

router.post('/searchUser', auth, isAdmin, Controller.searchUser)

router.post('/deleteUser', auth, isAdmin, Controller.deleteUser)

router.post('/startConversation', auth, Controller.startConversation)

router.get('/conversations', auth, Controller.conversations)

router.get('/chat/:id', auth, Controller.chat)

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;