import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'formatCommaDate',
  standalone: true
})
export class FormatCommaDatePipe implements PipeTransform {
  transform(value: any): string {
    // Si la valeur est vide, retourner une chaîne vide
    if (!value) {
      return '';
    }
    
    // Si c'est une chaîne qui contient des virgules (format spécifique)
    if (typeof value === 'string' && value.includes(',')) {
      try {
        // Diviser la chaîne en parties numériques
        const parts = value.split(',').map(Number);
        
        // Créer une date (mois est 0-indexé en JavaScript, donc -1)
        const date = new Date(
          parts[0],         // année
          parts[1] - 1,     // mois (0-11)
          parts[2],         // jour
          parts[3] || 0,    // heure
          parts[4] || 0,    // minute
          parts[5] || 0     // seconde
        );
        
        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
          return String(value);
        }
        
        // Formater la date en format lisible: JJ/MM/AAAA HH:MM
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        const formatted = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formatted;
      } catch (error) {
        return String(value);
      }
    }
    
    // Pour tout autre format, retourner la valeur telle quelle
    return String(value);
  }
}
