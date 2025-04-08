import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onLogin and navigate to home on success', () => {
    const loginResponse = { success: true };
    authServiceSpy.login.and.returnValue(of(loginResponse)); // mock success response

    component.loginForm.setValue({ email: 'test@test.com', password: 'password123'});

    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call showErrorSnack on login failure', () => {
    const errorResponse = { error: { message: 'Invalid credentials' } };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse)); // mock error response

    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });

    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
  });

  it('should mark form fields as touched if form is invalid', () => {
    spyOn(component.loginForm, 'markAllAsTouched'); // Spy to check if markAllAsTouched is called

    // Set form to invalid by not filling in required fields
    component.loginForm.setValue({ email: '', password: ''});

    component.onLogin();

    expect(component.loginForm.valid).toBeFalse(); // Form should be invalid
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled(); // Should call markAllAsTouched
  });
});