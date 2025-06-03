import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  roleForm!: FormGroup;
  isEditMode = false;
  roleId?: number;
  loading = false;
  submitted = false;
  error = '';
  allPermissions: Permission[] = [];
  selectedPermissions: Permission[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAllPermissions();
    
    this.roleId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.roleId;
    
    if (this.isEditMode && this.roleId) {
      this.loadRole(this.roleId);
    }
  }

  initForm(): void {
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  loadAllPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.allPermissions = permissions;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des permissions';
        console.error(err);
      }
    });
  }

  loadRole(id: number): void {
    this.loading = true;
    this.roleService.getRoleById(id).subscribe({
      next: (role) => {
        this.roleForm.patchValue({
          name: role.name,
          description: role.description
        });
        this.selectedPermissions = role.permissions || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du rôle';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() { return this.roleForm.controls; }

  togglePermission(permission: Permission): void {
    const index = this.selectedPermissions.findIndex(p => p.id === permission.id);
    if (index === -1) {
      this.selectedPermissions.push(permission);
    } else {
      this.selectedPermissions.splice(index, 1);
    }
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.selectedPermissions.some(p => p.id === permission.id);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.roleForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const formValues = this.roleForm.value;
    const role: Role = {
      name: formValues.name,
      description: formValues.description,
      permissions: this.selectedPermissions
    };
    
    if (this.isEditMode && this.roleId) {
      role.id = this.roleId;
      this.updateRole(role);
    } else {
      this.createRole(role);
    }
  }

  createRole(role: Role): void {
    this.roleService.createRole(role).subscribe({
      next: (createdRole) => {
        this.updateRolePermissions(createdRole.id!);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du rôle';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateRole(role: Role): void {
    this.roleService.updateRole(role).subscribe({
      next: () => {
        this.updateRolePermissions(role.id!);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du rôle';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateRolePermissions(roleId: number): void {
    // Dans un cas réel, vous devriez comparer les permissions actuelles avec les nouvelles
    // et faire seulement les appels API nécessaires pour ajouter/supprimer des permissions
    
    // Pour simplifier, on suppose que le backend gère correctement la mise à jour des permissions
    // quand on envoie le rôle complet avec ses permissions
    
    this.router.navigate(['/roles']);
  }
}
