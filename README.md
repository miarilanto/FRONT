# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.


============================================================
        GESTION-COLIS — ERREURS ET SOLUTIONS
============================================================

Technologies :
- Node.js
- Express.js
- Prisma 7
- MySQL / MariaDB
- Nodemon
- Postman

Backend :
http://localhost:5000

Base de données :
gestion_colis


============================================================
1. ERREUR : Cannot find module '.prisma/client/default'
============================================================

ERREUR :

Error: Cannot find module '.prisma/client/default'

Exemple :

Error: Cannot find module '.prisma/client/default'
Require stack:
- node_modules/@prisma/client/default.js
- src/config/database.js

CAUSE :

Le projet utilise :

const { PrismaClient } = require("@prisma/client");

mais le client Prisma n'a pas été généré correctement.

Cela peut également arriver lorsqu'on utilise Prisma 7 avec
le générateur :

generator client {
  provider = "prisma-client"
}

SOLUTION :

Vérifier le fichier prisma/schema.prisma.

Exemple :

generator client {
  provider = "prisma-client"
  output   = "../src/generated/client"
}

Puis exécuter :

npx prisma generate


Avec le nouveau générateur, database.js doit utiliser :

const { PrismaClient } = require("../generated/client");

et non :

const { PrismaClient } = require("@prisma/client");


============================================================
2. ERREUR : Cannot find module '../generated/client'
============================================================

ERREUR :

Error: Cannot find module '../generated/client'

CAUSE :

database.js contient :

const { PrismaClient } = require("../generated/client");

mais le dossier généré n'existe pas.

SOLUTION :

Vérifier schema.prisma :

generator client {
  provider = "prisma-client"
  output   = "../src/generated/client"
}

Puis :

npx prisma generate

Le dossier suivant doit apparaître :

src/
  generated/
    client/


Si le dossier n'existe toujours pas :

1. Vérifier les erreurs de :

npx prisma generate

2. Vérifier que schema.prisma est bien situé dans :

prisma/schema.prisma


============================================================
3. ERREUR : PrismaConfigEnvError
============================================================

ERREUR :

Failed to load config file ...

PrismaConfigEnvError:
Cannot resolve environment variable: DATABASE_URL


CAUSE :

DATABASE_URL est absente du fichier .env ou le fichier .env
n'est pas au bon endroit.

SOLUTION :

Créer :

backend/.env

Exemple :

DATABASE_URL="mysql://root@localhost:3306/gestion_colis"
PORT=5000

Puis :

npx prisma validate

et :

npx prisma generate


============================================================
4. ERREUR : DATABASE_URL incorrecte
============================================================

MAUVAISE CONFIGURATION :

DATABASE_URL=mysql+pymysql://root:password@localhost:3306/gestion_colis

CAUSE :

mysql+pymysql:// est une syntaxe utilisée notamment avec
Python / SQLAlchemy.

Prisma utilise :

mysql://

SOLUTION :

Si MySQL utilise root sans mot de passe :

DATABASE_URL="mysql://root@localhost:3306/gestion_colis"


Si MySQL possède un mot de passe :

DATABASE_URL="mysql://root:MOT_DE_PASSE@localhost:3306/gestion_colis"


============================================================
5. ERREUR : pool timeout / P2039
============================================================

ERREUR :

PrismaClientKnownRequestError

Code: P2039

Message :

pool timeout: failed to retrieve a connection from pool
after 10000ms

Exemple :

pool connections:
active=0
idle=0
limit=5


CAUSES POSSIBLES :

- MySQL/MariaDB n'est pas démarré.
- Mauvais host.
- Mauvais port.
- Mauvais utilisateur.
- Mauvais mot de passe.
- Mauvais nom de base de données.
- Configuration de l'adapter MariaDB incorrecte.


SOLUTION :

Vérifier que MySQL/MariaDB est démarré.

Si XAMPP est utilisé :
démarrer MySQL dans XAMPP.

Vérifier :

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=gestion_colis


Vérifier que la base existe :

SHOW DATABASES;

Puis :

USE gestion_colis;

Puis :

SHOW TABLES;


============================================================
6. CONFIGURATION .env RECOMMANDÉE
============================================================

Pour cette configuration :

