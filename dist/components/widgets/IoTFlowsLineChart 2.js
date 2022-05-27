"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsLineChart = void 0;

var _react = _interopRequireDefault(require("react"));

var _highstock = _interopRequireDefault(require("highcharts/highstock"));

var _highchartsReactOfficial = _interopRequireDefault(require("highcharts-react-official"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import darkUnica from "highcharts/themes/dark-unica";
// darkUnica(Highcharts);
class IoTFlowsLineChart extends _react.default.Component {
  constructor(props) {
    super(props);
    this.chartComponent = /*#__PURE__*/_react.default.createRef();
    this.chartAwaitingTimer = null;
    this.chartAwaitingCounter = 0;
    this.childKey = 0;
    this.state = {
      data: []
    };
  }

  componentDidMount() {}

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


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data !== undefined && this.state.data !== nextProps.data) {
      this.chartComponent.current.chart.series[0].setData(nextProps.data);
      return false;
    } else return true;
  }

  render() {
    const options = {
      chart: {},
      title: {
        text: this.props.name
      },
      xAxis: {
        ordinal: false
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
      series: [{
        color: '#3399ff',
        data: this.state.data,
        animation: {
          duration: 1000
        }
      }]
    };
    ++this.childKey;
    return /*#__PURE__*/_react.default.createElement(_highchartsReactOfficial.default, {
      constructorType: "stockChart",
      containerProps: {
        style: {
          height: "100%"
        }
      },
      ref: this.chartComponent,
      highcharts: _highstock.default,
      options: options,
      key: this.childKey
    });
  }

}

exports.IoTFlowsLineChart = IoTFlowsLineChart;