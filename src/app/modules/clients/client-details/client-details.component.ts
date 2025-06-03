import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../core/api/client.service';
import { Client } from '../../../shared/models/client.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  standalone: true,
  selector: 'app-client-details',
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule ],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})

export class ClientDetailsComponent {
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  isEditing = false;
  isSaving = false;

  editForm!: FormGroup;
  client: Client | null = null;

  constructor(private location: Location) {}

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getClientById(clientId).subscribe((data) => {
      this.client = data;
      console.log('API Response:', data);
    });
  }
  
   loadClient(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getClientById(clientId).subscribe({
      next: (data) => {
        console.log('Received client data:', data);
        this.client = data;
        this.initForm();
      },
      error: (err) => {
        this.snackBar.open('Failed to load client details', 'Close', { duration: 3000 });
        
      }
    });
  }

    initForm(): void {
    if (!this.client) return;
    
    this.editForm = this.fb.group({
      nom: [this.client.nom, Validators.required],
      prenom: [this.client.prenom, Validators.required],
      cin: [this.client.cin, [Validators.required, Validators.pattern(/^[A-Za-z0-9]{8}$/)]],
      dateNaissance: [this.client.dateNaissance, Validators.required],
      profession: [this.client.profession],
      email: [this.client.email, [Validators.required, Validators.email]],
      telephone: [this.client.telephone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      adresse: [this.client.adresse, Validators.required]
    });
  }

 /* goBack(): void {
  this.router.navigate(['/clients/all']);
}*/

getRandomColor(): string {
    const colors = [
      '#3f51b5', '#673ab7', '#9c27b0', '#e91e63', 
      '#f44336', '#ff5722', '#ff9800', '#4caf50',
      '#009688', '#00bcd4', '#2196f3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  goBack(): void {
    this.location.back();
  }

  editClient(): void {
    this.isEditing = true;
  }

   cancelEdit(): void {
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.client) return;

    this.isSaving = true;
    const updatedClient: Client = {
      ...this.client,
      ...this.editForm.value
    };

    this.clientService.updateClient(updatedClient).subscribe({
      next: (data) => {
        this.client = data;
        this.isEditing = false;
        this.isSaving = false;
        this.snackBar.open('Client updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.isSaving = false;
        this.snackBar.open('Failed to update client', 'Close', { duration: 3000 });
      }
    });
  }

}
