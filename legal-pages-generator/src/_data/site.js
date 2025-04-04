// Importation du module dotenv pour charger les variables d'environnement.
// Cela permet de configurer le projet en fonction de l'environnement (dev, lab, prod).
import dotenv from 'dotenv';
dotenv.config();

// Définition des variables spécifiques à chaque environnement.
// Ces variables définissent l'URL du site en fonction de l'environnement.
const environmentSpecificVariables = {
  dev: {
    // URL pour l'environnement de développement.
    url: "http://localhost",
  },
  lab: {
    // URL pour l'environnement de test.
    url: "https://donneespersonnelles-lab.larochelle.fr",
  },
  prod: {
    // URL pour l'environnement de production.
    url: "https://donneespersonnelles.larochelle.fr",
  },
};

// Exportation des données du site.
// Ces données sont utilisées dans tout le projet pour configurer le site.
export default {
  // Titre du site.
  title: "Politique de protection des données personnelles",

  // Auteur du site.
  author: "Communauté d'Agglomération de La Rochelle",

  // Adresse email de contact (vide ici).
  email: "",

  // Description du site.
  description:
    "Retrouvez toutes les politiques relatives à la protection des données personnelles.",

  // Langue du site.
  language: "fr-FR",

  // Configuration des favicons.
  // Les favicons sont des icônes affichées dans l'onglet du navigateur.
  favicon: {
    widths: [32, 57, 76, 96, 128, 192, 228],
    format: "png",
  },

  // Ajout des variables spécifiques à l'environnement courant.
  // Cela permet de charger les bonnes configurations en fonction de l'environnement.
  ...environmentSpecificVariables[process.env.NODE_ENV],
};