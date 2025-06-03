import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
  role?: Role;
  permissions: Permission[] = [];
  loading = true;
  error = '';

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadRole(id);
  }

  loadRole(id: number): void {
    this.loading = true;
    this.roleService.getRoleById(id).subscribe({
      next: (data) => {
        this.role = data;
        this.permissions = data.permissions || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données du rôle';
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
          this.router.navigate(['/roles']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du rôle';
          console.error(err);
        }
      });
    }
  }
}