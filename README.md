# Universal Vinyl

Universal Vinyl est une plateforme web permettant aux utilisateurs de vendre, acheter et discuter autour de vinyles de musique. Le site propose la gestion d'annonces, un système de messagerie en temps réel, ainsi qu'une interface d'administration.

## Fonctionnalités

- **Inscription et connexion sécurisées** (JWT, hashage des mots de passe)
- **Création, modification et suppression d'annonces** avec upload d'images (Cloudinary)
- **Filtrage des annonces** par style musical
- **Profil utilisateur** avec avatar, bio et informations personnelles
- **Messagerie instantanée** (Socket.io) liée à chaque annonce
- **Tableau de bord administrateur** pour la gestion des utilisateurs et annonces
- **Thèmes personnalisables** (couleur principale)
- **Responsive design** (mobile, tablette, desktop)

## Installation

1. **Cloner le dépôt**
   ```sh
   git clone https://github.com/Algorithman17/UniversalVinyl.git
   cd UniversalVinyl
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Configurer les variables d'environnement**
   - Renommer `.env.example` en `.env` (ou compléter le fichier existant)
   - Renseigner les clés MongoDB, JWT, Cloudinary, etc.

4. **Lancer le serveur**
   ```sh
   npm start
   ```
   Le serveur sera accessible sur [http://localhost:3000](http://localhost:3000) (ou le port défini dans `.env`).

## Stack technique

- **Node.js / Express**
- **MongoDB / Mongoose**
- **EJS** (templates)
- **Socket.io** (chat)
- **Cloudinary** (stockage images)
- **Multer** (upload fichiers)
- **CSS personnalisé** (responsive, animations)
- **JWT / bcrypt** (authentification)

## Structure du projet

```
.
├── app.js
├── controllers/
├── database/
├── middlewares/
├── models/
├── public/
│   ├── images/
│   ├── scripts/
│   └── styles/
├── routes/
├── views/
│   ├── pages/
│   └── partials/
├── .env
├── package.json
└── README.md
```

## Auteur

Axel Pavageau

---

N'hésitez pas à ouvrir une issue ou une pull request pour toute suggestion ou amélioration !