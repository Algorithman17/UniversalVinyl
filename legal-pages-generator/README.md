# Le générateur des pages de Politique de protection des données personnelles de La CDA et de la Ville de La Rochelle

**Cet outil a été développé par [Martin Théo](https://martintheo.fr) à l'aide du générateur de site statique [Eleventy](https://www.11ty.dev/docs/)**

## Installation en local

1. Installer [Node.js](https://nodejs.org/en/download/package-manager) si vous ne l'avez pas déjà.
2. Installer les dépendances du projet en exécutant la commande `npm install` dans le répertoire du projet.
3. Créer un fichier `.env` à la racine et ajouter la ligne suivante `ELEVENTY_ENV=development`.
4. Démarrer le projet en exécutant la commande `npm run dev` dans le répertoire du projet.
5. Accéder à l'application en ouvrant l'URL `http://localhost:8080` dans un navigateur web.

## Créer une nouvelle page : Guide simplifié

**Créer le fichier de la page**

1. Supprimer le dossier `_site` si déjà existant.
2. Aller dans le dossier `src/_pages`.
3. Dupliquer le fichier `index.html`.
4. Renommer le fichier en `nom-de-votre-page.html` (par exemple, `tandem.html` pour le site Tandem).

**Configurer la page**

Le fichier `nom-de-votre-page.html` contient des informations importantes pour la configuration de votre page. Vous pouvez les modifier dans la section "front matter":

- **Permalink:** Définir l'URL de votre page (exemple: `/votre-permalien`).
- **Nom et URL du site:** Indiquer le nom et l'URL du site concerné.
- **Collectivité:** Préciser la collectivité qui gère le site (CDA ou Ville).
- **Date de modification:** Mettre à jour la date de modification du site.
- **Consentement Matomo:** Activer ou désactiver l'affichage du consentement Matomo.

**Contact et cookies**

Les informations de contact et les cookies du site se gèrent dans le dossier `src/_data`:

- **contactRights.json:** Contient les informations de contact pour la protection des données personnelles (adresse, email, formulaires de contact).
- **cookies.json:** Structure vierge pour ajouter les cookies spécifiques à votre site.
- **rights.json:** Défini les droits des utilisateurs sur leurs données.

**Ajouter des cookies**

1. Copier le fichier `cookies.json` et le renommer en `nom-de-votre-site-cookies.json`.
2. Modifier le fichier `nom-de-votre-site-cookies.json` pour inclure les cookies utilisés par votre site:
   - `title`: Type de cookie (ex: "Cookies techniques nécessaires").
   - `description`: Description du type de cookie.
   - `information`: Détails sur chaque cookie (nom, date d'expiration, utilisation).
3. Dans votre page `nom-de-votre-page.html`, ajouter le code suivant pour afficher les cookies:

```liquid
{% render "accordion.html" data: nom-de-votre-site-cookies %}
```

**Remarques**

- Pour les cookies statistiques, modifier manuellement la collectivité dans la description.
- Si le site ne contient pas les autres cookies, ajouter dans la description : `Ce site n’utilise aucun cookie type-du-cookie`
- Les informations de contact (formulaires) dans `contactRights.json` doivent correspondre à la collectivité (Ville ou Agglomération).
- Attention, lors que vous créez une nouvelle page et qu'une erreur apparaît. N'hésitez pas à supprimer le dossier `_site` à la racine.

**En résumé, la création d'une nouvelle page implique :**

1. Créer le fichier HTML de la page.
2. Configurer la page dans le "front matter".
3. Modifier le contenu de la page.
4. Gérer les informations de contact et les cookies si nécessaire.

**En suivant ces étapes simples, vous pourrez créer de nouvelles pages pour votre site web rapidement et facilement.**

## Déploiement du générateur

### LAB
Chaque commit sur une branche déploie une version sur le [LAB](https://donneespersonnelles-lab.larochelle.fr) 

### PRODUCTION
Chaque commit sur `master` build le projet pour la production. Le déploiement est ensuite à faire manuellement depuis la [page des pipelines](https://gitlab.agglo-larochelle.fr/ui/legal-pages-generator/-/pipelines) du projet ou directement sur le job `deploy-prod` 
