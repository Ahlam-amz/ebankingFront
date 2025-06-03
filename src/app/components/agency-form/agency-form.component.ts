import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agency } from '../../models/agency.model';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-agency-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './agency-form.component.html',
  styleUrls: ['./agency-form.component.scss']
})
export class AgencyFormComponent implements OnInit {
  agencyForm: FormGroup;
  isEditMode = false;
  agencyId: number | null = null;
  loading = false;
  submitted = false;
  error = '';
  
  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.agencyForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,15}$/)]],
      email: ['', [Validators.email]],
      openingTime: ['09:00', [Validators.required]],
      closingTime: ['17:00', [Validators.required]],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.agencyId = +id;
      this.loadAgency(this.agencyId);
    }
  }

  loadAgency(id: number): void {
    this.loading = true;
    this.agencyService.getAgencyById(id).subscribe({
      next: (agency) => {
        this.agencyForm.patchValue({
          code: agency.code,
          name: agency.name,
          address: agency.address,
          city: agency.city,
          phone: agency.phone,
          email: agency.email,
          openingTime: agency.openingTime,
          closingTime: agency.closingTime,
          active: agency.active
        });
        // Désactiver le champ code en mode édition
        this.agencyForm.get('code')?.disable();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agence';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.agencyForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Préparer l'objet agence
    const formValue = this.agencyForm.getRawValue();
    const agency: Agency = {
      code: formValue.code,
      name: formValue.name,
      address: formValue.address,
      city: formValue.city,
      phone: formValue.phone,
      email: formValue.email,
      openingTime: formValue.openingTime,
      closingTime: formValue.closingTime,
      active: formValue.active
    };
    
    if (this.isEditMode && this.agencyId) {
      agency.id = this.agencyId;
      this.agencyService.updateAgency(agency).subscribe({
        next: () => {
          this.router.navigate(['/agencies']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour de l\'agence';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.agencyService.createAgency(agency).subscribe({
        next: () => {
          this.router.navigate(['/agencies']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la création de l\'agence';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() { return this.agencyForm.controls; }
}
