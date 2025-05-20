/*************** Importation des modules necessaires ***************/

// Initialisation de l'application Express
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const bodyParser = require('body-parser'); // Middleware pour parser les données des requêtes
const session = require('express-session'); // Middleware pour gérer les sessions
const cookieParser = require("cookie-parser"); // Middleware pour gérer les cookies
const jwt = require('jsonwebtoken'); // Middleware pour gérer les JSON Web Tokens
const io = require('socket.io')(server); // Initialisation de Socket.io
require('dotenv').config(); // Chargement des variables d'environnement
 

/*************** Importation des utilitaires et routes ***************/
const connectDb = require('./database/connect');
const userRouter = require('./routes/UserRouter');
const Controller = require('./controllers/Controller');

// Configuration du port (par défaut : 3005)
const port = process.env.PORT || 3005;

// Middleware pour gérer les données des requêtes
app.use(bodyParser.urlencoded({ extended: true })); // Middleware pour parser les données des requêtes
app.use(bodyParser.json()); // Middleware pour parser les données JSON
app.use(express.json()); // Middleware pour parser les données JSON
app.use('/api/users', userRouter); // Middleware pour gérer les routes API
app.use(express.static('public')); // Middleware pour servir les fichiers statiques
app.use('/uploads', express.static('uploads')); // Middleware pour servir les fichiers d'uploads
app.set('views', './views'); // Définition du répertoire des vues
app.set('view engine', 'ejs'); // Définition du moteur de template EJS
app.use(cookieParser()); // Middleware pour gérer les cookies
app.use(session({ 
    secret: 'secret_key', // Clé secrète pour signer les sessions
    resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: true, // Sauvegarder la session même si elle n'a pas été initialisée
    cookie: { maxAge: 6555555 } // Durée de vie du cookie (en millisecondes)
})); // Middleware pour gérer les sessions

// Middleware pour gérer les cookies et les sessions
app.use((req, res, next) => {
    if (req.cookies.token) {
        try {
            const token = req.cookies.token;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = decodedToken.user;

            const now = Math.floor(Date.now() / 1000);
            if (decodedToken.exp - now < 600) {
                const newToken = jwt.sign(
                    { user },
                    process.env.JWT_SECRET,
                    { expiresIn: "2h" }
                );
                res.clearCookie('token');
                res.cookie('token', newToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
            }

            res.locals.user = user;
        } catch (error) {
            res.locals.user = undefined;
        }
    } else {
        res.locals.user = undefined;
    }
    res.locals.theme = req.cookies.theme;
    next();
});

// Route pour récupérer les messages d'une conversation
app.get('/api/messages/:id', Controller.getMessages);

// Connexion à Socket.io
io.on('connection', (socket) => {

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('chatMessage', async ({ roomId, message }) => {
        const sender = socket.handshake.query.username || "Anonyme";
        io.to(roomId).emit('chatMessage', { sender, message });

        try {
            await Controller.sendMessage({ roomId, sender, message });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du message :', error);
        }
    });
});

// Connexion à la base de données
connectDb();

// Routage : Utilisation des routes
app.use(userRouter);

// Lancement du serveur sur le port spécifié
server.listen(port, () => {
    console.log('Server listening on http://localhost:' + port);
});