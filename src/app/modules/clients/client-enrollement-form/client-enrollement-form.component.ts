// modules/clients/components/client-enrollment-form/client-enrollment-form.component.ts
/*import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../core/api/client.service';
import { EnrollementService } from '../../../core/api/enrollement.service';
import { Client} from '../../../shared/models/client.model';
import { Enrollement} from '../../../shared/models/enrollement.model';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// At the top of your component file
import { FormArray, FormGroup } from '@angular/forms';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule,
    NgIf,
     MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
     MatIconModule
  ],
  selector: 'app-client-enrollement-form',
  templateUrl: './client-enrollement-form.component.html',
  styleUrls: ['./client-enrollement-form.component.scss']
})
export class ClientEnrollmentForm {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private enrollementService = inject(EnrollementService);
 
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);




  enrollmentForm = this.fb.group({
    client: this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      gender:[''],
      dateNaissance: [null as Date | null, Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      profession: [''],
      cin: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{8}$/)]]
    }),
    documents: this.fb.array([
      this.fb.group({
        nom: ['CNI', Validators.required],
        type: ['IDENTITY', Validators.required],
        file: [null as File | null, Validators.required]
      })
    ])
  });
  // Add this method to your component class (around line 50-60):
getDocumentControls() {
  return (this.enrollmentForm.get('documents') as FormArray).controls;
}


 onSubmit() {
  if (this.enrollmentForm.valid) {
    const formValue = this.enrollmentForm.value;

    const newClient: Client = {
      ...(formValue.client as Client),
      codeClient: this.generateClientCode(),
      dateEnregistrement: this.formatDateTime(new Date()),
      statut: 'ACTIF'
    };

    this.clientService.createClient(newClient).subscribe({
      next: (createdClient) => {
        
        const newEnrollement: Enrollement = {
          clientId: createdClient.id!, // use only the client ID
          agentId: 1, // replace with real auth-based ID later
          reference: `ENR-${Date.now()}`,
          dateEnrollement: new Date(),
          statut: 'EN_ATTENTE',
          documents: formValue.documents?.map(doc => `/uploads/${doc!.file!.name}`) || [],
        };

        this.enrollementService.createEnrollement(newEnrollement).subscribe({
          next: () => {
            this.snackBar.open('Client enrolled successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/clients/all']);
          },
          error: (err) => this.handleError(err)
        });
      },
      error: (err) => this.handleError(err)
    });
  }
}


  private generateClientCode(): string {
    return `CLI-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  private handleError(error: any) {
    this.snackBar.open(
      error.error?.message || 'An error occurred during enrollment',
      'Close',
      { duration: 5000 }
    );
  }
  

  onFileChange(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    const documents = this.enrollmentForm.get('documents') as FormArray;
    documents.at(index).patchValue({
      file: file
    });
    documents.at(index).updateValueAndValidity();
  }
}

// Add this method to your component
getDocumentFormGroup(index: number): FormGroup {
  return this.getDocumentControls().at(index) as FormGroup;
}

private formatDateTime(date: Date): string {
  return date.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
}

}*/






import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../core/api/client.service';
import { AccountService } from '../../../core/api/account.service';
import { EnrollementService } from '../../../core/api/enrollement.service';
import { Client } from '../../../shared/models/client.model';
import { Account } from '../../../shared/models/account.model';
import { Enrollement } from '../../../shared/models/enrollement.model';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-client-enrollement',
  imports: [
        CommonModule,
        ReactiveFormsModule,
        NgIf
   ],
  templateUrl: './client-enrollement-form.component.html',
  styleUrls: ['./client-enrollement-form.component.scss']
})
export class ClientEnrollementForm implements OnInit {
  clientForm: FormGroup;
  isLoading = false;
  showSuccessModal = false;
  createdClient: Client | null = null;
  createdAccount: Account | null = null;
  createdEnrollment: Enrollement | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private accountService: AccountService,
    private enrollmentService: EnrollementService
  ) {
    this.clientForm = this.fb.group({
      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cin: ['', Validators.required],
      birthDate: [''],
      address: [''],
      profession: [''],
      
      // Account Information
      accountType: ['', Validators.required],
      currency: ['', Validators.required],
      
      // Enrollment Information
      agentId: ['', Validators.required],
      idDocument: [false],
      proofOfAddress: [false],
      incomeProof: [false]
    });
  }

  ngOnInit(): void {}


    onSubmit(): void {
  if (this.clientForm.invalid) return;

  this.isLoading = true;
  
  // Prepare documents list
  const documents: string[] = [];
  if (this.clientForm.value.idDocument) documents.push('ID_DOCUMENT');
  if (this.clientForm.value.proofOfAddress) documents.push('PROOF_OF_ADDRESS');
  if (this.clientForm.value.incomeProof) documents.push('INCOME_PROOF');

  // Create client
  const clientData = {
    prenom: this.clientForm.value.firstName,
    nom: this.clientForm.value.lastName,
    gender :this.clientForm.value.gender,
    email: this.clientForm.value.email,
    telephone: this.clientForm.value.phone,
    cin: this.clientForm.value.cin,
    profession: this.clientForm.value.profession,
    //gender: this.clientForm.value.gender || 'UNSPECIFIED', // Ensure gender is set
    dateNaissance: this.clientForm.value.birthDate,
    adresse: this.clientForm.value.address
  };

  // Debugging: Log the client data
  console.log('Creating client:', clientData);

  this.clientService.createClient(clientData as Client).pipe(
    switchMap(client => {
      this.createdClient = client;
      console.log('Client created:', client);
      
      // Create account
      const accountData = {
        accountNumber: this.generateAccountNumber(),
        accountType: this.clientForm.value.accountType,
        currencyCode: this.clientForm.value.currency,
        client:{id :client.id } ,
        balance: 0
      };
      console.log('Creating account:', accountData);
      
      return this.accountService.createAccount(accountData as Account).pipe(
        switchMap(account => {
          this.createdAccount = account;
          console.log('Account created:', account);
          
          // Create enrollment
          const enrollmentData = {
            client: { id: client.id },
            agent: { id: this.clientForm.value.agentId },
            documents: documents,
            statut: 'EN_ATTENTE'
          };
          console.log('Creating enrollment:', enrollmentData);
          
          return this.enrollmentService.createEnrollement(enrollmentData as Enrollement);
        })
      );
    })
  ).subscribe({
    next: (enrollment) => {
      this.createdEnrollment = enrollment;
      console.log('Enrollment created:', enrollment);
      this.isLoading = false;
      this.showSuccessModal = true;
      this.clientForm.reset();
    },
    error: (err) => {
      console.error('Error in enrollment process:', err);
      this.isLoading = false;
      // Show error message to user
      alert('Error during enrollment: ' + err.message);
    },
    complete: () => {
      console.log('Process completed');
    }
  });
}

  closeModal(): void {
    this.showSuccessModal = false;
    this.createdClient = null;
    this.createdAccount = null;
    this.createdEnrollment = null;
  }

  // Helper to generate a random account number (you might want to move this to a service)
  private generateAccountNumber(): string {
    return 'AC' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  
}