# Site de cours : mode d'emploi

## Ce que contient ce dossier

| Élément | Rôle |
|---|---|
| `index.html`, `style.css`, `app.js` | Le site lui-même. Vous n'avez normalement pas à les modifier. |
| `cours.js` | **Le seul fichier que vous modifiez** : titre, mot de passe, classes et liste des cours. |
| dossier `pdf` | Vos cours en PDF. |
| dossier `videos` | Vos vidéos en MP4. |

Les deux fichiers « exemple » (un PDF et une vidéo) sont là pour tester. Vous pourrez les supprimer quand vous aurez ajouté vos vrais cours.

## Mise en ligne (à faire une seule fois)

1. Décompressez le .zip sur votre ordinateur.
2. Connectez-vous sur github.com, cliquez sur le **+** en haut à droite, puis **New repository**.
3. Nom du dépôt : par exemple `cours`. Choisissez **Public** (obligatoire pour la version gratuite de GitHub Pages) et cochez **Add a README file**. Cliquez sur **Create repository**.
4. Dans le dépôt : **Add file → Upload files**. Glissez **le contenu** du dossier décompressé (les fichiers `index.html`, `style.css`, `app.js`, `cours.js` et les dossiers `pdf` et `videos`), puis cliquez sur **Commit changes**.
5. Allez dans **Settings → Pages**. Sous « Build and deployment », choisissez **Deploy from a branch**, la branche **main**, le dossier **/ (root)**, puis **Save**.
6. Attendez 1 à 2 minutes. L'adresse du site apparaît en haut de la page Pages : `https://VOTRE-NOM.github.io/cours/`.

## Ajouter un cours (au quotidien)

**Étape A : déposer le fichier**
- Dans votre dépôt, ouvrez le dossier `pdf` (ou `videos`).
- **Add file → Upload files**, glissez votre fichier, puis **Commit changes**.
- Donnez des noms simples : sans espace ni accent (`fonctions-affines.pdf`, `circuit-serie.mp4`).

**Étape B : l'ajouter à la liste**
- Ouvrez le fichier `cours.js`, cliquez sur le crayon (**Edit this file**).
- Copiez une ligne de la liste `COURS`, collez-la à la suite et changez les textes :

```js
{ classe: "Seconde Pro", matiere: "Maths", chapitre: "Les fonctions affines", titre: "Cours n°1", type: "pdf", fichier: "pdf/fonctions-affines.pdf" },
```

- `type` peut être `"pdf"`, `"video"` ou `"lien"` (adresse web complète, par exemple un lien YouTube).
- `classe` et `matiere` doivent s'écrire **exactement** comme dans les listes `CLASSES` et `MATIERES` en haut du fichier.
- Gardez les guillemets et la virgule à la fin de la ligne.
- Cliquez sur **Commit changes**. Au bout d'une minute, le site est à jour (rechargez la page).

**Vérifier votre travail** : ouvrez `https://VOTRE-NOM.github.io/cours/#/verif`. La page signale les fautes de frappe et les fichiers introuvables.

## Autres modifications

- **Changer le mot de passe** : dans `cours.js`, ligne `motDePasse`. Les élèves devront le saisir à nouveau.
- **Changer le titre** : lignes `titre` et `sousTitre` du même fichier.
- **Ajouter une classe ou une matière** : ajoutez une ligne dans `CLASSES` ou `MATIERES`.

## À savoir

- Le mot de passe est une porte fermée, pas un coffre-fort : il est lisible dans le code du site, et le dépôt GitHub est public. Ne déposez pas de corrigés d'évaluations ni de documents sensibles.
- Taille maximale d'un fichier envoyé depuis le navigateur : 25 Mo. Gardez l'ensemble du site sous 1 Go.
- Si une modification n'apparaît pas : rechargez en forçant (Ctrl + F5 sur ordinateur) et patientez 2 minutes.
- Sur un ordinateur partagé, un élève peut cliquer sur « Verrouiller le site sur cet appareil » en bas de page.
