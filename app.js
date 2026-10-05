(function () {
  "use strict";

  var CLE_ACCES = "cours-acces";
  var TYPES = { pdf: "PDF", video: "Vidéo", lien: "Lien" };
  var CHEMINS = {
    fichier: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
    lien: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    retour: '<path d="M15 6l-6 6 6 6"/>'
  };

  var porte = document.getElementById("porte");
  var site = document.getElementById("site");
  var main = document.getElementById("contenu");
  var champ = document.getElementById("champ-recherche");
  var etat = { matiere: "" };

  /* ---------- Outils ---------- */

  function norm(s) {
    return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  function empreinte(s) {
    var h = 5381;
    s = norm(s);
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return String(h);
  }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "class") { n.className = attrs[k]; }
        else if (k === "text") { n.textContent = attrs[k]; }
        else { n.setAttribute(k, attrs[k]); }
      }
    }
    (kids || []).forEach(function (c) {
      if (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); }
    });
    return n;
  }

  function icone(nom, taille) {
    var t = taille || 22;
    var s = el("span", { class: "ico", "aria-hidden": "true" });
    s.innerHTML = '<svg viewBox="0 0 24 24" width="' + t + '" height="' + t + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + CHEMINS[nom] + "</svg>";
    return s;
  }

  function infoClasse(nom) {
    for (var i = 0; i < CLASSES.length; i++) { if (CLASSES[i].nom === nom) { return CLASSES[i]; } }
    return null;
  }

  function vider() {
    while (main.firstChild) { main.removeChild(main.firstChild); }
    return main;
  }

  function pluriel(n) { return n + " ressource" + (n > 1 ? "s" : ""); }

  function stocker(valeur) { try { localStorage.setItem(CLE_ACCES, valeur); } catch (e) { /* ignoré */ } }
  function lire() { try { return localStorage.getItem(CLE_ACCES); } catch (e) { return null; } }
  function effacer() { try { localStorage.removeItem(CLE_ACCES); } catch (e) { /* ignoré */ } }

  /* ---------- Une ressource (PDF, vidéo, lien) ---------- */

  function ligne(c, contexte) {
    var cible = c.type === "lien" ? c.fichier : encodeURI(c.fichier);
    var nomIcone = c.type === "video" ? "play" : (c.type === "lien" ? "lien" : "fichier");
    var meta = contexte
      ? [TYPES[c.type] || c.type, c.classe, c.matiere, c.chapitre].join(" · ")
      : (TYPES[c.type] || c.type);
    var corps = el("span", { class: "corps" }, [
      el("span", { class: "titre", text: c.titre }),
      el("span", { class: "meta", text: meta })
    ]);

    if (c.type !== "video") {
      var a = el("a", { class: "ligne", href: cible, target: "_blank", rel: "noopener" }, [icone(nomIcone), corps, icone("chevron", 18)]);
      return el("div", { class: "item" }, [a]);
    }

    var bouton = el("button", { class: "ligne", type: "button", "aria-expanded": "false" }, [icone(nomIcone), corps, icone("chevron", 18)]);
    var wrap = el("div", { class: "item" }, [bouton]);
    var lecteur = null;
    var message = null;

    bouton.addEventListener("click", function () {
      if (lecteur || message) {
        if (lecteur) { lecteur.pause(); lecteur.remove(); lecteur = null; }
        if (message) { message.remove(); message = null; }
        bouton.setAttribute("aria-expanded", "false");
        return;
      }
      lecteur = el("video", { controls: "", playsinline: "", preload: "auto", src: cible });
      lecteur.addEventListener("error", function () {
        if (lecteur) { lecteur.remove(); lecteur = null; }
        if (!message) {
          message = el("p", { class: "erreur", text: "Cette vidéo est introuvable ou ne peut pas être lue. Prévenez votre professeur." });
          wrap.appendChild(message);
        }
      });
      wrap.appendChild(lecteur);
      bouton.setAttribute("aria-expanded", "true");
      var p = lecteur.play();
      if (p && p.catch) { p.catch(function () { /* lecture manuelle possible */ }); }
    });
    return wrap;
  }

  /* ---------- Pages ---------- */

  function accueil() {
    var m = vider();
    m.appendChild(el("h2", { text: "Choisissez votre classe" }));
    var grille = el("div", { class: "tuiles" });
    CLASSES.forEach(function (cl) {
      var nb = COURS.filter(function (c) { return c.classe === cl.nom; }).length;
      var t = el("a", { class: "tuile", href: "#/classe/" + encodeURIComponent(cl.nom) }, [
        el("span", { class: "tuile-nom", text: cl.nom }),
        el("span", { class: "tuile-nb", text: nb ? pluriel(nb) : "Bientôt" })
      ]);
      t.style.setProperty("--c", cl.couleur);
      grille.appendChild(t);
    });
    m.appendChild(grille);

    if (COURS.length) {
      m.appendChild(el("h2", { text: "Derniers ajouts" }));
      COURS.slice(-5).reverse().forEach(function (c) { m.appendChild(ligne(c, true)); });
    }
  }

  function chapitres(items) {
    var ordre = [];
    var table = {};
    items.forEach(function (c) {
      if (!table[c.chapitre]) { table[c.chapitre] = []; ordre.push(c.chapitre); }
      table[c.chapitre].push(c);
    });
    var frag = document.createDocumentFragment();
    ordre.forEach(function (nom, i) {
      var d = el("details", { class: "chapitre" });
      if (i === ordre.length - 1) { d.open = true; }
      d.appendChild(el("summary", null, [
        el("span", { class: "nom", text: nom }),
        el("span", { class: "nb", text: pluriel(table[nom].length) }),
        icone("chevron", 18)
      ]));
      var liste = el("div", { class: "liste" });
      table[nom].forEach(function (c) { liste.appendChild(ligne(c, false)); });
      d.appendChild(liste);
      frag.appendChild(d);
    });
    return frag;
  }

  function pageClasse(nom) {
    var cl = infoClasse(nom);
    if (!cl) { location.hash = "#/"; return; }
    var items = COURS.filter(function (c) { return c.classe === nom; });
    var m = vider();

    var retour = el("a", { class: "retour", href: "#/" }, [icone("retour", 18), "Toutes les classes"]);
    m.appendChild(retour);

    var titre = el("h2", { class: "titre-classe" }, [el("span", { class: "barre" }), nom]);
    titre.style.setProperty("--c", cl.couleur);
    m.appendChild(titre);

    if (!items.length) {
      m.appendChild(el("p", { class: "vide", text: "Pas encore de cours dans cette classe. Revenez bientôt." }));
      return;
    }

    var matieres = MATIERES.filter(function (x) {
      return items.some(function (c) { return c.matiere === x; });
    });
    items.forEach(function (c) { if (matieres.indexOf(c.matiere) === -1) { matieres.push(c.matiere); } });

    var zone = el("div");
    var boutons = [];

    function dessiner() {
      while (zone.firstChild) { zone.removeChild(zone.firstChild); }
      matieres.forEach(function (mat) {
        if (etat.matiere && etat.matiere !== mat) { return; }
        var sel = items.filter(function (c) { return c.matiere === mat; });
        zone.appendChild(el("h3", { class: "matiere", text: mat }));
        zone.appendChild(chapitres(sel));
      });
      boutons.forEach(function (b) {
        b.el.setAttribute("aria-pressed", String(b.valeur === etat.matiere));
      });
    }

    if (matieres.length > 1) {
      var barre = el("div", { class: "filtres", role: "group", "aria-label": "Filtrer par matière" });
      [""].concat(matieres).forEach(function (valeur) {
        var b = el("button", { class: "filtre", type: "button", text: valeur || "Tout", "aria-pressed": "false" });
        b.addEventListener("click", function () { etat.matiere = valeur; dessiner(); });
        boutons.push({ el: b, valeur: valeur });
        barre.appendChild(b);
      });
      m.appendChild(barre);
    }
    m.appendChild(zone);
    dessiner();
  }

  function resultats(texte) {
    var mots = norm(texte).split(/\s+/).filter(Boolean);
    var trouves = COURS.filter(function (c) {
      var foin = norm([c.titre, c.chapitre, c.matiere, c.classe, TYPES[c.type]].join(" "));
      return mots.every(function (mot) { return foin.indexOf(mot) !== -1; });
    });
    var m = vider();
    var info = el("p", { class: "resultats-info", "aria-live": "polite" });
    m.appendChild(info);
    if (!trouves.length) {
      info.textContent = "";
      m.appendChild(el("p", { class: "vide", text: "Aucun résultat pour « " + texte.trim() + " »." }));
      return;
    }
    var max = 50;
    info.textContent = trouves.length + " résultat" + (trouves.length > 1 ? "s" : "") + (trouves.length > max ? " (les " + max + " premiers sont affichés)" : "");
    var boite = el("div", { class: "resultats" });
    trouves.slice(0, max).forEach(function (c) { boite.appendChild(ligne(c, true)); });
    m.appendChild(boite);
  }

  function pageVerif() {
    var m = vider();
    m.appendChild(el("a", { class: "retour", href: "#/" }, [icone("retour", 18), "Retour"]));
    m.appendChild(el("h2", { text: "Vérification du contenu" }));
    var bloc = el("div", { class: "verif" });
    m.appendChild(bloc);

    var problemes = [];
    var noms = CLASSES.map(function (c) { return c.nom; });
    COURS.forEach(function (c, i) {
      var n = "Ligne " + (i + 1) + " (« " + (c.titre || "sans titre") + " ») : ";
      ["classe", "matiere", "chapitre", "titre", "type", "fichier"].forEach(function (champ) {
        if (!c[champ]) { problemes.push(n + "le champ « " + champ + " » est vide ou absent."); }
      });
      if (c.classe && noms.indexOf(c.classe) === -1) { problemes.push(n + "la classe « " + c.classe + " » n'existe pas dans CLASSES."); }
      if (c.matiere && MATIERES.indexOf(c.matiere) === -1) { problemes.push(n + "la matière « " + c.matiere + " » n'existe pas dans MATIERES."); }
      if (c.type && !TYPES[c.type]) { problemes.push(n + "le type « " + c.type + " » doit être pdf, video ou lien."); }
    });

    var attente = [];
    if (location.protocol !== "file:") {
      COURS.forEach(function (c, i) {
        if (!c.fichier || c.type === "lien") { return; }
        attente.push(fetch(encodeURI(c.fichier), { method: "HEAD", cache: "no-store" }).then(function (r) {
          if (!r.ok) { problemes.push("Ligne " + (i + 1) + " (« " + c.titre + " ») : le fichier « " + c.fichier + " » est introuvable. Vérifiez le nom et le dossier."); }
        }).catch(function () {
          problemes.push("Ligne " + (i + 1) + " : impossible de vérifier « " + c.fichier + " ».");
        }));
      });
    }

    Promise.all(attente).then(function () {
      if (!problemes.length) {
        bloc.appendChild(el("p", { class: "bon", text: "Tout est en ordre : " + COURS.length + " ressources vérifiées." }));
        if (location.protocol === "file:") {
          bloc.appendChild(el("p", { class: "vide", text: "Les fichiers ne sont vérifiés qu'une fois le site en ligne." }));
        }
        return;
      }
      bloc.appendChild(el("p", { text: problemes.length + " problème" + (problemes.length > 1 ? "s" : "") + " à corriger :" }));
      var ul = el("ul");
      problemes.forEach(function (p) { ul.appendChild(el("li", { text: p })); });
      bloc.appendChild(ul);
    });
  }

  /* ---------- Navigation ---------- */

  function route() {
    champ.value = "";
    var h = location.hash || "#/";
    if (h === "#/verif") { pageVerif(); }
    else if (h.indexOf("#/classe/") === 0) {
      var nom;
      try { nom = decodeURIComponent(h.slice(9)); } catch (e) { nom = ""; }
      if (!etat.derniere || etat.derniere !== nom) { etat.matiere = ""; }
      etat.derniere = nom;
      pageClasse(nom);
    } else { etat.derniere = null; accueil(); }
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);

  document.getElementById("recherche").addEventListener("submit", function (e) {
    e.preventDefault();
    champ.blur();
  });

  champ.addEventListener("input", function () {
    var texte = champ.value;
    if (norm(texte)) { resultats(texte); }
    else {
      var h = location.hash || "#/";
      if (h.indexOf("#/classe/") === 0) { route(); } else { champ.value = ""; route(); }
    }
  });

  /* ---------- Accès par mot de passe ---------- */

  function ouvrir() {
    porte.hidden = true;
    site.hidden = false;
    route();
  }

  function demarrer() {
    document.title = CONFIG.titre + " · " + CONFIG.sousTitre;
    document.getElementById("porte-titre").textContent = CONFIG.titre;
    document.getElementById("porte-sous-titre").textContent = CONFIG.sousTitre;
    document.getElementById("titre-site").textContent = CONFIG.titre;
    document.getElementById("sous-titre-site").textContent = CONFIG.sousTitre;

    var attendu = empreinte(CONFIG.motDePasse);

    if (lire() === attendu) { ouvrir(); }
    else { porte.hidden = false; document.getElementById("mdp").focus(); }

    document.getElementById("formulaire-porte").addEventListener("submit", function (e) {
      e.preventDefault();
      var champMdp = document.getElementById("mdp");
      if (empreinte(champMdp.value) === attendu) {
        stocker(attendu);
        champMdp.value = "";
        document.getElementById("erreur-mdp").hidden = true;
        ouvrir();
      } else {
        document.getElementById("erreur-mdp").hidden = false;
        champMdp.select();
      }
    });

    document.getElementById("verrouiller").addEventListener("click", function () {
      effacer();
      location.hash = "";
      location.reload();
    });
  }

  demarrer();
})();
