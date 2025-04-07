import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostOfficeService } from 'src/app/services/post-office.service';
import { ShipmentService } from 'src/app/services/shipments.service';
import { PostOfficeInfo, Shipment, ShipmentStatus, ShipmentType, WeightCategory } from '../../model';

@Component({
  selector: 'app-shipment-list',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './shipment-list.component.html',
  styleUrl: './shipment-list.component.scss'
})
export class ShipmentListComponent {
  public filterForm!: FormGroup;
  public dataToDisplay: Shipment[] = [];
  public shipments: Shipment[] = [];
  public postOffices: PostOfficeInfo[] = [];
  public currentPage: number = 1;
  public totalItems: number = 0;
  public pageSize: number = 3;
  public numberOfPages: number[] = [];

  public readonly shipmentStatuses = Object.values(ShipmentStatus);
  public readonly shipmentTypes = Object.values(ShipmentType);
  public readonly weightCategories = Object.values(WeightCategory);

  constructor(
    private readonly _shipmentService: ShipmentService,
    private readonly _postOfficeService: PostOfficeService,
    private readonly _fb: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    this.filterForm = this.initializeFilterForm();
    this.getShipments();
    this.filterSubscription();
    this.getPostOffices();
  }

  private getShipments(): void {
    const filters = {
      ...this.filterForm.value
    };

    this._shipmentService.getShipments(filters).subscribe((response) => {
      this.dataToDisplay = response;
      this.shipments = response;
      this.totalItems = this.dataToDisplay.length;
      this.updatePagination();
    });
  }

  public getPostOffices(): void {
    this._postOfficeService.getPostOffices().subscribe((response) => {
      this.postOffices = response;
    });
  }

  public onDeleteShipment(id: string): void {
    if (confirm('Are you sure you want to delete this shipment?')) {
      this._shipmentService
        .deleteShipment(id)
        .subscribe(() => this.getShipments());
    }
  }

  public onPageChange(page: number): void {
    if (page >= 1 && page <= this.numberOfPages.length) {
      this.currentPage = page;
      this.updateDataToDisplay();
    }
  }

  public resetFilters(): void {
    this.filterForm.reset();
  }

  private updatePagination(): void {
    const totalPages = Math.ceil(this.dataToDisplay.length / this.pageSize);
    this.numberOfPages = Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);

    this.updateDataToDisplay();
  }

  private initializeFilterForm(): FormGroup {
    return this._fb.group({
      status: [''],
      type: [''],
      weightCategory: [''],
      originZipCode: [''],
      destinationZipCode: [''],
      shipmentNumber: [''],
    });
  }

  private updateDataToDisplay(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataToDisplay = this.shipments.slice(startIndex, endIndex);
  }

  private filterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.getShipments();
    });
  }
}
