import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})

export class LoginPageComponent {
  public loginForm: FormGroup;

  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router) {
    this.loginForm = this.initializeLoginForm();
  }

  public onLogin(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(() => this.router.navigate(['/home']));
      this.authService.login(credentials).subscribe({
        next: res => {
          console.log('Login success:', res);
          // handle token, redirect, etc.
        },
        error: err => {
          console.error('Login failed:', err);
          // display error message to user
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private initializeLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
}
