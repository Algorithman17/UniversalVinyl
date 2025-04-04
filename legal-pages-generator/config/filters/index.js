// Importe le module 'slugify' pour convertir des chaînes en slugs.
import slugify from "slugify";

// Importe le module 'dayjs' pour manipuler les dates.
import dayjs from "dayjs";

// Importe le module '@11ty/eleventy-img' pour générer des images optimisées.
import Image from "@11ty/eleventy-img";

// Importe les données du site, comme l'URL de base.
import site from "../../src/_data/site.js";

// Importe les constantes liées aux chemins des images.
import { imagePaths } from "../constants/images.js";

// Importe la fonction utilitaire pour supprimer le répertoire de base.
import { removeBaseDirectory } from "../utils/index.js";

// Définit la langue par défaut pour 'dayjs' en français.
dayjs.locale("fr");

/**
 * Convertit une chaîne de caractères en slug.
 * @param {string} str La chaîne de caractères à convertir.
 * @returns {string} Le slug généré à partir de la chaîne de caractères.
 *
 * @example
 * ```javascript
 * const slug = slugifyString("Mon exemple de chaîne de caractères");
 * console.log(slug); // Affiche "mon-exemple-de-chaine-de-caracteres"
 * ```
 */
const slugifyString = (str) => {
  // Convertit une chaîne en slug avec des options spécifiques.
  return slugify(str, {
    replacement: "-", // Remplace les espaces par des tirets.
    remove: /[#,&,+()$~%.'":*?<>{}]/g, // Supprime les caractères spéciaux.
    lower: true, // Convertit en minuscules.
  });
};

/**
 * Convertit une URL relative en URL absolue.
 *
 * @param {string} url L'URL relative à convertir.
 * @returns {string} L'URL absolue générée à partir de l'URL relative.
 *
 * @example
 * ```javascript
 * const relativeUrl = "page/relative";
 * const absoluteUrl = toAbsoluteUrl(relativeUrl);
 * console.log(absoluteUrl); // Affiche "votre-url-de-site/page/relative"
 * ```
 */
const toAbsoluteUrl = (url) => {
  // Convertit une URL relative en URL absolue en utilisant l'URL de base du site.
  return new URL(url, site.url).href;
};

/**
 * Convertit une chaîne de caractères représentant une date au format ISO 8601 en une chaîne de caractères au format ISO 8601 étendu (UTC).
 *
 * @param {string} dateString La chaîne de caractères représentant une date au format ISO 8601.
 * @returns {string} La chaîne de caractères représentant la date au format ISO 8601 étendu (UTC).
 *
 * @example
 * ```javascript
 * const dateString = "2024-05-22";
 * const isoString = toISOString(dateString);
 * console.log(isoString); // Affiche "2024-05-22T00:00:00.000Z"
 * ```
 */
const toISOString = (dateString) => 
  // Convertit une date en chaîne ISO 8601.
  new Date(dateString).toISOString();

/**
 * Formats une date au format français. Exemple : 12 janvier.
 *
 * @param {Date|string|number} date La date à formater.
 *   - Peut être un objet Date JavaScript.
 *   - Peut être une chaîne de caractères représentant une date au format ISO 8601.
 *   - Peut être un timestamp Unix.
 * @returns {string} La date formatée au format français "DD/MM/YYYY".
 *
 * @example
 * ```javascript
 * const today = new Date();
 * const formattedDate = formatDateFr(today);
 * console.log(formattedDate); // Exemple : "22 mai 2024"
 * ```
 */
const formatDateFr = (date) => {
  // Formate une date au format français "DD/MM/YYYY".
  return dayjs(date).format("DD/MM/YYYY");
};

/**
 * Vérifie si un chemin de fichier correspond à un fichier CSS.
 *
 * @param {string} path Le chemin du fichier à vérifier.
 * @returns {string|null} Renvoie le chemin d'origine si ce n'est pas un fichier CSS, sinon renvoie null.
 *
 * @exemple
 * ```javascript
 * const pathCSS = "styles.css";
 * const pathImage = "image.png";
 *
 * const isFileCSS1 = excludeCSS(pathCSS); // isFileCSS1 sera null
 * const isFileCSS2 = excludeCSS(pathImage); // isFileCSS2 sera "image.png"
 * ```
 */
const excludeCSS = (path) => {
  // Vérifie si un fichier n'est pas un fichier CSS.
  return path.split(".").pop() !== "css" ? path : null;
};

/**
 * Génère une URL d'image absolue à partir d'un chemin relatif.
 *
 * @param {string} src Chemin relatif de l'image source.
 * @param {number|null} width Largeur d'image souhaitée (en pixels). Si null, l'image originale est utilisée.
 * @returns {Promise<string>} Promesse résolue avec l'URL absolue de l'image générée.
 *
 * @exemple
 * ```javascript
 * const imageUrl = await toAbsoluteImageUrl('image.jpg', 800);
 * console.log(imageUrl); // Affiche l'URL absolue de l'image générée (ex: [https://www.exemple.com/images/image.jpg](https://www.exemple.com/images/image.jpg))
 * ```
 */
const toAbsoluteImageUrl = async (src, width = null) => {
  // Options pour générer une image avec une largeur spécifique.
  const imgOptions = {
    widths: [width], // Largeur souhaitée.
    formats: [null], // Format original.
    outputDir: imagePaths.output, // Répertoire de sortie.
    urlPath: removeBaseDirectory(imagePaths.output), // Chemin URL relatif.
  };

  // Génère les métadonnées de l'image.
  const stats = await Image(src, imgOptions);

  // Retourne l'URL absolue de l'image générée.
  return toAbsoluteUrl(Object.values(stats)[0][0].url);
};

// Exporte toutes les fonctions pour qu'elles puissent être utilisées ailleurs.
export {
  slugifyString,
  toAbsoluteUrl,
  toISOString,
  formatDateFr,
  excludeCSS,
  toAbsoluteImageUrl,
};
