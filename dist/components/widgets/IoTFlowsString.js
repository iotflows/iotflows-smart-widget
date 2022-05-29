"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsString = void 0;

var _react = _interopRequireDefault(require("react"));

require("./styles.css");

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IoTFlowsString extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== undefined && nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    } else return null;
  } // no need anymore because of shouldComponentUpdate
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
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: '1em',
        fontWeight: '400',
        color: '#6b7280',
        fontFamily: 'sans-serif'
      }
    }, this.props.name), /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.SwitchTransition, {
      mode: 'out-in'
    }, /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.CSSTransition, {
      key: this.state.data,
      timeout: 100,
      classNames: "zoomoutin"
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: '1.5em',
        color: '#81b5e5',
        fontWeight: '600',
        fontFamily: 'sans-serif'
      }
    }, this.state.data))));
  }

}

exports.IoTFlowsString = IoTFlowsString;