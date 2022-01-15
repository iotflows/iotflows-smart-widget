import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
// import darkUnica from "highcharts/themes/dark-unica";
// darkUnica(Highcharts);

export class IoTFlowsLineChartSinglePoint extends React.Component {
  constructor(props) {
    super(props);        
    this.chartComponent = React.createRef();
    this.chartAwaitingTimer = null
    this.chartAwaitingCounter = 0
    this.childKey = 0
    this.state = { 
      data:[],
      historicalData: []      
    };     
  }

  componentDidMount() {    
  }

  static getDerivedStateFromProps(nextProps, prevState){      
    if(nextProps.data!==prevState.data){      
        return { data: nextProps.data};
    }
    else if(nextProps.historicalData!==prevState.historicalData){      
      return {historicalData: nextProps.historicalData};
    }
    else return null;    
  }

  // componentDidUpdate(prevProps, prevState) {                
  // }

  // PREVENT RE-RENDER of highcharts!
  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.data !== nextState.data) 
    {
      this.updateData(nextProps.data)
      return false;
    }    
    else if(this.state.historicalData !== this.props.historicalData)
    {            
      this.updateHistoricalData(nextProps.historicalData)           
      return false;    
    }        
    else
      return true
  }


  updateData(newData) { 
    let l = this.chartComponent.current.chart.series[0].data.length
    if(l < 50 ) {      
      this.chartComponent.current.chart.series[0].addPoint(newData, true, false, true)
    }
    else {
      this.chartComponent.current.chart.series[0].addPoint(newData, true, true, true)
    }        
  }

  updateHistoricalData(data) {      
    this.chartComponent.current.chart.series[0].setData(data)
    // this.setState({options: { ...this.state.options, series:[{...this.state.options.series[0], data}]}})      
  }

  render() {    

    const options = {
      chart: {
        height: 256,          
      },
      title: {
        text: this.props.name
      },
      xAxis: {
        ordinal: false,
      },
      rangeSelector: {
        enabled: false
      },
      credits: {
        text: 'iotflows.com',
        href: 'http://www.iotflows.com'
      },  	
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      series: [
        {
          type: "areaspline",
          // color: "#aedcfc",
          fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, Highcharts.getOptions().colors[0]],
                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')] 
            ]
          },
          marker: {
            enabled: true,
            radius: 4              
          },
          data: [],            
        }
      ]    
    }
    ++this.childKey;    
    return (
      <HighchartsReact
        constructorType={"stockChart"}   
        ref={this.chartComponent}
        highcharts={Highcharts}
        options={options}          
        key={this.childKey}              
      />
    );
  }
}
