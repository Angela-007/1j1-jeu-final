// === VARIABLES
let oCanvasHTML = document.querySelector("canvas");
let oContexte = oCanvasHTML.getContext("2d");

let nHauteurCanvas = oCanvasHTML.height;
let nLargeurCanvas = oCanvasHTML.width;

let sEtat = "intro";

let listeCartes = [
  { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "red", estVisible: false },
  { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "red", estVisible: false },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "blue",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "blue",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "green",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "green",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "yellow",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "yellow",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "purple",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "purple",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "orange",
    estVisible: false,
  },
  {
    x: 0,
    y: 0,
    hauteur: 140,
    largeur: 100,
    couleur: "orange",
    estVisible: false,
  },
];

let nbPairesTrouvees = 0;

// Cartes choisies par le joueur, si c'est null, aucune carte n'a été choisie
let choixCarte1 = null;
let choixCarte2 = null;

// Bouton pour démarrer sur l'écran d'intro
let oBoutonDemarrer = {
  x: nLargeurCanvas / 2 - 100,
  y: nHauteurCanvas - 100,
  largeur: 200,
  hauteur: 50,
  texte: "DÉMARRER",
  teinte: 0,
};

// sons du jeu
let sons = {
  paireTrouvee: new Audio("assets/audio/sonPaire.wav"),
  finPartie: new Audio("assets/audio/sonFinPartie.wav"),
  erreur: new Audio("assets/audio/sonErreur.wav"),
};

sons.paireTrouvee.volume = 0.2;
sons.finPartie.volume = 0.2;
sons.erreur.volume = 0.8;

// === FONCTION D'INITIALISATION DU JEU ===
function initialiser() {
  setInterval(boucleJeu, 1000 / 60);
  melangerCartes();
  oCanvasHTML.addEventListener("click", onClicCanvas);
}

function redemarrerJeu() {
  nbPairesTrouvees = 0;
  choixCarte1 = null;
  choixCarte2 = null;

  for (let i = 0; i < listeCartes.length; i++) {
    let carte = listeCartes[i];
    carte.estVisible = false;
  }
  melangerCartes();
}

// === Boucle de jeu ===
function boucleJeu() {
  oContexte.clearRect(0, 0, nLargeurCanvas, nHauteurCanvas);

  if (sEtat == "intro") {
    dessinerMenu();
    redemarrerJeu();
  } else if (sEtat == "jeu") {
    dessinerCartes();
    dessinerUI();
  }
}

//=== FONCTIONS D'ÉCOUTEURs D'ÉVÉNEMENTS ===
function onClicCanvas(evenement) {
  let curseurX = evenement.offsetX;
  let curseurY = evenement.offsetY;

  if (
    sEtat == "intro" &&
    detecterClicObjet(curseurX, curseurY, oBoutonDemarrer) == true
  ) {
    sEtat = "jeu";
  } else if (sEtat == "jeu") {
    let carteTrouvee = null;
    for (let i = 0; i < listeCartes.length; i++) {
      let carte = listeCartes[i];
      let collisionClic = detecterClicObjet(curseurX, curseurY, carte);
      if (collisionClic == true) {
        carteTrouvee = carte;
        break;
      }
    }
    if (carteTrouvee != null && carteTrouvee.estVisible == false) {
      if (choixCarte1 == null) {
        choixCarte1 = carteTrouvee;
        carteTrouvee.estVisible = true;
     
      } else if (choixCarte2 == null && carteTrouvee != choixCarte1) {
        choixCarte2 = carteTrouvee;
        carteTrouvee.estVisible = true;
        validerFin();
      }
    }
  }
}

// === FONCTIONS D'AFFICHAGE DES ÉLÉMENTS DE JEU ===
function dessinerMenu() {
  oBoutonDemarrer.teinte++;

  if (oBoutonDemarrer.teinte >= 360) {
    oBoutonDemarrer.teinte = 0;
  }

  // Titre
  oContexte.fillStyle = "#333";
  oContexte.font = "bold 40px Arial";
  oContexte.textAlign = "center";
  oContexte.fillText("JEU DES PAIRES", nLargeurCanvas / 2, 100);

  // Instructions
  oContexte.font = "20px Arial";
  oContexte.fillText("Trouvez toutes les paires", nLargeurCanvas / 2, 150);

  // Bouton démarrer
  oContexte.fillStyle = `hsl(${oBoutonDemarrer.teinte}, 50%, 50%)`;
  oContexte.fillRect(
    oBoutonDemarrer.x,
    oBoutonDemarrer.y,
    oBoutonDemarrer.largeur,
    oBoutonDemarrer.hauteur
  );

  // Texte
  oContexte.fillStyle = "#fff";
  oContexte.font = "bold 24px Arial";
  oContexte.textAlign = "center";
  oContexte.fillText(
    oBoutonDemarrer.texte,
    oBoutonDemarrer.x + oBoutonDemarrer.largeur / 2,
    oBoutonDemarrer.y + oBoutonDemarrer.hauteur / 2 + 8
  );
}

function dessinerCartes() {
  for (let i = 0; i < listeCartes.length; i++) {
    let carte = listeCartes[i];

    let colonne = i % 4;
    let rangee = Math.floor(i / 4);

    let paddingX = 35 * colonne;
    let paddingY = 35 * rangee;

    carte.x = colonne * carte.largeur + paddingX;
    carte.y = rangee * carte.hauteur + paddingY;

    if (carte.estVisible == true) {
      oContexte.fillStyle = carte.couleur;
    } else {
      oContexte.fillStyle = "grey";
    }

    oContexte.fillRect(carte.x, carte.y, carte.largeur, carte.hauteur);
  }
}

function dessinerUI() {
  oContexte.fillStyle = "white";
  oContexte.font = "30px Nazalization";
  oContexte.fillText(
    `Paires trouvées: ${nbPairesTrouvees}`,
    nLargeurCanvas / 2,
    nHauteurCanvas / 2
  );
}

// === FONCTIONS DE LOGIQUE DES CARTES ===
function melangerCartes() {
  listeCartes.sort(function (elementA, elementB) {
    return Math.random() * 2 - 1;
  });
}

function trouverCarte(curseurX, curseurY) {
  for (let i = 0; i < listeCartes.length; i++) {
    let carte = listeCartes[i];
    if (detecterClicObjet == carte) {
      return carte;
    }
  }
}

function validerFin() {
  if (
    choixCarte1 != null &&
    choixCarte2 != null &&
    choixCarte1.couleur == choixCarte2.couleur
  ) {
    nbPairesTrouvees++;
    sons.paireTrouvee.play();

    setTimeout(() => {
      choixCarte1 = null;
      choixCarte2 = null;

      if (nbPairesTrouvees == listeCartes.length / 2) {
        sEtat = "intro";
        redemarrerJeu();
        sons.finPartie.play();
      }
    }, 1000);
  } else {
    sons.erreur.play();

    setTimeout(() => {
      choixCarte1.estVisible = false;
      choixCarte2.estVisible = false;
      choixCarte1 = null;
      choixCarte2 = null;
    }, 1000);
  }
}

// === FONCTIONS UTILITAIRES ===
function detecterClicObjet(curseurX, curseurY, objet) {
  if (
    curseurX >= objet.x &&
    curseurX <= objet.x + objet.largeur &&
    curseurY >= objet.y &&
    curseurY <= objet.y + objet.hauteur
  ) {
    return true;
  }
  return false;
}

window.addEventListener("load", initialiser);
