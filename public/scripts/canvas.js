// Sélectionne le canevas et configure ses dimensions
const canvasAll = document.querySelectorAll('.universe');

canvasAll.forEach((canvas) => {
  const ctx = canvas.getContext('2d');

  // Ajuste le canevas à la taille de la fenêtre
  canvas.width = canvas.parentNode.clientWidth;
  canvas.height = canvas.parentNode.clientHeight;

  // Crée un canvas hors écran pour les étoiles
  const starsCanvas = document.createElement('canvas');
  const starsCtx = starsCanvas.getContext('2d');
  starsCanvas.width = canvas.width;
  starsCanvas.height = canvas.height;

  // Fonction pour dessiner des étoiles sur le canvas statique
  function drawStars() {
    const starCount = 700; // Nombre d'étoiles
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * starsCanvas.width; // Position X aléatoire
      const y = Math.random() * starsCanvas.height; // Position Y aléatoire
      const radius = Math.random() * 1.5; // Taille aléatoire de l'étoile
      starsCtx.beginPath();
      starsCtx.arc(x, y, radius, 0, Math.PI * 2);
      starsCtx.fillStyle = 'white';
      starsCtx.fill();
    }
  }

  // Tableau pour stocker les propriétés des vinyles
  let vinyls = [];

  // Fonction pour initialiser les vinyles
  function initializeVinyls() {
    vinyls = [];
    let vinylCount = 0;
    if (canvas.width < 600) {
      vinylCount = 2;
    } else if (canvas.width < 1200) {
      vinylCount = 3;
    } else {
      vinylCount = 5;
    }

    for (let i = 0; i < vinylCount; i++) {
      vinyls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 50 + 50,
        tiltX: Math.random() * 0.5 + 0.5,
        tiltY: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 2, // Vitesse aléatoire sur X
        speedY: (Math.random() - 0.5) * 2, // Vitesse aléatoire sur Y
      });
    }
  }

  // Fonction pour mettre à jour les positions des vinyles
  function updateVinyls() {
    vinyls.forEach((vinyl) => {
      vinyl.x += vinyl.speedX;
      vinyl.y += vinyl.speedY;

      // Vérifie les collisions avec les bords du canvas
      if (vinyl.x - vinyl.size < 0 || vinyl.x + vinyl.size > canvas.width) {
        vinyl.speedX *= -1; // Inverse la direction sur X
      }
      if (vinyl.y - vinyl.size < 0 || vinyl.y + vinyl.size > canvas.height) {
        vinyl.speedY *= -1; // Inverse la direction sur Y
      }

      // Ajoute une légère rotation
      vinyl.rotation += 0.01;
    });
  }

  // Fonction pour dessiner les vinyles
  function drawVinyls() {
    vinyls.forEach((vinyl) => {
      drawVinyl(vinyl.x, vinyl.y, vinyl.size, vinyl.tiltX, vinyl.tiltY, vinyl.rotation);
    });
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

    ctx.restore(); // Restaurer l'état du contexte
  }

  // Fonction pour animer les vinyles
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface uniquement les vinyles
    ctx.drawImage(starsCanvas, 0, 0); // Dessine les étoiles depuis le canvas statique
    updateVinyls(); // Met à jour les positions des vinyles
    drawVinyls(); // Redessine les vinyles
    requestAnimationFrame(animate); // Boucle d'animation
  }

  // Redessine les étoiles et réinitialise les vinyles si la fenêtre est redimensionnée
  window.addEventListener('resize', () => {
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;
    starsCanvas.width = canvas.width;
    starsCanvas.height = canvas.height;
    drawStars(); // Redessine les étoiles
    initializeVinyls(); // Réinitialise les vinyles
  });

  // Initialise et démarre l'animation
  drawStars(); // Dessine les étoiles une seule fois sur le canvas statique
  initializeVinyls(); // Initialise les vinyles
  animate(); // Lance l'animation
});