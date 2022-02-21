import "./styles/HeartbeatLED.scss";
import "./styles.css";

import React from 'react';
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';
import ReactMapGL, {Marker, Popup, Source, Layer, } from 'react-map-gl';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
/* eslint import/no-webpack-loader-syntax: off */



export class IoTFlowsMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      historicalData: [],
      viewport: {},
      selectedLocation:[],
      locationCoordinates: [],
      currentLocation: [],
      dataOne: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: []
        }
      },
      devicesWithCoordinates: [],
      coordinates: [],
      devicesDic: this.props.devicesDic,
      devices_list: this.props.devices_list
    }
  } 

  componentDidMount(){        
    // remove logo
    let elements = document.getElementsByClassName('mapboxgl-ctrl-logo')    
    if(elements && elements.length) elements[0].parentNode.removeChild(elements[0]);    
  }



  static getDerivedStateFromProps(nextProps, prevState){      
    if(nextProps.data!==prevState.data){      
        return { data: nextProps.data};
    }
    else if(nextProps.historicalData!==prevState.historicalData && nextProps.historicalData){      
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
      if(nextState.data && nextState.data.length > 0)
      {
        this.setState({        
          currentLocation: nextState.data[1]
        })
      }      
      return false;
    }    
    else if(this.state.historicalData !== this.props.historicalData)
    {            
      // this.updateHistoricalData(nextProps.historicalData)   
      let coordinates = []
      if(nextProps.historicalData)
      {
        nextProps.historicalData.map(data => {
          coordinates.push(data[1])
        })        
        this.setState({
          // locationCoordinates: coordinates,
          dataOne: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates
            }
          },
          viewport: {            
            latitude: coordinates[coordinates.length-1][1],//37.830348,
            longitude: coordinates[coordinates.length-1][0],//-122.486052,
            zoom: 11,
          },
          currentLocation: coordinates[coordinates.length-1]
        })
      }
      
      return false;    
    }        
    else
      return true
  }


  render() {
    const { classes } = this.props;
    const { viewport, 
            currentLocation, 
            locationCoordinates } = this.state;              

    return (
      <div style={{display: 'inline-flex', width:'100%', height:'100%',borderRadius: '8px',overflow:'hidden'}}>        
        <ReactMapGL 
            mapStyle='mapbox://styles/iotflows/cks2ifj255lqk17p2i5nwheqy'
            mapboxApiAccessToken='pk.eyJ1IjoiaW90Zmxvd3MiLCJhIjoiY2tzMmk2anFuMG9waTJ5bzRoN2FkbHJmNSJ9.OqgJVydjwZerowqBY-K2lA'
            {...viewport}
            width="100%"
            height="100%"            
            attributionControl={false}
            Credits= "Penny Dog Mapping Co."
            onViewportChange={(nextViewport) => this.setState({viewport: nextViewport})}            
        >          
          {locationCoordinates.map((location, index) => (
            <div key={index}>              
                <Marker
                    latitude={location[1]}
                    longitude={location[0]}                    
                >
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f87171" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                </Marker>                            
            </div>
          ))}

          {currentLocation.length ?
            <SwitchTransition mode={'out-in'}>
            <CSSTransition key={'currentLocation'} timeout={100} classNames="zoomoutin">      
              <Marker 
                  latitude={currentLocation[1]}
                  longitude={currentLocation[0]}                       
                  offsetTop={-12}                
                >
                <p className="heartbeatOnlineAllDevices"> </p>                 
              </Marker>
            </CSSTransition>
          </SwitchTransition>          
          : null}

          <Source id="polylineLayer" type="geojson" data={this.state.dataOne}>
            <Layer
              id="lineLayer"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "rgba(3, 170, 238, 0.5)",
                "line-width": 10
              }}
            />
          </Source>
        </ReactMapGL>            
      </div>

    );
  }
}
