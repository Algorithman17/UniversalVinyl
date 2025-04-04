// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Importation des utilitaires et routes
const connectDb = require('./database/connect');
require('dotenv').config();
const userRouter = require('./routes/UserRouter');
const UserController = require('./controllers/UserController');

// Configuration du port (par défaut : 3005)
const port = process.env.PORT || 3005;

// Middleware pour gérer les données des requêtes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/users', userRouter);
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6555555 }
}));

// Middleware
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
app.get('/api/messages/:id', UserController.getMessages);

// Connexion à Socket.io
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Utilisateur a rejoint la room : ${roomId}`);
    });

    socket.on('chatMessage', async ({ roomId, message }) => {
        const sender = socket.handshake.query.username || "Anonyme";
        io.to(roomId).emit('chatMessage', { sender, message });

        try {
            await UserController.sendMessage({ roomId, sender, message });
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