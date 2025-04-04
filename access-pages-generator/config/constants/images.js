import path from 'path';
import dir from './dir.js';

// Définit le chemin URL des images.
const imageUrlPath = '/assets/images';

// Définit les chemins d'entrée et de sortie pour les images.
const imagePaths = {
  input: path.join(dir.input, imageUrlPath),
  output: path.join(dir.output, imageUrlPath),
};

export {
  imageUrlPath,
  imagePaths,
};