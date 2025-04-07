import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostOfficeInfo } from '../../model';
import { PostOfficeService } from '../../../services/post-office.service';

@Component({
  selector: 'app-post-office-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './post-office-list.component.html',
  styleUrl: './post-office-list.component.scss',
})
export class PostOfficeListComponent implements OnInit {
  public filterForm!: FormGroup;
  public dataToDisplay: PostOfficeInfo[] = [];
  public postOffices: PostOfficeInfo[] = [];
  public currentPage = 1;
  public pageSize = 5;
  public numberOfPages: number[] = [];
  public totalItems = 0;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _postOfficeService: PostOfficeService
  ) {}

  public ngOnInit(): void {
    this.filterForm = this._fb.group({
      zipCode: [''],
    });

    this.getPostOffices();
    this.filterSubscription();
  }

  public getPostOffices(): void {
    this._postOfficeService.getPostOffices(this.filterForm.value?.zipCode).subscribe((response) => {
      this.dataToDisplay = response;
      this.postOffices = response;
      this.totalItems = this.dataToDisplay.length;
      this.updatePagination();
    });
  }

  public onPageChange(page: number): void {
    if (page >= 1 && page <= this.numberOfPages.length) {
      this.currentPage = page;
      this.updateDataToDisplay();
    }
  }

  public onDeletePostOffice(zipCode: string): void {
    if (confirm('Are you sure you want to delete this post office?')) {
      this._postOfficeService
        .deletePostOffice(zipCode)
        .subscribe(() => this.getPostOffices());
    }
  }

  private filterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.getPostOffices();
    });
  }

  private updatePagination(): void {
    const totalPages = Math.ceil(this.dataToDisplay.length / this.pageSize);
    this.numberOfPages = Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);

    this.updateDataToDisplay();
  }

  private updateDataToDisplay(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataToDisplay = this.postOffices.slice(startIndex, endIndex);
  }
}
