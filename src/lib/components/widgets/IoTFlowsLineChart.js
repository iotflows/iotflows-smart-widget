import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
// import darkUnica from "highcharts/themes/dark-unica";
// darkUnica(Highcharts);

export class IoTFlowsLineChart extends React.Component {
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

  static getDerivedStateFromProps(nextProps, prevState){    
    if(nextProps.data !== undefined && nextProps.data!==prevState.data){         
        return { data: nextProps.data};
    }
    else return null;
    
  }

  // no need anymore because of shouldComponentUpdate
  // componentDidUpdate(prevProps, prevState) {                
  // }

  // PREVENT RE-RENDER of highcharts!
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.data !== undefined && this.state.data !== nextProps.data) 
    {                        
      this.chartComponent.current.chart.series[0].setData(nextProps.data)
      return false;
    }
    else
      return true
  }



  render() {

    const options = {
      chart: {        
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
          name: this.props.name,
          color: '#3399ff',
          data: this.state.data,
          animation: {
            duration: 1000,
          }
        }
      ]    
    }
    ++this.childKey;    
    return (
      <HighchartsReact
        constructorType={"stockChart"}  
        containerProps={{ style: { height: "100%" } }} 
        ref={this.chartComponent}
        highcharts={Highcharts}
        options={options}  
        key={this.childKey}              
      />
    );
  }
}
