import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { CGV, CONFIDENTIALITE, MENTIONS_LEGALES } from './pages/legal/legal.data';

const legal = () => import('./pages/legal/legal').then((m) => m.Legal);

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', title: 'FlowShop', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      { path: 'catalogue', title: 'Catalogue - FlowShop', loadComponent: () => import('./pages/catalogue/catalogue').then((m) => m.Catalogue) },
      { path: 'produit/:slug', title: 'Produit - FlowShop', loadComponent: () => import('./pages/product/product-detail').then((m) => m.ProductDetail) },
      { path: 'commande/confirmation', title: 'Commande confirmée - FlowShop', loadComponent: () => import('./pages/order-confirmation/order-confirmation').then((m) => m.OrderConfirmation) },
      { path: 'panier', title: 'Panier - FlowShop', loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart) },
      { path: 'faq', title: 'FAQ - FlowShop', loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq) },
      { path: 'contact', title: 'Contact - FlowShop', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
      { path: 'mentions-legales', title: 'Mentions légales - FlowShop', data: { doc: MENTIONS_LEGALES }, loadComponent: legal },
      { path: 'cgv', title: 'CGV - FlowShop', data: { doc: CGV }, loadComponent: legal },
      { path: 'confidentialite', title: 'Confidentialité - FlowShop', data: { doc: CONFIDENTIALITE }, loadComponent: legal },
      { path: '**', title: 'Page introuvable - FlowShop', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
    ],
  },
];
