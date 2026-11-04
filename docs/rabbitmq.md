# RabbitMQ : vérifier que ça fonctionne

Le transport Messenger `async` utilise RabbitMQ (voir ADR-004). Quand une commande est passée, l'événement `CommandePassee` est publié dans la file `messages`, puis le conteneur `worker` le traite (décrémentation du stock).

## Démarrer

```
docker compose up -d --build
docker compose restart nginx   # seulement si php a été recréé (sinon 502)
```

Le premier build est long : il compile l'extension PHP `amqp`.

## Vérifier les conteneurs

```
docker compose ps
```

`rabbitmq` doit être `healthy` et `worker` en `Up`.

```
docker compose logs worker --tail 20
```

On doit voir `Consuming messages from transport "async"` et aucune erreur `Could not connect to the AMQP server`. Si cette erreur apparaît : `docker compose restart worker`.

## Interface web

http://localhost:15672 (identifiants `guest` / `guest`), onglet **Queues**.

## Vérifier avec Bruno

### 1. Passer une commande

| Étape | Requête | Détail |
|---|---|---|
| 1 | `POST http://localhost:8080/cart/items` | Body JSON : `{"productId": 89, "quantity": 1}`. Le `productId` vient de `GET /products`. |
| 2 | Lire la réponse | Onglet **Headers** : copier la valeur de `X-Cart-Token`. |
| 3 | `POST http://localhost:8080/orders` | Onglet **Headers** : `X-Cart-Token: <valeur copiée>`. Pas de body. Réponse attendue : `201`. |

`X-Cart-Token` est un **en-tête**, pas un paramètre d'URL ni un body.

### 2. Lire l'état de la file

`GET http://localhost:15672/api/queues`, onglet **Auth** → **Basic Auth** (`guest` / `guest`). Sans ça : `401`.

| Champ | Sens |
|---|---|
| `state` | `running` : la file est active |
| `message_stats.publish` | Nombre de messages publiés (+1 par commande) |
| `message_stats.ack` | Nombre de messages traités et acquittés par le worker (+1 par commande) |
| `messages_ready` | Messages en attente. Doit revenir à `0`. |
| `messages_unacknowledged` | Messages en cours de traitement. Doit revenir à `0`. |
| `consumers` | Toujours `0` : normal, le worker interroge la file (`basic.get`) au lieu de s'y abonner |
| `get_empty` | Nombre de fois où le worker a trouvé la file vide. Monte tout seul, environ une fois par seconde. |

Après une commande, `publish` et `ack` augmentent de 1 chacun et `messages_ready` retombe à `0`.

## Vérifier le résultat

- Logs du worker : `docker compose logs worker -f` doit afficher `CommandePassee was handled successfully`.
- Le stock du produit commandé a baissé de la quantité commandée (`GET /products` ou phpMyAdmin sur http://localhost:8081).

## Voir un message en attente

```
docker compose stop worker
```

Passer une commande : `messages_ready` passe à `1`.

```
docker compose start worker
```

Le message est traité et `messages_ready` retombe à `0`.

## Problèmes courants

| Symptôme | Cause | Solution |
|---|---|---|
| `502 Bad Gateway` sur `localhost:8080` | nginx garde l'ancienne adresse du conteneur `php` | `docker compose restart nginx` |
| `404` sur `GET /` | Aucune route sur `/` | Normal : utiliser `/products` |
| `401` sur `/api/queues` | Authentification manquante | Bruno : Auth → Basic Auth |
| `422` sur `POST /orders` | Token absent ou panier vide | Envoyer `X-Cart-Token` en en-tête, après un `POST /cart/items` |
| `messages_ready` reste supérieur à `0` | Le worker ne traite plus | `docker compose logs worker`, puis `docker compose restart worker` |
