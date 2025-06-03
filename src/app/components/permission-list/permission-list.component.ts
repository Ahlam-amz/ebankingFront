import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';
import { FormatCommaDatePipe } from '../../pipes/format-comma-date.pipe';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FormatCommaDatePipe],
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  permissions: Permission[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  
  // Propriété pour tester le pipe
  testDate = "2025,5,17,19,36,14,157542000";

  constructor(
    private permissionService: PermissionService,
    private formatDatePipe: FormatCommaDatePipe
  ) { }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading = true;
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des permissions';
        this.loading = false;
      }
    });
  }

  deletePermission(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette permission ?')) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => {
          this.permissions = this.permissions.filter(p => p.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la permission';
        }
      });
    }
  }

  get filteredPermissions(): Permission[] {
    return this.permissions.filter(permission => 
      permission.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      permission.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  // Méthode pour formater manuellement les dates
  formatDate(dateValue: any): string {
    if (!dateValue) return '';
    
    if (typeof dateValue === 'string' && dateValue.includes(',')) {
      try {
        const parts = dateValue.split(',').map(Number);
        const date = new Date(
          parts[0], parts[1] - 1, parts[2], 
          parts[3] || 0, parts[4] || 0, parts[5] || 0
        );
        
        if (isNaN(date.getTime())) return String(dateValue);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      } catch (error) {
        return String(dateValue);
      }
    }
    
    return String(dateValue);
  }
}
