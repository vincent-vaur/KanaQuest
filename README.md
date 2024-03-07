<h1 align="center" id="title">KanaQuest</h1>

<p align="center"><img src="https://socialify.git.ci/vincent-vaur/KanaQuest/image?language=1&amp;name=1&amp;pattern=Solid&amp;theme=Dark" alt="project-image"></p>

<p id="description">Projet de plateforme d'apprentissage du Japonais</p>

<h2>🚀 Demo</h2>

[https://kanaquest.onrender.com](https://kanaquest.onrender.com)

<h2>🧐 Features</h2>

Voici la liste des features principales du projet:

- Authentification par mot de passe
- Authentification avec Google (bientôt disponible)
- Génération de Quizz
- Système de thème
- Statistiques par joueur (scores taux de réussite)
- ...

<h2>🛠️ Installation Steps:</h2>

<p>1. Dépendances</p>

```
npm install
```

<p>2. Lancement en mode dev</p>

```
npm run dev
```

<p>3. Interface de modification de la BDD</p>

```
npm run prisma:studio
```

<p>4. Importer les kanas depuis les fichiers CSV (dans le dossier scripts)</p>

```
npm run import:kanas
```

<p>5. Publier les changement de schéma de BDD</p>

```
npm run db:push
```

<p>6. Générer un hash de mot de passe</p>

```
npm run password:generate mon_mot_de_passe
```

<p>7. Lancement en mode production</p>

```
npm start
```

<h2>💻 Built with</h2>

Plugins et dépendances utilisées dans ce projet:

- ExpressJS
- Tailwind
- Prisma
- DaisyUI
- passportJS
- twig
