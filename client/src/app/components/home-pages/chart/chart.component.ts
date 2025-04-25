import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { showErrorSnack } from '../../../util/error-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransformService } from '../../../services/transform.service';
import { Observable } from 'rxjs';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

const ECHARTS_CONFIG = {
  loading: {
    text: 'Loading...',
    color: '#2196F3',
    fontSize: 15,
    fontWeight: 'normal',
    show: true
  }
};

@Component({
  selector: 'chart',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NgxEchartsModule],
  standalone: true,
  providers: [
    { provide: NGX_ECHARTS_CONFIG, useValue: ECHARTS_CONFIG } // Providing the default config
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartTable implements AfterViewInit, OnInit {


  @Input() transformedData$: Observable<any[]> | null = null;
  @ViewChild('chart', { static: false }) chartElement!: ElementRef;
  public data: any;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public chartOption: any;
  public barChartType: ChartType = 'bar';

  ngOnInit(): void {
    if (this.transformedData$) {
      this.transformedData$.subscribe(raw => {
        this.data = raw;
      });
    }
  }

  public getxAxisData(): any[]{
    console.log(Object.values(this.data));
    return Object.keys(this.data);
  }

  public getSeriesData(): any[]{
    const data1 = Object.values(this.data).map((a=> {
      return {
        data: a,
         type: 'line'
      }
    }));
    return data1;
  }
  ngAfterViewInit(): void {

    this.chartOption = {
      title: {
        text: 'ECharts Example'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: this.getxAxisData()
      },
      yAxis: {
        type: 'value'
      },
      series: this.getSeriesData()
    };
    // Ensure the chart DOM element exists and has proper height
    if (this.chartElement && this.chartElement.nativeElement) {
      const chartContainer = this.chartElement.nativeElement;

      // Set default height if not provided
      if (!chartContainer.style.height) {
        chartContainer.style.height = '400px';
      }

      // Initialize the chart
      const chart = echarts.init(chartContainer);
      chart.setOption(this.chartOption);

      // Resize chart when the window resizes
      window.addEventListener('resize', () => chart.resize());
    } else {
      console.error('Chart DOM element not found.');
    }
  }

}
