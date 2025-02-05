// Importation d'Express pour créer des routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import du middleware

// Importation du contrôleur des users
const UserController = require('../controllers/UserController');

// Définition des routes
router.get("/", UserController.home);

router.get("/register-form", UserController.showRegisterForm);

router.post("/register", UserController.register)

router.get("/login-form", UserController.showLoginForm)

router.post("/login", UserController.login)

router.get('/profil', auth, UserController.getProfile);

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;