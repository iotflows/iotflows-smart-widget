import React from 'react';
import ReactMapGL, {Marker, Popup, Source, Layer, } from 'react-map-gl';
import {View} from 'react';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
/* eslint import/no-webpack-loader-syntax: off */

export class IoTFlowsMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      historicalData: [],
      viewport: {
        latitude: 37.830348,
        longitude: -122.486052,
        zoom: 15,
      },
      selectedLocation:[],
      locationCoordinates: [
        // [-122.483696, 37.833818],
        // [-122.483482, 37.833174],
        // [-122.483396, 37.8327],
        // [-122.483568, 37.832056],
        // [-122.48404, 37.831141],
        // [-122.48404, 37.830497],
        // [-122.483482, 37.82992],
        // [-122.483568, 37.829548],
        // [-122.48507, 37.829446],
        // [-122.4861, 37.828802],
        // [-122.486958, 37.82931],
        // [-122.487001, 37.830802],
        // [-122.487516, 37.831683],
        // [-122.488031, 37.832158],
        // [-122.488889, 37.832971],
        // [-122.489876, 37.832632],
        // [-122.490434, 37.832937],
        // [-122.49125, 37.832429],
        // [-122.491636, 37.832564],
        // [-122.492237, 37.833378],
        // [-122.493782, 37.833683]
      ],
      dataOne: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            // [-122.483696, 37.833818],
            // [-122.483482, 37.833174],
            // [-122.483396, 37.8327],
            // [-122.483568, 37.832056],
            // [-122.48404, 37.831141],
            // [-122.48404, 37.830497],
            // [-122.483482, 37.82992],
            // [-122.483568, 37.829548],
            // [-122.48507, 37.829446],
            // [-122.4861, 37.828802],
            // [-122.486958, 37.82931],
            // [-122.487001, 37.830802],
            // [-122.487516, 37.831683],
            // [-122.488031, 37.832158],
            // [-122.488889, 37.832971],
            // [-122.489876, 37.832632],
            // [-122.490434, 37.832937],
            // [-122.49125, 37.832429],
            // [-122.491636, 37.832564],
            // [-122.492237, 37.833378],
            // [-122.493782, 37.833683]
          ]
        }
      },
      devicesWithCoordinates: [],
      coordinates: [],
      devicesDic: this.props.devicesDic,
      devices_list: this.props.devices_list
    }
  } 

  componentDidMount(){    
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
          locationCoordinates: coordinates,
          dataOne: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates
            }
          }
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
            selectedLocation, 
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
                  // offsetLeft={-20}
                  // offsetTop={-10}
              >
                <div onClick={() => this.setState({selectedLocation: location})} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f87171" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                </div>
              </Marker>
              {/* Popup if we click on a marker */}
              {selectedLocation[0] === location[0] && selectedLocation[1] === location[1] ? (
                  <Popup 
                      onClose={() => this.setState({selectedLocation: []})}
                      closeOnClick={true}
                      latitude={location[1]}
                      longitude={location[0]}
                      className={classes.popupContainer}
                      dynamicPosition={true}
                      // tipSize={15}
                  >
                      <div >
                          <div className={classes.popupBoxHeader}>
                              {`Latitude: ${location[1]}, Longtitude:${location[0]}`}
                          </div>
                      </div>                      
                  </Popup>
                  ): (
                      false
                  )
              }
            </div>
          ))}
          
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
