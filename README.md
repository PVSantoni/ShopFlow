# ShopFlow

Boutique en ligne de composants électroniques et de kits robotiques. Projet fil rouge du module « Architecture des systèmes logiciels » (MIRA).

- **Backend** : PHP 8.3, Symfony 7.4, Doctrine ORM
- **Frontend** : Angular
- **Base de données** : MySQL 8.4
- **Architecture** : monolithe modulaire, un module par bounded context, Commande en architecture hexagonale (voir [docs/](docs/))

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) lancé (Docker Compose v2 inclus)
- Git

Aucun PHP, Node ni MySQL n'est à installer sur ta machine : tout tourne dans les conteneurs.

Sous Windows, utilise Docker Desktop avec WSL2 et clone le dépôt dans le système de fichiers de WSL (par exemple `~/projets`), pas dans `C:\`. C'est beaucoup plus rapide.

## Démarrage rapide

```bash
git clone https://github.com/PVSantoni/ShopFlow.git
cd ShopFlow

docker compose build
docker compose run --rm php composer install      # dépendances PHP (dossier backend/vendor)
docker compose run --rm frontend npm install      # dépendances Angular (dossier frontend/node_modules)
docker compose up -d

docker compose exec php bin/console doctrine:migrations:migrate -n   # crée les tables
docker compose exec php bin/console doctrine:fixtures:load -n        # charge les produits de démo
```

Le premier démarrage d'Angular prend une minute. Suis-le avec `docker compose logs -f frontend` jusqu'à ce que le log affiche l'adresse `http://localhost:4200`.

| Quoi | Adresse |
|---|---|
| Site (Angular) | http://localhost:4200 |
| API (Symfony via nginx) | http://localhost:8080 |
| Base de données dans le navigateur (phpMyAdmin) | http://localhost:8081 |
| MySQL depuis ta machine | `127.0.0.1`, port `3306` |

> **Ne lance jamais `npm`, `ng` ou `composer` directement sur ta machine.** Passe toujours par Docker (`docker compose run --rm frontend npm install`, `docker compose exec php composer require ...`). Les dossiers `frontend/node_modules` et `backend/vendor` sont partagés avec les conteneurs : un `npm install` lancé sur ton Mac ou ton PC y installe des fichiers pour ton système, et le conteneur Linux ne démarre plus. VS Code peut te proposer d'installer les dépendances : refuse.

## Les services

| Service | Image | Rôle | Port |
|---|---|---|---|
| `php` | build de `docker/php` (PHP 8.3-FPM) | exécute Symfony, Composer, la console, PHPUnit, Deptrac | 9000 (interne) |
| `nginx` | nginx 1.27 | sert l'API, transmet à `php` | 8080 |
| `db` | MySQL 8.4 | base de données, volume `db_data` | 3306 |
| `phpmyadmin` | phpMyAdmin 5 | interface web pour explorer la base, déjà connectée | 8081 |
| `worker` | même image que `php` | traite les messages en arrière-plan (`messenger:consume`) | aucun |
| `frontend` | build de `docker/frontend` (Node 22) | lance `ng serve` avec rechargement automatique | 4200 |

## Base de données

Les identifiants de développement sont dans le fichier [.env](.env) à la racine : `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` et `MYSQL_ROOT_PASSWORD`. Ce sont des valeurs de dev uniquement.

**Dans le navigateur avec phpMyAdmin** (le plus simple) : ouvre http://localhost:8081. Tu es déjà connecté à la base `shopflow`, sans mot de passe à saisir.

**Ouvrir un shell MySQL dans le conteneur** (aucun mot de passe à taper non plus) :

```bash
docker compose exec db sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"'
```

