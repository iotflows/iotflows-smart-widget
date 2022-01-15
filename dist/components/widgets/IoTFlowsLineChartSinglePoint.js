"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsLineChartSinglePoint = void 0;

var _react = _interopRequireDefault(require("react"));

var _highstock = _interopRequireDefault(require("highcharts/highstock"));

var _highchartsReactOfficial = _interopRequireDefault(require("highcharts-react-official"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import darkUnica from "highcharts/themes/dark-unica";
// darkUnica(Highcharts);
class IoTFlowsLineChartSinglePoint extends _react.default.Component {
  constructor(props) {
    super(props);
    this.chartComponent = /*#__PURE__*/_react.default.createRef();
    this.chartAwaitingTimer = null;
    this.chartAwaitingCounter = 0;
    this.childKey = 0;
    this.state = {
      data: [],
      historicalData: []
    };
  }

  componentDidMount() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    } else if (nextProps.historicalData !== prevState.historicalData) {
      return {
        historicalData: nextProps.historicalData
      };
    } else return null;
  } // componentDidUpdate(prevProps, prevState) {                
  // }
  // PREVENT RE-RENDER of highcharts!


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.data !== nextState.data) {
      this.updateData(nextProps.data);
      return false;
    } else if (this.state.historicalData !== this.props.historicalData) {
      this.updateHistoricalData(nextProps.historicalData);
      return false;
    } else return true;
  }

  updateData(newData) {
    let l = this.chartComponent.current.chart.series[0].data.length;

    if (l < 50) {
      this.chartComponent.current.chart.series[0].addPoint(newData, true, false, true);
    } else {
      this.chartComponent.current.chart.series[0].addPoint(newData, true, true, true);
    }
  }

  updateHistoricalData(data) {
    this.chartComponent.current.chart.series[0].setData(data); // this.setState({options: { ...this.state.options, series:[{...this.state.options.series[0], data}]}})      
  }

  render() {
    const options = {
      chart: {
        height: '100%'
      },
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
        type: "areaspline",
        // color: "#aedcfc",
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [[0, _highstock.default.getOptions().colors[0]], [1, _highstock.default.color(_highstock.default.getOptions().colors[0]).setOpacity(0).get('rgba')]]
        },
        marker: {
          enabled: true,
          radius: 4
        },
        data: []
      }]
    };
    ++this.childKey;
    return /*#__PURE__*/_react.default.createElement(_highchartsReactOfficial.default, {
      constructorType: "stockChart",
      ref: this.chartComponent,
      highcharts: _highstock.default,
      options: options,
      key: this.childKey
    });
  }

}

exports.IoTFlowsLineChartSinglePoint = IoTFlowsLineChartSinglePoint;