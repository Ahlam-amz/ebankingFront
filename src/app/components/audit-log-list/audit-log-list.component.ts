import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../../models/audit-log.model';
import { AuditService } from '../../services/audit.service';

// Ajouter ces imports
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.scss']
})

export class AuditLogListComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  loading = true;
  error = '';
  
  // Filtres
  filterAction = '';
  filterEntityType = '';
  filterEntityId = '';
  filterPerformedBy = '';
  
  constructor(private auditService: AuditService) { }

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.auditService.getAllAuditLogs().subscribe({
      next: (data) => {
        this.auditLogs = data;
        this.filteredLogs = [...this.auditLogs];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des logs d\'audit';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.filteredLogs = this.auditLogs.filter(log => {
      return (
        (this.filterAction ? log.action.toLowerCase().includes(this.filterAction.toLowerCase()) : true) &&
        (this.filterEntityType ? log.entityType.toLowerCase().includes(this.filterEntityType.toLowerCase()) : true) &&
        (this.filterEntityId ? log.entityId.toLowerCase().includes(this.filterEntityId.toLowerCase()) : true) &&
        (this.filterPerformedBy ? log.performedBy.toLowerCase().includes(this.filterPerformedBy.toLowerCase()) : true)
      );
    });
  }

  resetFilters(): void {
    this.filterAction = '';
    this.filterEntityType = '';
    this.filterEntityId = '';
    this.filterPerformedBy = '';
    this.filteredLogs = [...this.auditLogs];
  }

  getActionClass(action: string): string {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'action-create';
      case 'UPDATE':
        return 'action-update';
      case 'DELETE':
        return 'action-delete';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
