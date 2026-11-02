import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccordionItem } from '../../ui/accordion-item/accordion-item';
import { PageShell } from '../../ui/page-shell/page-shell';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, PageShell, AccordionItem],
  template: `
    <app-page-shell title="Questions fréquentes" subtitle="Commande, livraison, retours et conseils techniques.">
      <div class="faq">
        @for (q of questions; track q.title) {
          <app-accordion-item [title]="q.title">{{ q.answer }}</app-accordion-item>
        }
      </div>
      <p class="faq__more">Une autre question ? <a routerLink="/contact">Contactez-nous</a>.</p>
    </app-page-shell>
  `,
  styles: `
    .faq { padding: 0 var(--space-6); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); }
    app-accordion-item:last-child { border-bottom: 0; }
    .faq__more { margin-top: var(--space-6); color: var(--color-text-muted); }
    .faq__more a { color: var(--color-primary); text-decoration: underline; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faq {
  protected readonly questions = [
    { title: 'Sous quel délai ma commande est-elle expédiée ?', answer: 'Les commandes passées avant 15h partent sous 24h ouvrées. Vous recevez un e-mail à chaque étape.' },
    { title: 'Comment suivre ma commande ?', answer: "Depuis votre compte, l'onglet Commandes affiche le statut : payée, préparée, expédiée, livrée." },
    { title: 'Puis-je retourner un produit ?', answer: "Oui, vous disposez de 14 jours après réception. Le produit doit être complet et non endommagé." },
    { title: 'Comment savoir si un composant est compatible avec ma carte ?', answer: 'Chaque fiche produit indique la tension, le protocole et les cartes compatibles. En cas de doute, écrivez-nous.' },
    { title: 'Les kits robotiques sont-ils adaptés aux débutants ?', answer: 'Oui. Chaque kit indique un niveau de difficulté et inclut un guide de montage pas à pas.' },
    { title: 'Quels moyens de paiement acceptez-vous ?', answer: 'Les cartes bancaires, via un paiement en ligne sécurisé.' },
  ];
}
