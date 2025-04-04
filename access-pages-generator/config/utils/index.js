import path from "path";

// Fonction qui supprime le répertoire de base d'une chaîne de chemin.
// Elle extrait la partie du chemin après le premier séparateur de chemin.
const removeBaseDirectory = (str) => str.substring(str.indexOf(path.sep));

// Exporte la fonction 'removeBaseDirectory' pour qu'elle puisse être utilisée dans d'autres fichiers.
export {
  removeBaseDirectory,
};