- MySQL : localhost
- Port : 3306
- Utilisateur : root
- Mot de passe : vide
- Base : gestion_colis
- Backend : port 5000
- Frontend : port 5173

Utiliser :

DATABASE_URL="mysql://root@localhost:3306/gestion_colis"

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=gestion_colis

PORT=5000

SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=

FRONTEND_URL=http://localhost:5173


============================================================
7. ERREUR : req.body est undefined
============================================================

ERREUR :

TypeError:
Cannot destructure property 'codeit' of 'req.body'
as it is undefined.

Ou :

Cannot destructure property 'idvoit' of 'req.body'
as it is undefined.


CAUSE :

Express ne reçoit pas le corps JSON.

SOLUTION :

Dans app.js, ajouter :

app.use(express.json());


Exemple :

const express = require("express");

const app = express();

app.use(express.json());


IMPORTANT :

Cette ligne doit être placée AVANT les routes.

Exemple :

app.use(express.json());

app.use("/api/itineraires", itineraireRoutes);
app.use("/api/voitures", voitureRoutes);
app.use("/api/envois", envoyerRoutes);


============================================================
8. ERREUR POSTMAN : champs obligatoires
============================================================

ERREUR :

{
  "message": "codeit, villedep et villearr sont obligatoires"
}


CAUSE :

Le Body Postman est vide ou incorrect.

SOLUTION :

Dans Postman :

Body
→ raw
→ JSON

Puis :

{
  "codeit": "IT001",
  "villedep": "Antananarivo",
  "villearr": "Toamasina"
}


Vérifier également le Header :

Content-Type: application/json


============================================================
9. POSTMAN : GET TOUS LES ITINÉRAIRES
============================================================

Méthode :

GET

URL :

http://localhost:5000/api/itineraires

Si aucune donnée :

[]

Si des données existent :

[
  {
    "codeit": "IT001",
    "villedep": "Antananarivo",
    "villearr": "Toamasina"
  }
]


============================================================
10. POSTMAN : CREER UN ITINERAIRE
============================================================

Méthode :

POST

URL :

http://localhost:5000/api/itineraires

Body :

{
  "codeit": "IT001",
  "villedep": "Antananarivo",
  "villearr": "Toamasina"
}

Header :

Content-Type: application/json


============================================================
11. POSTMAN : RECHERCHER UN ITINERAIRE
============================================================

Méthode :

GET

URL :

http://localhost:5000/api/itineraires/recherche?q=Antananarivo

IMPORTANT :

La route /recherche doit être déclarée avant :

/:codeit

Exemple correct :

router.get("/", controller.getAll);

router.get("/recherche", controller.rechercher);

router.get("/:codeit/voitures", controller.getWithVoitures);

router.get("/:codeit", controller.getById);


============================================================
12. ERREUR : Itinéraire introuvable
============================================================

Réponse :

{
  "message": "Itinéraire introuvable"
}


CAUSE :

Le code demandé n'existe pas.

Exemple :

GET /api/itineraires/XXX

alors que la base contient :

IT001
IT002
IT003


SOLUTION :

Vérifier les données :

SELECT * FROM Itineraire;


============================================================
13. POSTMAN : MODIFIER UN ITINERAIRE
============================================================

Méthode :

PUT

URL :

http://localhost:5000/api/itineraires/IT001

Body :

{
  "villedep": "Antananarivo",
  "villearr": "Mahajanga"
}

Content-Type :

application/json


============================================================
14. POSTMAN : SUPPRIMER UN ITINERAIRE
============================================================

Méthode :

DELETE

URL :

http://localhost:5000/api/itineraires/IT001


============================================================
15. ERREUR : clé étrangère lors de la suppression
============================================================

CAUSE :

Un itinéraire est utilisé par une voiture.

Exemple :

Voiture :

codeit = IT001

On essaie de supprimer :

IT001


La base refuse la suppression pour protéger
l'intégrité des données.


SOLUTION :

Supprimer ou modifier d'abord les voitures liées.

Exemple :

SELECT *
FROM Voiture
WHERE codeit = 'IT001';


Puis supprimer la voiture si nécessaire.


============================================================
16. ERREUR : Prisma P2002
============================================================

ERREUR :

