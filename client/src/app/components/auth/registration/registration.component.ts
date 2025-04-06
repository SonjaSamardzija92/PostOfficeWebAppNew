import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  public registerForm: FormGroup;

  constructor(public fb: FormBuilder, public authService: AuthService,
    private readonly router: Router,
  ) {
    this.registerForm = this.initializeRegistrationForm();
  }

  public onRegister(): void {
    if (this.registerForm.valid) {
      const credentials = this.registerForm.value;
      this.authService.registration(credentials).subscribe(() => this.router.navigate(['/login']));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private initializeRegistrationForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
}
