// Importation d'Express pour créer des routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import du middleware
const isAdmin = require('../middlewares/isAdmin'); // Import du middleware

// Importation du contrôleur des users
const UserController = require('../controllers/UserController');

const multer = require("multer");
// Définir le stockage des fichiers

const { storage } = require('../middlewares/cloudinary');

// Initialize multer
const upload = multer({ storage });

// Définition des routes
router.get("/", UserController.home);

router.get("/register-form", UserController.registerForm);

router.post("/register", UserController.register)

router.get("/login-form", UserController.loginForm)

router.post("/login", UserController.login)

router.get('/profil', auth, UserController.profil);

router.get('/logout', auth, UserController.logout);

router.get('/my-annonces', auth, UserController.myAnnonces);

router.get('/add-annonce', auth, UserController.addAnnonceForm);

router.post('/add-annonce', auth, upload.array('images', 3), UserController.addAnnonce);

router.get('/annonces/:filter', UserController.annonces);

router.post('/delete-annonce/:id', auth, UserController.deleteAnnonce)

router.get('/edit-annonce/:id/:data', auth, UserController.editAnnonceForm)

router.post('/edit-annonce/:id', auth, upload.array('images', 3), UserController.editAnnonce)

router.post('/cookie-theme', UserController.cookieTheme)

router.get('/show-annonce/:annonceId', UserController.showAnnonce)

router.post('/updateProfil', auth, upload.single('image'), UserController.updateProfil)

router.get('/adminDashboard', auth, isAdmin, UserController.adminDashboard)

router.post('/searchUser', auth, isAdmin, UserController.searchUser)

router.post('/deleteUser', auth, isAdmin, UserController.deleteUser)

router.post('/startConversation', auth, UserController.startConversation)

router.get('/conversations', auth, UserController.conversations)

router.get('/chat/:id', auth, UserController.chat)

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;