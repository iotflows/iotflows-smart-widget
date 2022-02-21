import React from "react";
import "./styles.css";

import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';

export class IoTFlowsString extends React.Component {
  constructor(props) {
    super(props);        
    this.state = { 
      data: ""
    }
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
  // shouldComponentUpdate(nextProps, nextState) {        
  //   if(this.state.data !== nextState.data) 
  //   {      
  //     this.chartComponent.current.chart.series[0].points[0].update(nextProps.data);            
  //     return false;
  //   }      
  //   else
  //     return true
  // }

  render() {

    return (
        <div style={{display:'flex',  flexDirection:'column', justifyContent: 'center', alignItems: 'center',  height:'100%'}}>
          <div style={{fontSize:'1em', fontWeight:'400', color:'#6b7280', fontFamily: 'sans-serif'}}>{this.props.name}</div>
          <SwitchTransition mode={'out-in'}>
            <CSSTransition key={this.state.data} timeout={100} classNames="zoomoutin">      
              <div style={{fontSize:'1.5em', color:'#81b5e5', fontWeight:'600', fontFamily: 'sans-serif'}}>{this.state.data}</div>
            </CSSTransition>
          </SwitchTransition>
        </div>                  
    );
  }
}
