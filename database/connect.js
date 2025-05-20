// Importation de Mongoose pour interagir avec la base de données MongoDB
const mongoose = require('mongoose');

// Fonction asynchrone pour se connecter à la base de données
async function connectDb() {
    try {
        console.log('Connecting to database...');
        
        // Connexion à la base MongoDB en utilisant les variables d'environnement
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Database connected...');
    } catch (err) {
        console.log('Database connection error:', err);
    }
}

module.exports = connectDb;