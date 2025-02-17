// Importation d'Express pour créer des routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import du middleware
const isAdmin = require('../middlewares/isAdmin'); // Import du middleware

// Importation du contrôleur des users
const UserController = require('../controllers/UserController');

const multer = require("multer");
const path = require('path');

// Configuration de Multer pour stocker les fichiers sur le disque
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Emplacement des fichiers téléchargés
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Obtenir l'extension du fichier
        const filename = Date.now() + ext; // Générer un nom unique basé sur le timestamp
        cb(null, filename); // Définir le nom du fichier
    }
});

const upload = multer({ storage: storage });

// Définition des routes
router.get("/", auth, UserController.home);

router.get("/register-form", UserController.registerForm);

router.post("/register", UserController.register)

router.get("/login-form", UserController.loginForm)

router.post("/login", UserController.login)

router.get('/profil', auth, UserController.profil);

router.post('/logout', UserController.logout);

router.get('/admin-dashboard', auth, isAdmin, UserController.adminDashboard);

router.get('/my-annonces', auth, UserController.myAnnonces);

router.get('/add-annonce', auth, UserController.addAnnonceForm);

router.post('/add-annonce', auth, upload.array('images', 9999), UserController.addAnnonce);

router.get('/annonces', auth, UserController.annonces);

router.post('/delete-annonce/:id', auth, UserController.deleteAnnonce)

router.get('/edit-annonce/:id', auth, UserController.editAnnonceForm)

router.post('/edit-annonce/:id', auth, upload.array('images', 9999), UserController.editAnnonce)

router.post('/cookie-theme', UserController.cookieTheme)

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;