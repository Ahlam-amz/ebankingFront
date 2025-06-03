import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  showOnlyActive = false;
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
  this.filteredUsers = this.users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      // Ajoutez une vérification pour s'assurer que role et role.name existent
      (user.role?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false);
          
    return matchesSearch && (!this.showOnlyActive || user.active);
  });
}


  toggleUserStatus(id: number | undefined, event: Event): void {
    if (id === undefined) return;
    
    event.stopPropagation();
    this.userService.toggleUserStatus(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification du statut';
        console.error(err);
      }
    });
  }

  deleteUser(id: number | undefined, event: Event): void {
    if (id === undefined) return;
    
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
          console.error(err);
        }
      });
    }
  }
}