PrismaClientKnownRequestError
Code: P2002


CAUSE :

Violation d'une contrainte UNIQUE.

Exemple :

Créer deux fois :

codeit = IT001


SOLUTION :

Utiliser un autre code :

IT002


Vérifier avant insertion :

SELECT *
FROM Itineraire
WHERE codeit = 'IT001';


============================================================
17. ERREUR : Prisma P2003
============================================================

ERREUR :

PrismaClientKnownRequestError
Code: P2003


CAUSE :

Violation d'une clé étrangère.

Exemple :

Créer une voiture avec :

codeit = IT999

alors que IT999 n'existe pas dans Itineraire.


SOLUTION :

Créer d'abord l'itinéraire :

IT999

puis créer la voiture.


ORDRE :

Itineraire
    ↓
Voiture
    ↓
Envoyer
    ↓
Recevoir


============================================================
18. ERREUR : Prisma P2025
============================================================

ERREUR :

PrismaClientKnownRequestError
Code: P2025


CAUSE :

On essaie de modifier ou supprimer un élément qui
n'existe pas.


Exemple :

DELETE /api/itineraires/IT999


SOLUTION :

Vérifier :

SELECT *
FROM Itineraire
WHERE codeit = 'IT999';


Avant update/delete, il est préférable de vérifier
que l'enregistrement existe.


============================================================
19. ERREUR : "Une erreur interne est survenue"
============================================================

Réponse :

{
  "message": "Une erreur interne est survenue"
}


CAUSE :

Le middleware d'erreur masque l'erreur réelle.

Exemple :

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Une erreur interne est survenue"
  });
};


SOLUTION EN DEVELOPPEMENT :

Utiliser :

const errorMiddleware = (err, req, res, next) => {
  console.error("========== ERREUR ==========");
  console.error("Nom :", err.name);
  console.error("Message :", err.message);
  console.error("Code :", err.code);
  console.error("Stack :", err.stack);

  res.status(500).json({
    success: false,
    message: err.message,
    name: err.name,
    code: err.code || null,
    stack: err.stack
  });
};

module.exports = errorMiddleware;


IMPORTANT :

Ne pas afficher stack en production.


============================================================
20. ERREUR : PORT 3000 AU LIEU DE 5000
============================================================

CAUSE :

Le frontend utilise généralement :

http://localhost:5173

ou parfois :

http://localhost:3000


Mais le backend doit utiliser :

http://localhost:5000


SOLUTION :

Dans .env :

PORT=5000


Dans server.js :

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


Pour Postman :

http://localhost:5000/api/...


============================================================
21. ERREUR : nodemon clean exit
============================================================

Message :

[nodemon] clean exit - waiting for changes before restart


CAUSE POSSIBLE :

server.js ne garde pas le serveur Express actif.


SOLUTION :

server.js doit contenir :

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


============================================================
22. ERREUR : npm install / packages deprecated
============================================================

Exemple :

npm warn deprecated glob@11.1.0


CAUSE :

Une dépendance utilise une ancienne version d'un package.


Si :

added xxx packages

et :

found 0 vulnerabilities


l'installation est généralement réussie.


SOLUTION :

Ce warning n'empêche pas forcément le projet de fonctionner.

Ne pas modifier immédiatement les dépendances du projet
sans vérifier le package.json.


============================================================
23. ERREUR : npm allow-scripts
============================================================

Exemple :

npm warn allow-scripts
@prisma/engines
prisma


CAUSE :

La configuration npm demande une autorisation pour
certains scripts d'installation.


SOLUTION :

Vérifier le projet et les dépendances.

Si Prisma ne fonctionne pas correctement, vérifier :

npx prisma -v

Puis :

npx prisma generate


============================================================
24. ERREUR : npm install ne fonctionne pas
============================================================

COMMANDES :

cd backend

npm install


Si le dossier backend n'existe pas :

cd ..

dir

Puis rechercher le vrai dossier du backend.


============================================================
25. RECUPERER UN PROJET GITHUB
============================================================

Commande :

git clone URL_DU_PROJET

Exemple :

git clone https://github.com/ami/gestion-colis.git


Puis :

cd gestion-colis

cd backend

npm install


============================================================
26. APRES AVOIR CLONE LE PROJET
============================================================

