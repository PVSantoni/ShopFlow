export interface LegalDoc {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string[] }[];
}

const TODO = '[À compléter]';

export const MENTIONS_LEGALES: LegalDoc = {
  title: 'Mentions légales',
  subtitle: 'Informations légales relatives au site FlowShop.',
  sections: [
    {
      heading: 'Éditeur du site',
      body: [
        `Raison sociale : ${TODO}`,
        `Forme juridique et capital : ${TODO}`,
        `Siège social : ${TODO}`,
        `SIREN / RCS : ${TODO} - TVA intracommunautaire : ${TODO}`,
        `Directeur de la publication : ${TODO}`,
        `Contact : ${TODO}`,
      ],
    },
    {
      heading: 'Hébergement',
      body: [`Hébergeur : ${TODO} (nom, adresse et téléphone).`],
    },
    {
      heading: 'Propriété intellectuelle',
      body: [
        "L'ensemble des contenus du site (textes, images, logos, fiches produit) est protégé par le droit d'auteur. Toute reproduction sans autorisation écrite est interdite.",
      ],
    },
    {
      heading: 'Responsabilité',
      body: [
        "Les caractéristiques techniques des produits sont données à titre indicatif. Consultez la fiche constructeur avant tout montage, en particulier pour les tensions d'alimentation.",
      ],
    },
  ],
};

export const CGV: LegalDoc = {
  title: 'Conditions générales de vente',
  subtitle: 'Applicables à toute commande passée sur FlowShop.',
  sections: [
    {
      heading: '1. Commande',
      body: [
        "La commande est validée après confirmation du panier et paiement. Un e-mail de confirmation est envoyé au client.",
      ],
    },
    {
      heading: '2. Prix',
      body: ["Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison."],
    },
    {
      heading: '3. Paiement',
      body: [
        "Le paiement s'effectue en ligne par carte bancaire via un prestataire sécurisé. Les données de carte ne transitent pas par nos serveurs.",
      ],
    },
    {
      heading: '4. Livraison',
      body: [
        `Les commandes passées avant 15h sont expédiées sous 24h ouvrées. Délais et transporteurs : ${TODO}`,
      ],
    },
    {
      heading: '5. Droit de rétractation et retours',
      body: [
        "Le client dispose de 14 jours à compter de la réception pour se rétracter, conformément au Code de la consommation. Les produits doivent être renvoyés complets et non endommagés.",
        `Délai commercial de retour : ${TODO}`,
      ],
    },
    {
      heading: '6. Garanties',
      body: [
        "Les produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés.",
      ],
    },
  ],
};

export const CONFIDENTIALITE: LegalDoc = {
  title: 'Politique de confidentialité',
  subtitle: 'Comment nous traitons vos données personnelles.',
  sections: [
    {
      heading: 'Données collectées',
      body: [
        "Identité, coordonnées, adresse de livraison, historique de commandes. Les données de paiement sont traitées par notre prestataire de paiement.",
      ],
    },
    {
      heading: 'Finalités',
      body: [
        "Gestion des commandes et des livraisons, notifications liées à la commande, support client, obligations légales.",
      ],
    },
    {
      heading: 'Durée de conservation',
      body: [`Les données sont conservées pendant la durée nécessaire aux finalités ci-dessus : ${TODO}`],
    },
    {
      heading: 'Vos droits (RGPD)',
      body: [
        `Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité. Pour l'exercer : ${TODO}`,
      ],
    },
  ],
};
