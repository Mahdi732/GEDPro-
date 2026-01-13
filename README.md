# GEDPro — RH GED & Workflows

Plateforme NestJS/GraphQL pour la gestion électronique de documents et des processus RH : formulaires dynamiques, dossiers candidats, suivi des statuts, planification d’entretiens, avec isolation par organisation.

## Fonctionnalités
- Authentification JWT, rôles (ADMIN, RH, MANAGER, USER), support de l’`organizationId`.
- Formulaires dynamiques (texte, nombre, email, fichier, select, date) avec validations, finalité RH (recrutement/onboarding/évaluation), association à une offre/processus, réponses horodatées.
- Candidats : création à partir d’un formulaire, historique des changements d’état (Nouveau, Présélectionné, Entretien planifié, En entretien, Accepté, Refusé).
- Entretiens : planification/mise à jour/annulation, participants, durée, notes, identifiant de calendrier externe (placeholder).
- GraphQL Playground exposé sur `/graphql`.

## Prérequis
- Node.js 20+
- npm 10+
- MongoDB accessible (local ou hébergé)

## Installation & exécution (local)
```bash
npm install
# Facultatif : définir vos variables d’environnement
# set MONGODB_URI=mongodb://localhost:27017/gedPro
# set JWT_SECRET=change_me
npm run start:dev
```
- API GraphQL : http://localhost:3000/graphql

## Variables d’environnement
- `MONGODB_URI` (recommandé) : URI MongoDB (défaut `mongodb://localhost:27017/gedPro`).
- `JWT_SECRET` : secret JWT (défaut faible dans le code, changez-le en prod).
- `JWT_COOKIE_MAX_AGE` : durée du cookie en secondes (optionnel).
- `PORT` : port HTTP (défaut 3000).

## Principales opérations GraphQL
- Auth : `register`, `login`, `updateProfile`, `getProfile`.
- Formulaires : `createForm`, `listForms(organizationId)`, `getForm(id)`, `submitFormResponse`, `listResponses(formId)`.
- Candidats : `createCandidate`, `listCandidates(organizationId)`, `getCandidate(id)`, `updateCandidateStatus`.
- Entretiens : `scheduleInterview`, `updateInterview`, `cancelInterview`, `listInterviews(organizationId)`, `listInterviewsByCandidate(candidateId)`.

## Docker
Un `Dockerfile` multi-étapes est fourni. Il suppose un MongoDB externe ; passez l’URI via `MONGODB_URI`.

### Construire
```bash
docker build -t gedpro .
```

### Lancer (exemple, Mongo local sur l’hôte)
```bash
docker run --rm -p 3000:3000 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/gedPro" \
  -e JWT_SECRET="change_me" \
  gedpro
```

## À faire ensuite
- Remplacer le placeholder de synchronisation calendrier par une intégration réelle (Google Calendar / CalDAV / Outlook).
- Ajouter stockage documentaire + OCR/skills (MinIO + pipeline OCR).
- Mettre en place des notifications temps réel (WebSocket/pub-sub) pour les événements candidats/entretiens.