Vérifier :

package.json
prisma/schema.prisma
.env
src/
node_modules/


Installer :

npm install


Générer Prisma :

npx prisma generate


Valider Prisma :

npx prisma validate


Lancer :

npm run dev


============================================================
27. BASE DE DONNEES
============================================================

Entrer dans MariaDB :

USE gestion_colis;


Afficher les tables :

SHOW TABLES;


Afficher la structure :

DESCRIBE Itineraire;


Afficher les données :

SELECT * FROM Itineraire;


============================================================
28. INSERER DES ITINERAIRES
============================================================

INSERT INTO Itineraire (codeit, villedep, villearr)
VALUES
('IT001', 'Antananarivo', 'Toamasina'),
('IT002', 'Antananarivo', 'Mahajanga'),
('IT003', 'Antananarivo', 'Fianarantsoa'),
('IT004', 'Antananarivo', 'Antsirabe'),
('IT005', 'Toamasina', 'Sambava'),
('IT006', 'Mahajanga', 'Antsiranana'),
('IT007', 'Fianarantsoa', 'Toliara'),
('IT008', 'Antsirabe', 'Antananarivo');


============================================================
29. ORDRE D'INSERTION DES DONNEES
============================================================

Les tables sont liées.

Il faut respecter l'ordre :

1. Itineraire
2. Voiture
3. Envoyer
4. Recevoir


Exemple :

Itineraire IT001
       ↓
Voiture V001 liée à IT001
       ↓
Envoyer lié à V001
       ↓
Recevoir lié à l'envoi


============================================================
30. TESTS POSTMAN ITINERAIRE
============================================================

GET :

http://localhost:5000/api/itineraires


GET :

http://localhost:5000/api/itineraires/IT001


GET :

http://localhost:5000/api/itineraires/recherche?q=Antananarivo


GET :

http://localhost:5000/api/itineraires/IT001/voitures


POST :

http://localhost:5000/api/itineraires


Body :

{
  "codeit": "IT009",
  "villedep": "Toamasina",
  "villearr": "Antananarivo"
}


PUT :

http://localhost:5000/api/itineraires/IT009


Body :

{
  "villedep": "Toamasina",
  "villearr": "Antsiranana"
}


DELETE :

http://localhost:5000/api/itineraires/IT009


============================================================
31. ORDRE DES TESTS POSTMAN
============================================================

1. GET tous les itinéraires
2. POST créer un itinéraire
3. GET un itinéraire
4. GET recherche
5. GET itinéraire + voitures
6. POST créer une voiture
7. GET voitures
8. POST créer un envoi
9. GET envois
10. POST créer une réception
11. GET réceptions
12. PUT modifier
13. DELETE


============================================================
32. REGLE PRINCIPALE POUR LE DEBUG
============================================================

Ne jamais se contenter de :

"Une erreur interne est survenue"


Toujours regarder le terminal.

Chercher :

Name :
Message :
Code :
Stack :


Pour Prisma, les codes importants sont notamment :

P2002 → donnée unique déjà existante
P2003 → problème de clé étrangère
P2025 → élément introuvable
P2039 → problème de connexion/pool


============================================================
33. COMMANDES DE VERIFICATION RAPIDE
============================================================

Vérifier Node :

node -v


Vérifier npm :

npm -v


Vérifier Prisma :

npx prisma -v


Valider schema :

npx prisma validate


Générer Prisma :

npx prisma generate


Vérifier Git :

git status


Installer dépendances :

npm install


Lancer le serveur :

npm run dev


============================================================
34. RESUME
============================================================

Si le serveur ne démarre pas :

1. Vérifier .env
2. Vérifier server.js
3. Vérifier npm install
4. Vérifier Prisma
5. Vérifier MySQL


Si Prisma ne fonctionne pas :

npx prisma validate
npx prisma generate


Si la base ne fonctionne pas :

Vérifier MySQL
Vérifier DATABASE_URL
Vérifier gestion_colis


Si Postman retourne une erreur :

1. Lire le terminal
2. Lire le code HTTP
3. Lire message
4. Lire code Prisma
5. Vérifier les données liées


============================================================
FIN
============================================================







