import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <h2>Détails de l'utilisateur</h2>
      
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
      
      <div *ngIf="loading">
        <p>Chargement...</p>
      </div>
      
      <div *ngIf="!loading && user">
        <h3>{{ user.firstName }} {{ user.lastName }}</h3>
        <p>Username: {{ user.username }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Téléphone: {{ user.phone || 'Non renseigné' }}</p>
        <p>Rôle: {{ user.role?.name || 'Non assigné' }}</p>
        <p>Agence: {{ user.agency?.name || 'Non assignée' }}</p>
        <p>Statut: {{ user.active ? 'Actif' : 'Inactif' }}</p>
        
        <button (click)="toggleUserStatus(user.id)">
          {{ user.active ? 'Désactiver' : 'Activer' }}
        </button>
        <button (click)="deleteUser(user.id)">Supprimer</button>
        <a [routerLink]="['/users/edit', user.id]">Modifier</a>
        <a routerLink="/users">Retour</a>
      </div>
      
      <div *ngIf="!loading && !user">
        <p>Utilisateur non trouvé</p>
        <a routerLink="/users">Retour à la liste</a>
      </div>
    </div>
  `,
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadUser(id);
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données de l\'utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleUserStatus(id: number | undefined): void {
    if (id === undefined) return;
    
    this.userService.toggleUserStatus(id).subscribe({
      next: () => {
        this.loadUser(id);
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification du statut';
        console.error(err);
      }
    });
  }

  deleteUser(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
          console.error(err);
        }
      });
    }
  }
}
