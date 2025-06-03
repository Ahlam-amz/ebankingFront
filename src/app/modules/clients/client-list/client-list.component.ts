/*import { Component, inject } from '@angular/core';
import { ClientService } from '../../../core/api/client.service';
import { Client } from '../../../shared/models/client.model';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-client-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
   animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ClientListComponent {
  private clientService = inject(ClientService);
  private router = inject(Router);

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe((data) => {
      this.clients = data;
      this.filteredClients = data;
    });
  }

  filterClients(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.cin.toLowerCase().includes(term)
    );
  }

    goToClientDetails(clientId: number | undefined): void {
    if (clientId === undefined || clientId === null) {
      console.error('Client ID is undefined or null');
      return; // early exit to avoid errors
    }
    if (typeof clientId !== 'number' || isNaN(clientId)) {
      console.error('Client ID is not a valid number:', clientId);
      return;
    }
    this.router.navigate(['/clients', clientId]);
  }








  getRandomColor(): string {
    const colors = [
      '#3f51b5', '#673ab7', '#9c27b0', '#e91e63', 
      '#f44336', '#ff5722', '#ff9800', '#4caf50',
      '#009688', '#00bcd4', '#2196f3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
*/


import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/api/client.service';
import { Client } from '../../../shared/models/client.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-client-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load clients. Please try again later.';
        this.isLoading = false;
        console.error('Error loading clients:', err);
      }
    });
  }

  filterClients(): void {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      (client.cin && client.cin.toLowerCase().includes(term)) ||
      (client.nom && client.nom.toLowerCase().includes(term)) ||
      (client.prenom && client.prenom.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.profession && client.profession.toLowerCase().includes(term))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterClients();
  }

  viewClientDetails(clientId: number | undefined): void {
    if (clientId) {
      this.router.navigate(['/clients', clientId]);
    }
  }

  getInitials(nom: string | undefined, prenom: string | undefined): string {
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  }

  getRandomColor(): string {
    const colors = [
      '#3f51b5', '#673ab7', '#9c27b0', '#e91e63', 
      '#f44336', '#ff5722', '#ff9800', '#4caf50',
      '#009688', '#00bcd4', '#2196f3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}