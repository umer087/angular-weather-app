import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  @Input() barChartLabels : string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  @Input() barChartData : any = [
    {data: [], label: 'Temperature'},
  ];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
}
