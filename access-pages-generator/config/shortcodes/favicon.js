import Image from "@11ty/eleventy-img";
import site from "../../src/_data/site.js";
import { imagePaths, imageUrlPath } from "../constants/images.js";

// Fonction asynchrone pour générer un shortcode de favicon.
export async function faviconShortcode(src) {
  // Définit les propriétés pour générer les favicons.
  const props = {
    widths: site.favicon.widths, // Largeurs des favicons définies dans les données du site.
    formats: [site.favicon.format], // Format unique défini dans les données du site.
    outputDir: imagePaths.output, // Répertoire de sortie des favicons.
    urlPath: imageUrlPath, // Chemin URL des favicons.
  };

  // Génère les métadonnées des favicons avec les options spécifiées.
  const metadata = await Image(src, props);

  // Génère les balises <link> HTML pour les favicons.
  return metadata[site.favicon.format]
    .map(
      (image) =>
        `<link rel="icon" href="${image.url}" sizes="${image.width}x${image.width}">`
    )
    .join("\n"); // Combine les balises en une seule chaîne avec des sauts de ligne.
}
