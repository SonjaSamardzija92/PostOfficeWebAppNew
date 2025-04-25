import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { showErrorSnack } from '../../../util/error-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransformService } from '../../../services/transform.service';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
@Component({
  selector: 'child-table',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, MatTableModule],
  standalone: true,
  templateUrl: './child-table.component.html',
  styleUrl: './child-table.component.scss'
})
export class ChildTable implements OnInit {
  @Input() transformedData$: Observable<any[]> | null = null;
  displayedColumns: string[] = ['month', 'col1', 'col2', 'col3'];
  public dataSource: any[] = [];

  public monthMap: Record<string, string> = {
    jan: 'Januar',
    feb: 'Februar',
    mar: 'March',
  };



  constructor(
    private readonly _parent: ParentService,
    private readonly snackBar: MatSnackBar,
    private readonly _transform: TransformService
  ) { }


  ngOnInit(): void {
    if (this.transformedData$) {
      this.transformedData$.subscribe(raw => {
        this.dataSource = this.transformData(raw);
      });
    }

  }

  transformData(data: any): any[] {
    const keys = Object.keys(data);
    console.log(data);
    return keys.map(key => ({
      month: this.monthMap[key] ?? key,
      ...this.createColumns(data[key])
    }));
  }

  createColumns(values: any[]): any {
    return values.reduce((acc, value, index) => {
      acc[`col${index + 1}`] = value;
      return acc;
    }, {});
  }
}
