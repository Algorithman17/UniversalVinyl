// Importation de Mongoose pour interagir avec la base de données MongoDB
const mongoose = require('mongoose');

// Fonction asynchrone pour se connecter à la base de données
async function connectDb() {
    try {
        // Connexion à la base MongoDB en utilisant les variables d'environnement
        await mongoose.connect(process.env.MONGO_URI + process.env.DB_NAME);
        // Message de succès si la connexion est établie
        console.log('Database connected...');
    } catch (err) {
        // Affichage des erreurs en cas d'échec de connexion
        console.log('Database connection error:', err);
    }
}

// Exportation de la fonction pour l'utiliser dans d'autres fichiers
module.exports = connectDb;