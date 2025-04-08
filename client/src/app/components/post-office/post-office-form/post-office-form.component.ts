import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostOfficeService } from '../../../services/post-office.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showErrorSnack } from '../../../util/error-utils';

@Component({
  selector: 'app-post-office-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './post-office-form.component.html',
  styleUrl: './post-office-form.component.scss',
})
export class PostOfficeFormComponent implements OnInit {
  public postOfficeForm!: FormGroup;
  public isEditMode = false;
  public zipCode: string | null = null;

  constructor(
    public readonly fb: FormBuilder,
    public readonly postOfficeService: PostOfficeService,
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {
    this.postOfficeForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{5}$'), // Ensures ZIP code is 5 digits long and numeric
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.zipCode = this.route.snapshot.paramMap?.get('zipCode');

    // If no zipCode is found, exit early
    if (!this.zipCode) {
      return;
    }

    // Set edit mode to true
    this.isEditMode = true;

    this.postOfficeService
      .getPostOfficeByZipCode(this.zipCode)
      .pipe(
        map((postOffice) => {
          // Handle post office data and patch form values here
          if (postOffice) {
            this.postOfficeForm.patchValue({
              name: postOffice.name,
              address: postOffice.address,
              zipCode: postOffice.zipCode,
            });
          }
        }),
        catchError((error) => {
          showErrorSnack(
            this.snackBar,
            error,
            'Error fetching post office data'
          );
          return of(null);
        })
      )
      .subscribe();
  }

  public onSubmit(): void {
    if (this.postOfficeForm.valid) {
      if (this.isEditMode && this.zipCode) {
        this.postOfficeService
          .updatePostOffice(this.zipCode, this.postOfficeForm.value)
          .subscribe({
            next: () => this.router.navigate(['/postOffices']),
            error: (error) => {
              showErrorSnack(
                this.snackBar,
                error,
                'Failed to update post office'
              );
            },
          });
      } else {
        this.postOfficeService
          .createNewPostOffice(this.postOfficeForm.value)
          .subscribe({
            next: () => this.router.navigate(['/postOffices']),
            error: (error) => {
              showErrorSnack(
                this.snackBar,
                error,
                'Failed to create post office'
              );
            },
          });
      }
    }
  }
}
