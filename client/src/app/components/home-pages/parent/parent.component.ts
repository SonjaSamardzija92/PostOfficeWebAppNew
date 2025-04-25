import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { showErrorSnack } from '../../../util/error-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransformService } from '../../../services/transform.service';
import { ChildTable } from '../child-table/child-table.component';
import { Observable, of } from 'rxjs';
import { ChartTable } from '../chart/chart.component';

@Component({
  selector: 'parent',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, ChildTable, ChartTable],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.scss'
})
export class Parent implements OnInit {
  public transformedData$: Observable<any[]> | null = null;

  constructor(
    private readonly _parent: ParentService,
    private readonly snackBar: MatSnackBar,
    private readonly _transform: TransformService
  ) { }

  public ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this._parent.getData().subscribe({
      next: (response) => {
        this.transformedData$ = of(response);
      },
      error: (error) => {
        showErrorSnack(this.snackBar, error, 'Failed to get shipments');
      },
    });
  }
}
