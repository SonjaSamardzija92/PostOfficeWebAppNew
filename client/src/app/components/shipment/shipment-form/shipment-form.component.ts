import { Component, OnInit } from '@angular/core';
import {
  PostOfficeInfo,
  shipmentStatusOptions,
  shipmentTypeOptions,
  weightCategoryOptions,
} from '../../model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostOfficeService } from '../../../services/post-office.service';
import { ShipmentService } from 'src/app/services/shipments.service';
import { CommonModule } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-shipment-form',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './shipment-form.component.html',
  styleUrl: './shipment-form.component.scss',
})
export class ShipmentFormComponent implements OnInit {
  public shipmentForm: FormGroup;
  public isEditMode = false;
  public shipmentNumber: string | null = null;

  public weightCategories = weightCategoryOptions;
  public shipmentStatus = shipmentStatusOptions;
  public shipmentTpe = shipmentTypeOptions;
  public postOffices: PostOfficeInfo[] = [];

  constructor(
    private readonly _shipmentService: ShipmentService,
    private readonly _postOfficeService: PostOfficeService,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _activeRoute: ActivatedRoute
  ) {
    this.shipmentForm = this.initializeShipmentForm();
  }

  public ngOnInit(): void {
    this.getPostOffices();

    this.isEditMode = true;
    this.shipmentNumber = this._activeRoute.snapshot.paramMap?.get('shipmentNumber');

    // If no shipmentNumber is found, exit early
    if (!this.shipmentNumber) {
      return;
    }

    this._shipmentService.getShipmentByID(this.shipmentNumber).pipe(
      map(shipment => {
        if (shipment) {
          this.shipmentForm.patchValue({
            type: shipment.type,
            shipmentNumber: shipment.shipmentNumber,
            actualWeight: shipment.actualWeight,
            originZipCode: shipment.originZipCode,
            destinationZipCode: shipment.destinationZipCode,
            status: shipment.status,
          });
        }
      }),
      catchError(error => {
        console.error('Error fetching post office data:', error);
        return of(null); // or handle the error in some way
      })
    ).subscribe();
  }

  public onSubmit(): void {
    if (this.shipmentForm.valid) {
      if (this.isEditMode && this.shipmentNumber) {
        this._shipmentService
          .updateShipment(this.shipmentNumber, this.shipmentForm.value)
          .subscribe(() => this._router.navigate(['/shipments']));
      } else {
        this._shipmentService
          .createShipment(this.shipmentForm.value)
          .subscribe(() => this._router.navigate(['/shipments']));
      }
    }
  }

  private initializeShipmentForm(): FormGroup {
    return this._fb.group({
      shipmentNumber: ['', Validators.required],
      type: ['', Validators.required],
      status: [''],
      actualWeight: ['', Validators.required],
      originZipCode: ['', Validators.required],
      destinationZipCode: ['', Validators.required],
    });
  }

  private getPostOffices(): void {
    this._postOfficeService
      .getPostOffices()
      .subscribe((offices: PostOfficeInfo[]) => (this.postOffices = offices));
  }
}
