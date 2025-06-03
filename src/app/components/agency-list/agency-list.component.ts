import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Agency } from '../../models/agency.model';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-agency-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.scss']
})
export class AgencyListComponent implements OnInit {
  agencies: Agency[] = [];
  filteredAgencies: Agency[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  showOnlyActive = false;

  constructor(private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies(): void {
    this.loading = true;
    this.agencyService.getAllAgencies().subscribe({
      next: (data) => {
        this.agencies = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des agences';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.filteredAgencies = this.agencies.filter(agency => {
      const matchesSearch = 
        agency.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agency.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agency.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch && (!this.showOnlyActive || agency.active);
    });
  }

  // Modifiez la méthode deleteAgency pour gérer le cas où id est undefined
toggleAgencyStatus(id: number | undefined, event: Event): void {
  if (id === undefined) return;
  
  event.stopPropagation();
  this.agencyService.toggleAgencyStatus(id).subscribe({
    next: () => {
      this.loadAgencies();
    },
    error: (err) => {
      this.error = 'Erreur lors de la modification du statut';
      console.error(err);
    }
  });
}

deleteAgency(id: number | undefined, event: Event): void {
  if (id === undefined) return;
  
  event.stopPropagation();
  if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
    this.agencyService.deleteAgency(id).subscribe({
      next: () => {
        this.loadAgencies();
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression de l\'agence';
        console.error(err);
      }
    });
  }
}

}