pour les backend
============================================================
        GESTION-COLIS — ERREURS ET SOLUTIONS
============================================================

Technologies :
- Node.js
- Express.js
- Prisma 7
- MySQL / MariaDB
- Nodemon
- Postman

Backend :
http://localhost:5000

Base de données :
gestion_colis


============================================================
1. ERREUR : Cannot find module '.prisma/client/default'
============================================================

ERREUR :

Error: Cannot find module '.prisma/client/default'

Exemple :

Error: Cannot find module '.prisma/client/default'
Require stack:
- node_modules/@prisma/client/default.js
- src/config/database.js

CAUSE :

Le projet utilise :

const { PrismaClient } = require("@prisma/client");

mais le client Prisma n'a pas été généré correctement.

Cela peut également arriver lorsqu'on utilise Prisma 7 avec
le générateur :

generator client {
  provider = "prisma-client"
}

SOLUTION :

Vérifier le fichier prisma/schema.prisma.

Exemple :

generator client {
  provider = "prisma-client"
  output   = "../src/generated/client"
}

Puis exécuter :

npx prisma generate


Avec le nouveau générateur, database.js doit utiliser :

const { PrismaClient } = require("../generated/client");

et non :

const { PrismaClient } = require("@prisma/client");


============================================================
2. ERREUR : Cannot find module '../generated/client'
============================================================

ERREUR :

Error: Cannot find module '../generated/client'

CAUSE :

database.js contient :

const { PrismaClient } = require("../generated/client");

mais le dossier généré n'existe pas.

SOLUTION :

Vérifier schema.prisma :

generator client {
  provider = "prisma-client"
  output   = "../src/generated/client"
}

Puis :

npx prisma generate

Le dossier suivant doit apparaître :

src/
  generated/
    client/


Si le dossier n'existe toujours pas :

1. Vérifier les erreurs de :

npx prisma generate

2. Vérifier que schema.prisma est bien situé dans :

prisma/schema.prisma


============================================================
3. ERREUR : PrismaConfigEnvError
============================================================

ERREUR :

Failed to load config file ...

PrismaConfigEnvError:
Cannot resolve environment variable: DATABASE_URL


CAUSE :

DATABASE_URL est absente du fichier .env ou le fichier .env
n'est pas au bon endroit.

SOLUTION :

Créer :

backend/.env

Exemple :

DATABASE_URL="mysql://root@localhost:3306/gestion_colis"
PORT=5000

Puis :

npx prisma validate

et :

npx prisma generate


============================================================
4. ERREUR : DATABASE_URL incorrecte
============================================================

MAUVAISE CONFIGURATION :

DATABASE_URL=mysql+pymysql://root:password@localhost:3306/gestion_colis

CAUSE :

mysql+pymysql:// est une syntaxe utilisée notamment avec
Python / SQLAlchemy.

Prisma utilise :

mysql://

SOLUTION :

Si MySQL utilise root sans mot de passe :

DATABASE_URL="mysql://root@localhost:3306/gestion_colis"


Si MySQL possède un mot de passe :

DATABASE_URL="mysql://root:MOT_DE_PASSE@localhost:3306/gestion_colis"


============================================================
5. ERREUR : pool timeout / P2039
============================================================

ERREUR :

PrismaClientKnownRequestError

Code: P2039

Message :

pool timeout: failed to retrieve a connection from pool
after 10000ms

Exemple :

pool connections:
active=0
idle=0
limit=5


CAUSES POSSIBLES :

- MySQL/MariaDB n'est pas démarré.
- Mauvais host.
- Mauvais port.
- Mauvais utilisateur.
- Mauvais mot de passe.
- Mauvais nom de base de données.
- Configuration de l'adapter MariaDB incorrecte.


SOLUTION :

Vérifier que MySQL/MariaDB est démarré.

Si XAMPP est utilisé :
démarrer MySQL dans XAMPP.

Vérifier :

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=gestion_colis


Vérifier que la base existe :

SHOW DATABASES;

Puis :

USE gestion_colis;

Puis :

SHOW TABLES;


============================================================
6. CONFIGURATION .env RECOMMANDÉE
============================================================

Pour cette configuration :

- MySQL : localhost
- Port : 3306
- Utilisateur : root
- Mot de passe : vide
- Base : gestion_colis
- Backend : port 5000
- Frontend : port 5173

