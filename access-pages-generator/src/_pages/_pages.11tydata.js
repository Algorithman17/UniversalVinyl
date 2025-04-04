// Importation du module 'path' pour manipuler les chemins de fichiers.
// Ce module est utilisé pour construire des chemins de fichiers compatibles avec tous les systèmes d'exploitation.
import path from "path";

// Définition d'une constante contenant le chemin des styles.
// Cette constante est utilisée pour centraliser le chemin des fichiers CSS, ce qui facilite leur gestion.
const styleUrlPath = "/assets/styles";

// Exportation d'un objet de configuration par défaut.
// Cet objet est utilisé par Eleventy pour configurer les pages générées.
export default {
  // Spécifie le layout par défaut pour les pages.
  // Cela signifie que toutes les pages utiliseront le layout nommé "default" sauf indication contraire.
  layout: "default",

  // Indique que les pages ne doivent pas être indexées par les moteurs de recherche.
  // Cela ajoute une balise meta "noindex" dans le HTML généré.
  noindex: true,

  // Définit une liste de ressources à précharger.
  // Cela permet d'améliorer les performances en demandant au navigateur de charger certaines ressources dès que possible.
  preloads: [
    {
      // Indique que la ressource est une feuille de style.
      as: "style",

      // Spécifie le type MIME de la ressource.
      // Ici, "text/css" indique qu'il s'agit d'une feuille de style CSS.
      type: "text/css",

      // Définit le chemin de la feuille de style à précharger.
      // La fonction `path.join` est utilisée pour construire un chemin valide en combinant `styleUrlPath` et "main.css".
      href: path.join(styleUrlPath, "main.css"),
    },
  ],
};
