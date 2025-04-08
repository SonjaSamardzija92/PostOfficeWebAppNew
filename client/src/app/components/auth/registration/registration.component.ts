import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { showErrorSnack } from '../../../util/error-utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  public registerForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.registerForm = this.initializeRegistrationForm();
  }

  public onRegister(): void {
    if (this.registerForm.valid) {
      const credentials = this.registerForm.value;
      this.authService.registration(credentials).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          showErrorSnack(this.snackBar, err, 'Registration failed');
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private initializeRegistrationForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required],
    });
  }
}
