import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { PolicyService } from 'app/policy.service';
import { map } from 'rxjs/operators';
import { LineChartService } from 'app/charts/line-chart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  customers: any;
  details: any;
  private history = [];
  private historySeries = [];  //if this array is empty this chart will not load
  private historyLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  private dailySalesChart_Instance;
  private dataDailySalesChart;
  private optionsDailySalesChart;

  private flowspeed = 0.0;
  private rotorpeeed = 0.0;
  private timestamp = "0.0";
  private waterlevel = 0.0;
  

  constructor(
    private policy: PolicyService, private bdd:LineChartService
  ) {
    this.List();
    this.basicDetails();
    
   }

   basicDetails(){
    console.log("Basic Details");
    
    // this.bdd.getBasicDashboardDetails().snapshotChanges()
    // .pipe(
    //   map(actions => 
    //     actions.map(a => 
    //       console.log(a.payload)
    //       )
    //     )
    // );

    this.bdd.getBasicDashboardDetails().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(details => {
      this.details = details;
      // Object.assign(this.history, this.customers)
      console.log(this.details[0]['flowRate']);
      console.log(this.details[0]['motorSpeed']);
      console.log(this.details[0]['timeStamp']);
      console.log(this.details[0]['waterLevel']);
      // this.historyChartdata();

      this.flowspeed = this.details[0]['flowRate'];
      this.rotorpeeed = this.details[0]['motorSpeed'];
      this.timestamp = this.details[0]['timeStamp'];
      this.waterlevel = this.details[0]['waterLevel'];
    });
   }

  chart() {
    console.log("button Click");
    this.barDetailsList();
  }

  List() {
    this.policy.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {
      this.customers = customers;
      Object.assign(this.history, this.customers)
      // console.log(this.customers);
      this.historyChartdata();
    });
  }

  barDetailsList() {
    this.policy.getBarDetails().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(details => {
      this.details = details;
      console.log(this.details);
    });
  }

  historyChartdata(){
    // this.List();
    console.log("historyChartdata()" + this.history);
    let arrX = [];
    let arrY = [];
    this.history.forEach(data => {
      arrY.push(data.area);
      arrX.push(data.day_short);
      // console.log(data.area);
    }
  );
  this.historySeries = arrY;
  this.historyLabels = arrX;
  this.ngAfterViewInitt();
  console.log(this.historySeries);
  console.log(this.historyLabels);
  }

  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };


  ngOnInit() {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
      // setTimeout(function(){ 
        // this.getchartdata();

      // const dataDailySalesChart: any = {
      //     labels: this.historyLabels,
      //     series: [
      //       this.historySeries
      //     ]
      // };

    //   const optionsDailySalesChart: any = {
    //     lineSmooth: Chartist.Interpolation.cardinal({
    //         tension: 0
    //     }),
    //     low: 0,
    //     high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    //     chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    // }
    
      this.dataDailySalesChart = {
        labels: this.historyLabels,
        series: [
          this.historySeries
        ]
    };

    this.optionsDailySalesChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
  }
     

      this.dailySalesChart_Instance = new Chartist.Line('#dailySalesChart',  this.dataDailySalesChart, this.optionsDailySalesChart);

      this.startAnimationForLineChart(this.dailySalesChart_Instance);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart); 
      // }, 3000);
      
  }

  ngAfterViewInitt() {
    this.dataDailySalesChart = {
      labels: this.historyLabels,
      series: [
        this.historySeries
      ]
  };
    this.dailySalesChart_Instance = new Chartist.Line(
      '#dailySalesChart',  this.dataDailySalesChart, this.optionsDailySalesChart
      );

    this.startAnimationForLineChart(this.dailySalesChart_Instance);
  }

}