Exemple : `SHOW TABLES;` puis `SELECT name, price_cents FROM product LIMIT 5;`. Les prix sont stockés en centimes. Les tables actuelles sont `product`, `category`, `cart`, `cart_item` et `commande`. La table `messenger_messages` (la file d'attente des événements) est créée automatiquement.

**Se connecter avec un client graphique** (TablePlus, DBeaver, DataGrip, extension VS Code) :

| Champ | Valeur |
|---|---|
| Hôte | `127.0.0.1` (pas `localhost`) |
| Port | `3306` |
| Base | valeur de `MYSQL_DATABASE` dans `.env` |
| Utilisateur | valeur de `MYSQL_USER` dans `.env` |
| Mot de passe | valeur de `MYSQL_PASSWORD` dans `.env` |

**Depuis un autre conteneur**, l'hôte est `db` et non `127.0.0.1`. C'est ce que fait Symfony, via `DATABASE_URL` dans [backend/.env](backend/.env).

Opérations courantes :

```bash
# Appliquer les migrations
docker compose exec php bin/console doctrine:migrations:migrate -n

# Générer une migration après avoir modifié une entité
docker compose exec php bin/console doctrine:migrations:diff

# Recharger les données de démo (VIDE la base avant de recharger)
docker compose exec php bin/console doctrine:fixtures:load -n

# Repartir de zéro : supprime le volume, donc toutes les données
docker compose down -v
```

Si tu modifies les identifiants dans `.env` après le premier démarrage, MySQL garde les anciens, car ils ne sont lus qu'à la création du volume. Lance `docker compose down -v` pour les appliquer. Pense aussi à mettre à jour `DATABASE_URL`, qui doit contenir les mêmes valeurs.

## L'API

Le panier et les commandes sont identifiés par un jeton dans l'en-tête `X-Cart-Token`. L'API renvoie ce jeton dans l'en-tête de la réponse à la première création de panier.

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/products` | liste des produits |
| GET | `/products/{slug}` | fiche d'un produit |
| GET | `/cart` | contenu du panier |
| POST | `/cart/items` | ajoute un produit : `{"productId": 1, "quantity": 2}` |
| PATCH | `/cart/items/{productId}` | change la quantité : `{"quantity": 3}` |
| POST | `/orders` | passe la commande du panier (201 si créée, 422 si le panier est vide ou inconnu) |

```bash
curl http://localhost:8080/products

curl -i -X POST http://localhost:8080/cart/items \
  -H 'Content-Type: application/json' \
  -d '{"productId": 1, "quantity": 2}'
# repère la ligne « X-Cart-Token: ... » dans la réponse

curl -i -X POST http://localhost:8080/orders -H 'X-Cart-Token: <le jeton>'
```

Quand une commande est passée, l'événement `CommandePassee` est envoyé dans la file. Le service `worker` le traite quelques secondes plus tard et décrémente le stock du produit. Pour le voir en direct : `docker compose logs -f worker`. Si le `worker` est arrêté, les messages attendent dans la file et le stock ne bouge pas tant qu'il n'est pas relancé.

## Tests et règles d'architecture

```bash
# Tests unitaires (le domaine se teste sans base de données)
docker compose exec php bin/phpunit

# Règles d'architecture : liste les dépendances interdites
docker compose exec php vendor/bin/deptrac analyse
```

[backend/deptrac.yaml](backend/deptrac.yaml) définit qui a le droit d'importer qui, entre modules et entre les zones de Commande. Une dépendance interdite apparaît comme une violation, et la commande se termine alors avec une erreur.

## Structure du dépôt

```
backend/src/
├── Catalogue/        module produits (API, entités, fixtures)
├── Panier/           module panier
├── Commande/         module hexagonal : Domain, Application, Infrastructure, UI
├── Paiement/         module à venir
├── Livraison/        module à venir
├── Notification/     module à venir
└── Shared/           gestion commune des erreurs de l'API
backend/tests/        tests PHPUnit
frontend/src/app/     application Angular
docker/               Dockerfiles et configuration nginx
docs/                 exigences, bounded contexts, schémas C4, ADR
```

Décisions d'architecture : [ADR-001](docs/ADR-001.md), [ADR-002](docs/ADR-002.md), [ADR-003](docs/ADR-003.md), [ADR-004](docs/ADR-004.md).

## Commandes utiles

```bash
docker compose ps                         # état des services
docker compose logs -f php                # logs d'un service (php, nginx, db, frontend)
docker compose exec php bin/console       # console Symfony
docker compose exec php composer require <paquet>
docker compose restart frontend
docker compose down                       # arrête tout, garde les données
```

## Dépannage

| Symptôme | Cause probable et solution |
|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop n'est pas lancé. |
| La page `localhost:4200` ne répond pas | Angular compile encore, ou `npm install` n'a pas été fait. Regarde `docker compose logs frontend`. |
| `Class ... not found` ou erreur d'autoload côté PHP | `docker compose run --rm php composer install` n'a pas été lancé après un pull. |
| Le conteneur `frontend` s'arrête avec `Cannot find native binding` ou `Cannot find module ... linux-arm64-musl.node` | `node_modules` a été installé hors de Docker. Répare avec `rm -rf frontend/node_modules`, puis `docker compose run --rm frontend npm install`, puis `docker compose up -d frontend`. |
| Les appels du site vers l'API échouent | Vérifie que `nginx` tourne sur le port 8080. L'URL est fixée dans `frontend/src/app/core/api.ts`. |
| `SQLSTATE[HY000] [2002]` | MySQL n'est pas encore prêt. Attends que `docker compose ps` affiche `healthy` pour `db`. |
| Port 3306, 8080, 8081 ou 4200 déjà utilisé | Un autre programme occupe le port (souvent un MySQL local sur 3306). Arrête-le ou change le mapping dans `docker-compose.yml`. |
| Le stock ne diminue pas après une commande | Le `worker` ne tourne pas. Vérifie avec `docker compose ps worker`, puis `docker compose logs worker`. |
| Le `worker` redémarre en boucle juste après un clone | Normal tant que `composer install` n'a pas été fait. Il démarre correctement ensuite. |
| Sous Linux, les dossiers `vendor` ou `node_modules` appartiennent à `root` | Ils sont créés par les conteneurs. Corrige avec `sudo chown -R $USER:$USER backend/vendor frontend/node_modules`. |
| Après un `git pull`, une table ou une colonne manque | Lance les migrations : `docker compose exec php bin/console doctrine:migrations:migrate -n`. |
