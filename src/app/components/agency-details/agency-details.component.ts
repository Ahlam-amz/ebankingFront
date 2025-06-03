import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Agency } from '../../models/agency.model';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-agency-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agency-details.component.html',
  styleUrls: ['./agency-details.component.scss']
})
export class AgencyDetailsComponent implements OnInit {
  agency: Agency | null = null;
  loading = true;
  error = '';
  
  constructor(
    private agencyService: AgencyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAgency(+id);
    } else {
      this.error = 'ID d\'agence non spécifié';
      this.loading = false;
    }
  }

  loadAgency(id: number): void {
    this.loading = true;
    this.agencyService.getAgencyById(id).subscribe({
      next: (data) => {
        this.agency = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de l\'agence';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleAgencyStatus(): void {
    if (!this.agency) return;
    
    this.agencyService.toggleAgencyStatus(this.agency.id!).subscribe({
      next: () => {
        // Mettre à jour l'état local
        if (this.agency) {
          this.agency.active = !this.agency.active;
        }
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification du statut';
        console.error(err);
      }
    });
  }

  deleteAgency(): void {
    if (!this.agency) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      this.agencyService.deleteAgency(this.agency.id!).subscribe({
        next: () => {
          this.router.navigate(['/agencies']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de l\'agence';
          console.error(err);
        }
      });
    }
  }
}
