import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";

highchartsMap(Highcharts);
var fetch = require('node-fetch');


// import darkUnica from "highcharts/themes/dark-unica";
// darkUnica(Highcharts);

export class IoTFlowsHeatmap extends React.Component {
  constructor(props) {
    super(props);        
    this.chartComponent = React.createRef();
    this.chartAwaitingTimer = null
    this.chartAwaitingCounter = 0
    this.childKey = 0
    this.state = { 
      data:[]      
    };     
  }

  componentDidMount() {          
  }

  // static getDerivedStateFromProps(nextProps, prevState){    
  //   if(nextProps.data !== undefined && nextProps.data!==prevState.data){                                
  //       return { data: nextProps.data};
  //   }
  //   else return null;
    
  // }

  // no need anymore because of shouldComponentUpdate
  // componentDidUpdate(prevProps, prevState) {                
  // }

  // PREVENT RE-RENDER of highcharts!
  // shouldComponentUpdate(nextProps, nextState) {
  //   if(nextProps.data !== undefined && this.state.data !== nextProps.data) 
  //   {                        
  //     this.chartComponent.current.chart.series[0].setData(nextProps.data)
  //     return false;
  //   }
  //   else
  //     return true
  // }



  render() {
    var self = this
    var options = {
        chart: {
            type: 'heatmap',            
        },

        title: {
            text: 'Ratio of OKs'
        },
    
        credits: {
          text: 'iotflows.com',
          href: 'http://www.iotflows.com'
        },
        xAxis: {
            categories: self.props.data.hc_x_categories, //['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
    
        yAxis: {            
            categories: self.props.data.hc_y_categories,// ["CONTROLLER1-SPINDLE10","CONTROLLER1-SPINDLE11","CONTROLLER1-SPINDLE12","CONTROLLER1-SPINDLE13","CONTROLLER1-SPINDLE6"],
            title: null,
            reversed: true
        },
    
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },
    
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
    
        tooltip: {
            formatter: function () {
                return `<b>${getPointCategoryName(this.point, 'x')}</b><br>Ratio of OKs: <b>${this.point.value}%</b> <br>on <b>${getPointCategoryName(this.point, 'y')}</b>`
            }
        },
    
        series: [{
            name: 'OK Ratio per Day',            
            data: self.props.data.hc_series_data, //[[0,0,0],[0,1,19],[0,2,93],[0,3,0],[0,4,0],[1,0,0],[1,1,93],[1,2,32],[1,3,0],[1,4,0],[2,0,84],[2,1,35],[2,2,0],[2,3,83],[2,4,0],[3,0,0],[3,1,0],[3,2,0],[3,3,0],[3,4,0],[4,0,0],[4,1,100],[4,2,83],[4,3,75],[4,4,80],[5,0,0],[5,1,0],[5,2,0],[5,3,0],[5,4,0],[6,0,0],[6,1,0],[6,2,0],[6,3,0],[6,4,0]],
            dataLabels: {
                enabled: true,
                color: '#000000'
            }
        }],

        legend: {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
      },
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    yAxis: {
                        labels: {
                            formatter: function () {
                                return this.value.charAt(0);
                            }
                        }
                    }
                }
            }]
        }
    
    }
    ++this.childKey;    
    return (
      <>
        <HighchartsReact
          // constructorType={"mapChart"}  
          containerProps={{ style: { height: "100%" } }}

          ref={this.chartComponent}
          highcharts={Highcharts}
          options={options}  
          key={this.childKey}              
        />
      </>
      
    );
  }
}

function getPointCategoryName(point, dimension) {  
  var series = point.series,
      isY = dimension === 'y',
      axis = series[isY ? 'yAxis' : 'xAxis'];  
  return axis.categories[point[isY ? 'y' : 'x']];
}







