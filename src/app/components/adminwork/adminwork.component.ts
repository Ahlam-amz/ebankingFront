// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './adminwork.component.html',
  styleUrls: ['./adminwork.component.scss']
})
export class AdminWorkComponent {
  // Informations de la banque
  bankInfo = {
    name: 'E-Banking 2.0',
    address: '123 Avenue Mohammed V, Casablanca',
    phone: '+212 522 123 456',
    email: 'contact@ebanking-pro.ma',
    swiftCode: 'EBPAMAMC'
  };

  // Sections du dashboard
  adminSections = [
    {
      title: 'Gestion des Devises',
      icon: 'attach_money',
      links: [
        { path: '/currencies', label: 'Liste des Devises' },
        { path: '/currencies/create', label: 'Créer une Devise' },
        { path: '/exchange-rates', label: 'Taux de Change' }
      ]
    },
    {
      title: 'Gestion des Agences',
      icon: 'business',
      links: [
        { path: '/agencies', label: 'Liste des Agences' },
        { path: '/agencies/create', label: 'Créer une Agence' }
      ]
    },
    {
      title: 'Gestion des Utilisateurs',
      icon: 'people',
      links: [
        { path: '/users', label: 'Liste des Utilisateurs' },
        { path: '/users/create', label: 'Créer un Utilisateur' }
      ]
    },
    {
      title: 'Gestion des Rôles',
      icon: 'admin_panel_settings',
      links: [
        { path: '/roles', label: 'Liste des Rôles' },
        { path: '/roles/create', label: 'Créer un Rôle' }
      ]
    },
    {
      title: 'Journal d\'Audit',
      icon: 'list_alt',
      links: [
        { path: '/audit-logs', label: 'Historique des Actions' }
      ]
    }
  ];
}