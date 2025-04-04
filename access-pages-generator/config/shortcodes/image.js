import Image from "@11ty/eleventy-img";
import { imagePaths, imageUrlPath } from "../constants/images.js";

// Fonction asynchrone pour générer un shortcode d'image.
async function imageShortcode(
  src, // Chemin source de l'image.
  alt = "", // Texte alternatif par défaut vide.
  widths = [300, 600], // Largeurs d'image par défaut.
  formats = ["webp", "jpeg"], // Formats d'image par défaut.
  sizes = "100vw" // Taille responsive par défaut.
) {
  // Génère les métadonnées de l'image avec les options spécifiées.
  const metadata = await Image(src, {
    widths,
    formats,
    outputDir: imagePaths.output, // Répertoire de sortie des images.
    urlPath: imageUrlPath, // Chemin URL des images.
  });

  // Attributs HTML pour l'image générée.
  const imageAttributes = {
    alt, // Texte alternatif.
    sizes, // Taille responsive.
    loading: "lazy", // Chargement différé.
    decoding: "async", // Décodage asynchrone.
  };

  // Génère le HTML de l'image optimisée.
  return Image.generateHTML(metadata, imageAttributes);
}

// Exporte la fonction 'imageShortcode' pour qu'elle puisse être utilisée ailleurs.
export {
  imageShortcode
};
