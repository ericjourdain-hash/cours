/* ==========================================================================
   FICHIER À MODIFIER : c'est ici que vous gérez le contenu du site.
   Pour ajouter un cours, copiez une ligne de la liste COURS plus bas,
   collez-la à la suite, puis changez les textes entre guillemets.
   Attention : gardez les guillemets "..." et la virgule à la fin de chaque ligne.
   ========================================================================== */

var CONFIG = {
  titre: "Cours de Maths – Sciences",
  sousTitre: "Éric Jourdain · Lycée Paul Mathou",
  motDePasse: "mplpm"
};

/* Les classes affichées sur la page d'accueil (dans cet ordre). */
var CLASSES = [
  { nom: "3e PM",         couleur: "#1F9D75" },
  { nom: "Seconde Pro",   couleur: "#5B8DEF" },
  { nom: "Première Pro",  couleur: "#E0A030" },
  { nom: "Terminale Pro", couleur: "#D96C5B" }
];

/* Les matières (dans cet ordre). */
var MATIERES = ["Maths", "Sciences physiques"];

/* La liste des cours.
   classe   : exactement l'un des noms de CLASSES ci-dessus
   matiere  : exactement l'une des MATIERES ci-dessus
   chapitre : le nom du chapitre (les lignes qui ont le même nom sont regroupées)
   titre    : ce que l'élève voit pour cette ressource
   type     : "pdf", "video" ou "lien" (lien = adresse web, par exemple YouTube)
   fichier  : le chemin du fichier, par exemple "pdf/mon-cours.pdf" ou "videos/ma-video.mp4"
              (pour un "lien", l'adresse web complète en https://...)  */
var COURS = [
   { classe: "Seconde Pro", matiere: "Maths", chapitre: "Chapitre : Les Statistiques", titre: "plan de formation sur les Statistiques", type: "pdf", fichier: "pdf/statistiques.pdf" },
   { classe: "Terminale Pro", matiere: "Maths", chapitre: "Chapitre : Les Statistiques à 2 variables", titre: "plan de formation sur les Statistiques à 2 variables", type: "video", fichier: "videos/statistiques2variablesterm.mp4"}, 
];
