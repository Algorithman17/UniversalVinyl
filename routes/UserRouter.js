// Importation d'Express pour créer des routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import du middleware
const isAdmin = require('../middlewares/isAdmin'); // Import du middleware

// Importation du contrôleur des users
const UserController = require('../controllers/UserController');

const multer = require("multer");
// Définir le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+'.webp')
  
    }
  })
// Initialize multer
const upload = multer({ storage: storage });

// Définition des routes
router.get("/", UserController.home);

router.get("/register-form", UserController.registerForm);

router.post("/register", UserController.register)

router.get("/login-form", UserController.loginForm)

router.post("/login", UserController.login)

router.get('/profil', auth, UserController.profil);

router.post('/logout', auth, UserController.logout);

router.get('/my-annonces', auth, UserController.myAnnonces);

router.get('/add-annonce', auth, UserController.addAnnonceForm);

router.post('/add-annonce', auth, upload.array('images', 9999), UserController.addAnnonce);

router.get('/annonces', UserController.annonces);

router.post('/delete-annonce/:id', auth, UserController.deleteAnnonce)

router.get('/edit-annonce/:id', auth, UserController.editAnnonceForm)

router.post('/edit-annonce/:id', auth, upload.array('images', 9999), UserController.editAnnonce)

router.post('/cookie-theme', UserController.cookieTheme)

router.get('/show-annonce/:id', UserController.showAnnonce)

router.get('/updateProfilForm/:info', auth, UserController.updateProfilForm)

router.post('/updateProfil', auth, upload.single('image'), UserController.updateProfil)

router.get('/adminDashboard', auth, isAdmin, UserController.adminDashboard)

router.post('/searchUser', auth, isAdmin, UserController.searchUser)

router.post('/deleteUser', auth, isAdmin, UserController.deleteUser)

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;