// Importation d'Express pour créer des routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import du middleware
const isAdmin = require('../middlewares/isAdmin'); // Import du middleware

// Importation du contrôleur des users
const UserController = require('../controllers/UserController');

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Définition des routes
router.get("/", UserController.home);

router.get("/register-form", UserController.registerForm);

router.post("/register", UserController.register)

router.get("/login-form", UserController.loginForm)

router.post("/login", UserController.login)

router.get('/profil', auth, UserController.profil);

router.post('/logout', UserController.logout);

router.get('/admin-dashboard', isAdmin, UserController.adminDashboard);

router.get('/my-annonces', auth, UserController.myAnnonces);

router.get('/add-annonce', auth, UserController.addAnnonceForm);

router.post('/add-annonce', auth, upload.array('images', 9999), UserController.addAnnonce);

router.get('/annonces', UserController.annonces);

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;