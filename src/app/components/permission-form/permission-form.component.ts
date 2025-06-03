import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {
  permissionForm!: FormGroup;
  isEditMode = false;
  permissionId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.permissionId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.permissionId;
    
    if (this.isEditMode && this.permissionId) {
      this.loadPermission(this.permissionId);
    }
  }

  initForm(): void {
    this.permissionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  loadPermission(id: number): void {
    this.loading = true;
    this.permissionService.getPermissionById(id).subscribe({
      next: (permission) => {
        this.permissionForm.patchValue({
          name: permission.name,
          description: permission.description
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la permission';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() { return this.permissionForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.permissionForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const formValues = this.permissionForm.value;
    const permission: Permission = {
      name: formValues.name,
      description: formValues.description
    };
    
    if (this.isEditMode && this.permissionId) {
      permission.id = this.permissionId;
      this.updatePermission(permission);
    } else {
      this.createPermission(permission);
    }
  }

  createPermission(permission: Permission): void {
    this.permissionService.createPermission(permission).subscribe({
      next: () => {
        this.router.navigate(['/permissions']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création de la permission';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updatePermission(permission: Permission): void {
    this.permissionService.updatePermission(permission).subscribe({
      next: () => {
        this.router.navigate(['/permissions']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour de la permission';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
