"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsMap = void 0;

require("core-js/modules/es.object.assign.js");

require("./styles/HeartbeatLED.scss");

require("./styles.css");

var _react = _interopRequireDefault(require("react"));

var _reactTransitionGroup = require("react-transition-group");

var _reactMapGl = _interopRequireWildcard(require("react-map-gl"));

var _mapboxGl = _interopRequireDefault(require("mapbox-gl"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// This is a dependency of react-map-gl even if you didn't explicitly install it
_mapboxGl.default.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
/* eslint import/no-webpack-loader-syntax: off */

class IoTFlowsMap extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      historicalData: [],
      viewport: {},
      selectedLocation: [],
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
    };
  }

  componentDidMount() {
    // remove logo
    let elements = document.getElementsByClassName('mapboxgl-ctrl-logo');
    if (elements && elements.length) elements[0].parentNode.removeChild(elements[0]);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    } else if (nextProps.historicalData !== prevState.historicalData && nextProps.historicalData) {
      return {
        historicalData: nextProps.historicalData
      };
    } else return null;
  } // componentDidUpdate(prevProps, prevState) {                
  // }
  // PREVENT RE-RENDER of highcharts!


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.data !== nextState.data) {
      if (nextState.data && nextState.data.length > 0) {
        this.setState({
          currentLocation: nextState.data[1]
        });
      }

      return false;
    } else if (this.state.historicalData !== this.props.historicalData) {
      // this.updateHistoricalData(nextProps.historicalData)   
      let coordinates = [];

      if (nextProps.historicalData) {
        nextProps.historicalData.map(data => {
          coordinates.push(data[1]);
        });
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
            latitude: coordinates[coordinates.length - 1][1],
            //37.830348,
            longitude: coordinates[coordinates.length - 1][0],
            //-122.486052,
            zoom: 11
          },
          currentLocation: coordinates[coordinates.length - 1]
        });
      }

      return false;
    } else return true;
  }

  render() {
    const {
      classes
    } = this.props;
    const {
      viewport,
      currentLocation,
      locationCoordinates
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'inline-flex',
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactMapGl.default, _extends({
      mapStyle: "mapbox://styles/iotflows/cks2ifj255lqk17p2i5nwheqy",
      mapboxApiAccessToken: "pk.eyJ1IjoiaW90Zmxvd3MiLCJhIjoiY2tzMmk2anFuMG9waTJ5bzRoN2FkbHJmNSJ9.OqgJVydjwZerowqBY-K2lA"
    }, viewport, {
      width: "100%",
      height: "100%",
      attributionControl: false,
      Credits: "Penny Dog Mapping Co.",
      onViewportChange: nextViewport => this.setState({
        viewport: nextViewport
      })
    }), locationCoordinates.map((location, index) => /*#__PURE__*/_react.default.createElement("div", {
      key: index
    }, /*#__PURE__*/_react.default.createElement(_reactMapGl.Marker, {
      latitude: location[1],
      longitude: location[0]
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "#f87171",
      viewBox: "0 0 16 16"
    }, /*#__PURE__*/_react.default.createElement("path", {
      d: "M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
    })))))), currentLocation.length ? /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.SwitchTransition, {
      mode: 'out-in'
    }, /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.CSSTransition, {
      key: 'currentLocation',
      timeout: 100,
      classNames: "zoomoutin"
    }, /*#__PURE__*/_react.default.createElement(_reactMapGl.Marker, {
      latitude: currentLocation[1],
      longitude: currentLocation[0],
      offsetTop: -12
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "heartbeatOnlineAllDevices"
    }, " ")))) : null, /*#__PURE__*/_react.default.createElement(_reactMapGl.Source, {
      id: "polylineLayer",
      type: "geojson",
      data: this.state.dataOne
    }, /*#__PURE__*/_react.default.createElement(_reactMapGl.Layer, {
      id: "lineLayer",
      type: "line",
      source: "my-data",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "rgba(3, 170, 238, 0.5)",
        "line-width": 10
      }
    }))));
  }

}

exports.IoTFlowsMap = IoTFlowsMap;