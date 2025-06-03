import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/api/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMessage: string | null = null;
  isLoading = false;

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { username, password } = this.loginForm.value;

    // Vérification pour l'admin
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('currentUser', JSON.stringify({ 
        username: 'admin', 
        role: 'admin' 
      }));
      this.router.navigate(['/adminwork']);
      this.isLoading = false;
      return;
    }

    // Authentification normale pour les autres utilisateurs
    this.authService.login(username!, password!).subscribe({
      next: (response: any) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigate(['/workspace']);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid username or password';
        console.error('Login error:', error);
      }
    });
  }
}