Utiliser :

DATABASE_URL="mysql://root@localhost:3306/gestion_colis"

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=gestion_colis

PORT=5000

SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=

FRONTEND_URL=http://localhost:5173


============================================================
7. ERREUR : req.body est undefined
============================================================

ERREUR :

TypeError:
Cannot destructure property 'codeit' of 'req.body'
as it is undefined.

Ou :

Cannot destructure property 'idvoit' of 'req.body'
as it is undefined.


CAUSE :

Express ne reçoit pas le corps JSON.

SOLUTION :

Dans app.js, ajouter :

app.use(express.json());


Exemple :

const express = require("express");

const app = express();

app.use(express.json());


IMPORTANT :

Cette ligne doit être placée AVANT les routes.

Exemple :

app.use(express.json());

app.use("/api/itineraires", itineraireRoutes);
app.use("/api/voitures", voitureRoutes);
app.use("/api/envois", envoyerRoutes);


============================================================
8. ERREUR POSTMAN : champs obligatoires
============================================================

ERREUR :

{
  "message": "codeit, villedep et villearr sont obligatoires"
}


CAUSE :

Le Body Postman est vide ou incorrect.

SOLUTION :

Dans Postman :

Body
→ raw
→ JSON

Puis :

{
  "codeit": "IT001",
  "villedep": "Antananarivo",
  "villearr": "Toamasina"
}


Vérifier également le Header :

Content-Type: application/json


============================================================
9. POSTMAN : GET TOUS LES ITINÉRAIRES
============================================================

Méthode :

GET

URL :

http://localhost:5000/api/itineraires

Si aucune donnée :

[]

Si des données existent :

[
  {
    "codeit": "IT001",
    "villedep": "Antananarivo",
    "villearr": "Toamasina"
  }
]


============================================================
10. POSTMAN : CREER UN ITINERAIRE
============================================================

Méthode :

POST

URL :

http://localhost:5000/api/itineraires

Body :

{
  "codeit": "IT001",
  "villedep": "Antananarivo",
  "villearr": "Toamasina"
}

Header :

Content-Type: application/json


============================================================
11. POSTMAN : RECHERCHER UN ITINERAIRE
============================================================

Méthode :

GET

URL :

http://localhost:5000/api/itineraires/recherche?q=Antananarivo

IMPORTANT :

La route /recherche doit être déclarée avant :

/:codeit

Exemple correct :

router.get("/", controller.getAll);

router.get("/recherche", controller.rechercher);

router.get("/:codeit/voitures", controller.getWithVoitures);

router.get("/:codeit", controller.getById);


============================================================
12. ERREUR : Itinéraire introuvable
============================================================

Réponse :

{
  "message": "Itinéraire introuvable"
}


CAUSE :

Le code demandé n'existe pas.

Exemple :

GET /api/itineraires/XXX

alors que la base contient :

IT001
IT002
IT003


SOLUTION :

Vérifier les données :

SELECT * FROM Itineraire;


============================================================
13. POSTMAN : MODIFIER UN ITINERAIRE
============================================================

Méthode :

PUT

URL :

http://localhost:5000/api/itineraires/IT001

Body :

{
  "villedep": "Antananarivo",
  "villearr": "Mahajanga"
}

Content-Type :

application/json


============================================================
14. POSTMAN : SUPPRIMER UN ITINERAIRE
============================================================

Méthode :

DELETE

URL :

http://localhost:5000/api/itineraires/IT001


============================================================
15. ERREUR : clé étrangère lors de la suppression
============================================================

CAUSE :

Un itinéraire est utilisé par une voiture.

Exemple :

Voiture :

codeit = IT001

On essaie de supprimer :

IT001


La base refuse la suppression pour protéger
l'intégrité des données.


SOLUTION :

Supprimer ou modifier d'abord les voitures liées.

Exemple :

SELECT *
FROM Voiture
WHERE codeit = 'IT001';


Puis supprimer la voiture si nécessaire.


============================================================
16. ERREUR : Prisma P2002
============================================================

ERREUR :

PrismaClientKnownRequestError
Code: P2002


CAUSE :

Violation d'une contrainte UNIQUE.

