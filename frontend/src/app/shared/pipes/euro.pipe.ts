import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** Formate un montant en centimes : 4990 -> « 49,90 € ». */
@Pipe({ name: 'euro' })
export class EuroPipe implements PipeTransform {
  transform(cents: number | null | undefined): string {
    return formatter.format((cents ?? 0) / 100);
  }
}
