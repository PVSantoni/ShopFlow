# Architecture monolithique modulaire, hexagonale et événementielle

## Contexte

Nous développons ShopFlow, un site e-commerce permettant de gérer les produits, les paniers, les commandes, les paiements et les livraisons. Le projet est réalisé par une équipe de 2 à 3 personnes.

Contraintes du système :
- 200 commandes par jour et 200 utilisateurs simultanés.
- Temps de réponse cible de 1 à 1,5 seconde.
- Maximum 2 heures d'indisponibilité par semaine.
- Paiements sécurisés et respect du RGPD.
- Possibilité d'évolution future.

## Décision

Nous adoptons un **monolithe modulaire** : une seule application déployée, découpée en modules métier (catalogue, panier, commande, paiement, livraison, notification).

- Chaque module suit une **architecture hexagonale** : le domaine métier ne dépend d'aucune technologie, et les systèmes externes (Stripe, transporteur, Google, mailing) sont accessibles via des ports et des adapters.
- Les modules communiquent par **événements de domaine** :
  - en **synchrone** (en mémoire) pour le cœur métier, où la cohérence est prioritaire (commande, paiement) ;
  - en **asynchrone** pour les traitements non critiques (emails, relances de paniers abandonnés).

## Alternatives considérées

- **Monolithe en couches classique** : plus simple au départ, mais les dépendances entre fonctionnalités s'accumulent et rendent l'évolution plus coûteuse. Écarté.
- **Microservices** : le volume prévu (200 commandes par jour) et la taille de l'équipe ne justifient pas la complexité d'exploitation (déploiements multiples, supervision, cohérence des données entre services). Écarté.

## Conséquences

**Positives**
- Un seul déploiement et une seule base de données, ce qui convient au trafic prévu et limite le coût d'infrastructure.
- Des modules indépendants qui facilitent le travail à plusieurs et les évolutions.
- Des frontières déjà propres, qui permettent d'extraire un module en microservice si le besoin apparaît.
- Des systèmes externes remplaçables sans toucher au métier.

**Négatives et points de vigilance**
- Le déploiement est global : une mise en production concerne tous les modules, et il faut la planifier pour respecter les 2 h d'indisponibilité maximum par semaine.
- La montée en charge se fait sur l'application entière, pas module par module.
- Les frontières entre modules peuvent s'éroder si elles ne sont pas contrôlées (règles d'architecture automatisées).
- Les événements asynchrones peuvent échouer après l'enregistrement d'une commande : il faudra une stratégie de reprise.
- Le flux des événements est moins lisible qu'un appel direct : il faut les nommer clairement et documenter qui écoute quoi.