Exemple :

Créer deux fois :

codeit = IT001


SOLUTION :

Utiliser un autre code :

IT002


Vérifier avant insertion :

SELECT *
FROM Itineraire
WHERE codeit = 'IT001';


============================================================
17. ERREUR : Prisma P2003
============================================================

ERREUR :

PrismaClientKnownRequestError
Code: P2003


CAUSE :

Violation d'une clé étrangère.

Exemple :

Créer une voiture avec :

codeit = IT999

alors que IT999 n'existe pas dans Itineraire.


SOLUTION :

Créer d'abord l'itinéraire :

IT999

puis créer la voiture.


ORDRE :

Itineraire
    ↓
Voiture
    ↓
Envoyer
    ↓
Recevoir


============================================================
18. ERREUR : Prisma P2025
============================================================

ERREUR :

PrismaClientKnownRequestError
Code: P2025


CAUSE :

On essaie de modifier ou supprimer un élément qui
n'existe pas.


Exemple :

DELETE /api/itineraires/IT999


SOLUTION :

Vérifier :

SELECT *
FROM Itineraire
WHERE codeit = 'IT999';


Avant update/delete, il est préférable de vérifier
que l'enregistrement existe.


============================================================
19. ERREUR : "Une erreur interne est survenue"
============================================================

Réponse :

{
  "message": "Une erreur interne est survenue"
}


CAUSE :

Le middleware d'erreur masque l'erreur réelle.

Exemple :

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Une erreur interne est survenue"
  });
};


SOLUTION EN DEVELOPPEMENT :

Utiliser :

const errorMiddleware = (err, req, res, next) => {
  console.error("========== ERREUR ==========");
  console.error("Nom :", err.name);
  console.error("Message :", err.message);
  console.error("Code :", err.code);
  console.error("Stack :", err.stack);

  res.status(500).json({
    success: false,
    message: err.message,
    name: err.name,
    code: err.code || null,
    stack: err.stack
  });
};

module.exports = errorMiddleware;


IMPORTANT :

Ne pas afficher stack en production.


============================================================
20. ERREUR : PORT 3000 AU LIEU DE 5000
============================================================

CAUSE :

Le frontend utilise généralement :

http://localhost:5173

ou parfois :

http://localhost:3000


Mais le backend doit utiliser :

http://localhost:5000


SOLUTION :

Dans .env :

PORT=5000


Dans server.js :

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


Pour Postman :

http://localhost:5000/api/...


============================================================
21. ERREUR : nodemon clean exit
============================================================

Message :

[nodemon] clean exit - waiting for changes before restart


CAUSE POSSIBLE :

server.js ne garde pas le serveur Express actif.


SOLUTION :

server.js doit contenir :

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


============================================================
22. ERREUR : npm install / packages deprecated
============================================================

Exemple :

npm warn deprecated glob@11.1.0


CAUSE :

Une dépendance utilise une ancienne version d'un package.


Si :

added xxx packages

et :

found 0 vulnerabilities


l'installation est généralement réussie.


SOLUTION :

Ce warning n'empêche pas forcément le projet de fonctionner.

Ne pas modifier immédiatement les dépendances du projet
sans vérifier le package.json.


============================================================
23. ERREUR : npm allow-scripts
============================================================

Exemple :

npm warn allow-scripts
@prisma/engines
prisma


CAUSE :

La configuration npm demande une autorisation pour
certains scripts d'installation.


SOLUTION :

Vérifier le projet et les dépendances.

Si Prisma ne fonctionne pas correctement, vérifier :

npx prisma -v

Puis :

npx prisma generate


============================================================
24. ERREUR : npm install ne fonctionne pas
============================================================

COMMANDES :

cd backend

npm install


Si le dossier backend n'existe pas :

cd ..

dir

Puis rechercher le vrai dossier du backend.


============================================================
25. RECUPERER UN PROJET GITHUB
============================================================

Commande :

git clone URL_DU_PROJET

Exemple :

git clone https://github.com/ami/gestion-colis.git


Puis :

cd gestion-colis

cd backend

npm install


============================================================
26. APRES AVOIR CLONE LE PROJET
============================================================

Vérifier :

package.json
prisma/schema.prisma
.env
src/
node_modules/


