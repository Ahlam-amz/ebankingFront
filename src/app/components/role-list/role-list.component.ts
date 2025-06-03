import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rôles';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteRole(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du rôle';
          console.error(err);
        }
      });
    }
  }

  get filteredRoles(): Role[] {
    return this.roles.filter(role => 
      role.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
