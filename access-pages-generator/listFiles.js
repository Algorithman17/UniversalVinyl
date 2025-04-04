const fs = require('fs');
const path = require('path');

// Dossier source
const sourceDir = path.join(__dirname, 'access-pages-generator', 'src', '_data', 'establishment_of_declaration');

// Fichier de sortie
const outputFile = path.join(__dirname, 'fileList.txt');

// Lire les fichiers dans le dossier
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du dossier :', err);
    return;
  }

  // Écrire les noms des fichiers dans le fichier texte
  fs.writeFile(outputFile, files.join('\n'), (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du fichier :', err);
    } else {
      console.log('Liste des fichiers écrite dans', outputFile);
    }
  });
});
