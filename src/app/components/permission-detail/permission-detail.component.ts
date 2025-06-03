import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-permission-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.scss']
})
export class PermissionDetailComponent implements OnInit {
  permission?: Permission;
  loading = true;
  error = '';

  constructor(
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadPermission(id);
  }

  loadPermission(id: number): void {
    this.loading = true;
    this.permissionService.getPermissionById(id).subscribe({
      next: (data) => {
        this.permission = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données de la permission';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deletePermission(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette permission ?')) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => {
          this.router.navigate(['/permissions']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la permission';
          console.error(err);
        }
      });
    }
  }
}
