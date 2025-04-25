// Sélectionne le canevas et configure ses dimensions
const canvasAll = document.querySelectorAll('.universe');
const body = document.body

canvasAll.forEach((canvas) => {
  const ctx = canvas.getContext('2d');
  console.log(canvas.parentNode);
  
  // Ajuste le canevas à la taille de la fenêtre
  canvas.width = canvas.parentNode.clientWidth;
  canvas.height = canvas.parentNode.clientHeight;
  console.log(canvas.width, canvas.height);
  

  // Fonction pour dessiner des étoiles
  function drawStars() {
    const starCount = 700; // Nombre d'étoiles
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * canvas.width; // Position X aléatoire
      const y = Math.random() * canvas.height; // Position Y aléatoire
      const radius = Math.random() * 1.5; // Taille aléatoire de l'étoile
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }

  // Fonction pour dessiner un vinyle réaliste avec inclinaison sur tous les axes
  function drawVinyl(x, y, size, tiltX = 0.5, tiltY = 0.5, rotation = 0) {
      const ringCount = 20; // Nombre de cercles concentriques pour plus de détails
      const ellipseHeight = size * tiltY; // Hauteur réduite pour simuler l'inclinaison sur l'axe Y
    
      // Appliquer une rotation globale
      ctx.save(); // Sauvegarder l'état du contexte
      ctx.translate(x, y); // Déplacer le contexte au centre du vinyle
      ctx.rotate(rotation); // Appliquer la rotation
      ctx.translate(-x, -y); // Revenir à l'origine
    
      // Dessiner un fond noir pour masquer les étoiles derrière le vinyle
      ctx.beginPath();
      ctx.ellipse(x, y, size, ellipseHeight, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'black'; // Fond noir
      ctx.fill();
    
      // Dessiner les cercles concentriques
      for (let i = 0; i < ringCount; i++) {
        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          size - i * (size / ringCount),
          ellipseHeight - i * (ellipseHeight / ringCount),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = i % 2 === 0 ? '#222' : '#444'; // Alternance de nuances sombres
        ctx.lineWidth = 1; // Cercles fins pour simuler les rainures
        ctx.stroke();
      }
    
      // Dessiner l'étiquette centrale
      ctx.beginPath();
      ctx.ellipse(x, y, size / 5, ellipseHeight / 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FED034'; // Couleur de l'étiquette (orange vif)
      ctx.fill();
    
      // Ajouter un petit cercle noir au centre
      ctx.beginPath();
      ctx.ellipse(x, y, size / 20, ellipseHeight / 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
    
      // Ajouter un effet de reflet triangulaire arrondi plus fin
      ctx.beginPath();
      ctx.ellipse(x, y, size, ellipseHeight, 0, -Math.PI / 12, Math.PI / 12, false); // Arc extérieur
      ctx.lineTo(
        x + (size / 5) * Math.cos(Math.PI / 12),
        y + (ellipseHeight / 5) * Math.sin(Math.PI / 12)
      ); // Ligne vers le bord du cercle central
      ctx.ellipse(x, y, size / 5, ellipseHeight / 5, 0, Math.PI / 12, -Math.PI / 12, true); // Arc intérieur
      ctx.closePath(); // Fermer le chemin
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'; // Couleur blanche semi-transparente
      ctx.fill();
    
      ctx.restore(); // Restaurer l'état du contexte
    }

  // Fonction pour dessiner plusieurs vinyles
  function drawVinyls() {
    let vinylCount = 0;
    if (canvas.width < 600) {
      vinylCount = 2; // Nombre de vinyles pour les petits écrans
    } else if (canvas.width < 1200) {
      vinylCount = 3; // Nombre de vinyles pour les écrans moyens
    } else {
      vinylCount = 5; // Nombre de vinyles pour les grands écrans
    }
      for (let i = 0; i < vinylCount; i++) {
        const x = Math.random() * canvas.width; // Position X aléatoire
        const y = Math.random() * canvas.height; // Position Y aléatoire
        const size = Math.random() * 50 + 50; // Taille aléatoire du vinyle
        const tiltX = Math.random() * 0.5 + 0.5; // Inclinaison aléatoire sur l'axe X
        const tiltY = Math.random() * 0.5 + 0.5; // Inclinaison aléatoire sur l'axe Y
        const rotation = Math.random() * Math.PI * 2; // Rotation aléatoire entre 0 et 360°
        drawVinyl(x, y, size, tiltX, tiltY, rotation);
      }
    }

  // Redessine les étoiles et les vinyles si la fenêtre est redimensionnée
  window.addEventListener('resize', () => {
    canvas.width = body.clientWidth;
    canvas.height = body.clientHeight;
    drawStars();
    drawVinyls();
  });

  // Dessine les étoiles et les vinyles au chargement
  drawStars();
  drawVinyls();
})