import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { Agency } from '../../models/agency.model';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { AgencyService } from '../../services/agency.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId?: number;
  loading = false;
  submitted = false;
  error = '';
  roles: Role[] = [];
  agencies: Agency[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private agencyService: AgencyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.loadAgencies();
    
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.userId;
    
    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      roleId: ['', [Validators.required]],
      agencyId: [''],
      active: [true]
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          roleId: user.role?.id,
          agencyId: user.agency?.id || '',
          active: user.active
        });
        // Remove password validator in edit mode
        this.userForm.get('password')?.setValidators([]);
        this.userForm.get('password')?.updateValueAndValidity();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données de l\'utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rôles';
        console.error(err);
      }
    });
  }

  loadAgencies(): void {
    this.agencyService.getAllAgencies().subscribe({
      next: (agencies) => {
        this.agencies = agencies;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des agences';
        console.error(err);
      }
    });
  }

  get f() { return this.userForm.controls; }

  // Modifiez la méthode onSubmit() comme suit :

onSubmit(): void {
  this.submitted = true;
    
  if (this.userForm.invalid) {
    return;
  }
    
  this.loading = true;
    
  const formValues = this.userForm.value;
  const user: User = {
    username: formValues.username,
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    email: formValues.email,
    phone: formValues.phone,
    role: { id: formValues.roleId },
    active: formValues.active
  };
    
  // Modification ici pour gérer correctement l'agence
  if (formValues.agencyId) {
    // Trouver l'agence complète dans la liste des agences
    const selectedAgency = this.agencies.find(a => a.id === formValues.agencyId);
    if (selectedAgency) {
      user.agency = selectedAgency;
    } else {
      // Si l'agence n'est pas trouvée dans la liste, créer un objet avec les propriétés minimales requises
      user.agency = {
        id: formValues.agencyId,
        code: '',
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        active: true,
        openingTime: '08:00',  // Ajoutez une valeur par défaut pour openingTime
        closingTime: '17:00'
      };
    }
  }
    
  if (formValues.password) {
    user.password = formValues.password;
  }
    
  if (this.isEditMode && this.userId) {
    user.id = this.userId;
    this.updateUser(user);
  } else {
    this.createUser(user);
  }
}


  createUser(user: User): void {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création de l\'utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateUser(user: User): void {
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour de l\'utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
