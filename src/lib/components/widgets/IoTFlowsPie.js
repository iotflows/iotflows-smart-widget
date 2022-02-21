import React from "react";
import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import HighchartsReact from "highcharts-react-official";
// darkUnica(Highcharts);
highchartsMore(Highcharts);

export class IoTFlowsPie extends React.Component {
  constructor(props) {
    super(props);            
    this.chartComponent = React.createRef();
    this.childKey = 0
    this.state = { 
      data:[]
    }
  }

  componentDidMount() {       
  }

  static getDerivedStateFromProps(nextProps, prevState){    
    if(nextProps.data!==prevState.data){      
        return { data: nextProps.data};
    }
    else return null;
  }

  // no need anymore because of shouldComponentUpdate
  // componentDidUpdate(prevProps, prevState) {                    
  // }

  // PREVENT RE-RENDER of highcharts!
  shouldComponentUpdate(nextProps, nextState) {        
    if(this.state.data !== nextState.data) 
    {      
      // this.chartComponent.current.chart.series[0].points[0].update(nextProps.data);            
      return false;
    }      
    else
      return true
  }

  render() {    
    const options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
          text: "Today's Utilization"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
        text: 'iotflows.com',
        href: 'http://www.iotflows.com'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      //colors: [ '#539DDB', '#084A83'],
      series: [{
          name: 'Brands',
          //innerSize: '70%',
          colorByPoint: true,
          data: [{
              name: 'Cutting',
              y: 21.41,
              sliced: true,
              selected: true,
              color: '#539DDB'
          }, {
              name: 'Off',
              y: 61.84,
              color: 'gray'
          }, {
              name: 'Idle',
              y: 10.85,
              color: 'lightgray' 
          }]
      }]
    }

    ++this.childKey;    
    return (
      <HighchartsReact 
        containerProps={{ style: { height: "100%" } }}
        ref={this.chartComponent}
        highcharts={Highcharts}          
        options={options}
        key={this.childKey}              
      />
    );
  }
}