Installer :

npm install


Générer Prisma :

npx prisma generate


Valider Prisma :

npx prisma validate


Lancer :

npm run dev


============================================================
27. BASE DE DONNEES
============================================================

Entrer dans MariaDB :

USE gestion_colis;


Afficher les tables :

SHOW TABLES;


Afficher la structure :

DESCRIBE Itineraire;


Afficher les données :

SELECT * FROM Itineraire;


============================================================
28. INSERER DES ITINERAIRES
============================================================

INSERT INTO Itineraire (codeit, villedep, villearr)
VALUES
('IT001', 'Antananarivo', 'Toamasina'),
('IT002', 'Antananarivo', 'Mahajanga'),
('IT003', 'Antananarivo', 'Fianarantsoa'),
('IT004', 'Antananarivo', 'Antsirabe'),
('IT005', 'Toamasina', 'Sambava'),
('IT006', 'Mahajanga', 'Antsiranana'),
('IT007', 'Fianarantsoa', 'Toliara'),
('IT008', 'Antsirabe', 'Antananarivo');


============================================================
29. ORDRE D'INSERTION DES DONNEES
============================================================

Les tables sont liées.

Il faut respecter l'ordre :

1. Itineraire
2. Voiture
3. Envoyer
4. Recevoir


Exemple :

Itineraire IT001
       ↓
Voiture V001 liée à IT001
       ↓
Envoyer lié à V001
       ↓
Recevoir lié à l'envoi


============================================================
30. TESTS POSTMAN ITINERAIRE
============================================================

GET :

http://localhost:5000/api/itineraires


GET :

http://localhost:5000/api/itineraires/IT001


GET :

http://localhost:5000/api/itineraires/recherche?q=Antananarivo


GET :

http://localhost:5000/api/itineraires/IT001/voitures


POST :

http://localhost:5000/api/itineraires


Body :

{
  "codeit": "IT009",
  "villedep": "Toamasina",
  "villearr": "Antananarivo"
}


PUT :

http://localhost:5000/api/itineraires/IT009


Body :

{
  "villedep": "Toamasina",
  "villearr": "Antsiranana"
}


DELETE :

http://localhost:5000/api/itineraires/IT009


============================================================
31. ORDRE DES TESTS POSTMAN
============================================================

1. GET tous les itinéraires
2. POST créer un itinéraire
3. GET un itinéraire
4. GET recherche
5. GET itinéraire + voitures
6. POST créer une voiture
7. GET voitures
8. POST créer un envoi
9. GET envois
10. POST créer une réception
11. GET réceptions
12. PUT modifier
13. DELETE


============================================================
32. REGLE PRINCIPALE POUR LE DEBUG
============================================================

Ne jamais se contenter de :

"Une erreur interne est survenue"


Toujours regarder le terminal.

Chercher :

Name :
Message :
Code :
Stack :


Pour Prisma, les codes importants sont notamment :

P2002 → donnée unique déjà existante
P2003 → problème de clé étrangère
P2025 → élément introuvable
P2039 → problème de connexion/pool


============================================================
33. COMMANDES DE VERIFICATION RAPIDE
============================================================

Vérifier Node :

node -v


Vérifier npm :

npm -v


Vérifier Prisma :

npx prisma -v


Valider schema :

npx prisma validate


Générer Prisma :

npx prisma generate


Vérifier Git :

git status


Installer dépendances :

npm install


Lancer le serveur :

npm run dev


============================================================
34. RESUME
============================================================

Si le serveur ne démarre pas :

1. Vérifier .env
2. Vérifier server.js
3. Vérifier npm install
4. Vérifier Prisma
5. Vérifier MySQL


Si Prisma ne fonctionne pas :

npx prisma validate
npx prisma generate


Si la base ne fonctionne pas :

Vérifier MySQL
Vérifier DATABASE_URL
Vérifier gestion_colis


Si Postman retourne une erreur :

1. Lire le terminal
2. Lire le code HTTP
3. Lire message
4. Lire code Prisma
5. Vérifier les données liées


============================================================
FIN
============================================================



CTR+SHIFT+F recherche mot ou des textes
CTR+SHIFT recherche des code


//installation lucide art
npm install lucide-react