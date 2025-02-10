// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = upload;

// Importation des utilitaires et routes
const connectDb = require('./database/connect'); // Fonction de connexion à la base de données
require('dotenv').config(); // Chargement des variables d'environnement
const userRouter = require('./routes/UserRouter'); // Routeur pour les utilisateurs


// Configuration du port (par défaut : 3005)
const port = process.env.PORT || 3005;

// Middleware pour gérer les données des requêtes
app.use(bodyParser.urlencoded({ extended: true })); // Support pour les formulaires encodés
app.use(bodyParser.json()); // Support pour les requêtes JSON
app.use(express.json()); // Permet de lire le JSON dans req.body
app.use('/api/users', userRouter); // Vérifie que le chemin est bien défini
app.use(express.static('public')); // Dossier pour les fichiers statiques
app.set('views', './views') // défini la racine
app.set('view engine', 'ejs') // moteur de recherche
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // à true si tu utilises HTTPS
}));

// Middleware pour rendre le message disponible dans les templates
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});






// Connexion à la base de données
connectDb();

// Routage : Utilisation des routes
app.use(userRouter)

// Vérification de la chaîne de connexion (debugging)
console.log('Database URI:', process.env.MONGO_URI + process.env.DB_NAME);

// Lancement du serveur sur le port spécifié
app.listen(port, () => {
    console.log('Server listening on http://localhost:' + port);
});