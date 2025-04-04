// Importe le module 'path' de Node.js pour manipuler les chemins de fichiers.
import path from 'path';

// Importe les constantes de configuration des répertoires.
import dir from './dir.js';

// Définit le chemin URL des images.
const imageUrlPath = '/assets/images';

// Définit les chemins d'entrée et de sortie pour les images.
const imagePaths = {
  input: path.join(dir.input, imageUrlPath), // Chemin d'entrée basé sur le répertoire source.
  output: path.join(dir.output, imageUrlPath), // Chemin de sortie basé sur le répertoire de sortie.
};

// Exporte les constantes pour qu'elles puissent être utilisées ailleurs.
export {
  imageUrlPath,
  imagePaths,
};