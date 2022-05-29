"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsMultiColumn = void 0;

var _react = _interopRequireDefault(require("react"));

var _highcharts = _interopRequireDefault(require("highcharts/highcharts.js"));

var _highchartsMore = _interopRequireDefault(require("highcharts/highcharts-more.js"));

var _highchartsReactOfficial = _interopRequireDefault(require("highcharts-react-official"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// darkUnica(Highcharts);
(0, _highchartsMore.default)(_highcharts.default);

class IoTFlowsMultiColumn extends _react.default.Component {
  constructor(props) {
    super(props);
    this.chartComponent = /*#__PURE__*/_react.default.createRef();
    this.childKey = 0;
    this.state = {
      data: []
    };
  }

  componentDidMount() {// console.log('PIE')
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    } else return null;
  } // no need anymore because of shouldComponentUpdate
  // componentDidUpdate(prevProps, prevState) {                    
  // }
  // PREVENT RE-RENDER of highcharts!


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.data !== nextState.data) {
      // this.chartComponent.current.chart.series[0].points[0].update(nextProps.data);            
      return false;
    } else return true;
  }

  render() {
    const options = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Asset Movement Per Day'
      },
      subtitle: {
        text: 'Total distance asset moved per day'
      },
      credits: {
        text: 'iotflows.com',
        href: 'http://www.iotflows.com'
      },
      xAxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Distance (miles)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f} miles</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          borderWidth: 0
        },
        series: {
          pointWidth: 25
        }
      },
      colors: ['#539DDB', '#084A83'],
      series: [{
        name: 'This Week',
        data: [49.9, 71.5, 106.4, 129.2, 144.0]
      }, {
        name: 'Last Week',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0]
      }]
    };
    ++this.childKey;
    return /*#__PURE__*/_react.default.createElement(_highchartsReactOfficial.default, {
      containerProps: {
        style: {
          height: "100%"
        }
      },
      ref: this.chartComponent,
      highcharts: _highcharts.default,
      options: options,
      key: this.childKey
    });
  }

}

exports.IoTFlowsMultiColumn = IoTFlowsMultiColumn;