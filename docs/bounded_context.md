# Bounded Context

## Catalogue
    - Liste des produits
    - Donne la description d'un produit
    - Affiche la disponbilité d'un produit
    - Permet d'appliquer des filtres aux produits

    Pas de dépendance directe, donne des informations au Panier. 

## Panier
    - Ajouter, supprimer, modifier la quantité d'un produit
    - Mettre de coté un produit
    - Calculer le montant du panier 

    Dépendance au Catalogue pour les produits (disponibilité)

## Commande
    - Créer une commande
    - Modifier une commande
    - Annuler une commande
    - Suivi une commande

    Dépendance à Panier, Paiement et Livraison, met à jour le stock dans le Catalogue 

## Paiement
    - Gérer un paiement (confirmation, refus, remboursement)
    - Annuler un paiement

    Dépendance de Commande, prestataire externe de paiement (Stripe...)

## Livraison
    - Choisir son mode de livraison
    - Rentrer son adresse de livraison
    - Rentrer son adresse de facturation
    - Choisir si on veut tout recevoir ou au fur et à mesure 
    - Paquet cadeau ? 

    Dépendance Commande et service de transporteur externe 

## Notification
    - Envoyer une confirmation de commande, de livraison, de retard
    - Envoyer une notification de remise en stock d'un produit
    - Envoyer une notification d'indisponibilité (dernier exemplaire)
    
    Dépendance Catalogue, Commande, Paiement, Panier, prestataire externe fournisseur email 
