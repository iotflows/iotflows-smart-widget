"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsMultiLineChart = void 0;

var _react = _interopRequireDefault(require("react"));

var _highcharts = _interopRequireDefault(require("highcharts/highcharts.js"));

var _highchartsMore = _interopRequireDefault(require("highcharts/highcharts-more.js"));

var _highchartsReactOfficial = _interopRequireDefault(require("highcharts-react-official"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// darkUnica(Highcharts);
(0, _highchartsMore.default)(_highcharts.default);

class IoTFlowsMultiLineChart extends _react.default.Component {
  constructor(props) {
    super(props);
    this.chartComponent = /*#__PURE__*/_react.default.createRef();
    this.childKey = 0;
    this.state = {
      data: []
    };
  }

  componentDidMount() {}

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
        type: 'spline'
      },
      title: {
        text: 'Utilization Hours Per Month'
      },
      credits: {
        text: 'iotflows.com',
        href: 'http://www.iotflows.com'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          // don't display the dummy year
          month: '%e. %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Utilization (hours)'
        },
        min: 0
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} hours'
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true
          }
        }
      },
      colors: ['#539DDB', '#084A83'],
      // Define the data points. All series have a dummy year
      // of 1970/71 in order to be compared on the same x axis. Note
      // that in JavaScript, months start at 0 for January, 1 for February etc.
      series: [{
        name: "2020",
        data: [[Date.UTC(1971, 0, 1), 5], [Date.UTC(1971, 1, 1), 4], [Date.UTC(1971, 2, 1), 2], [Date.UTC(1971, 3, 1), 3], [Date.UTC(1971, 4, 1), 4.68], [Date.UTC(1971, 5, 1), 11], [Date.UTC(1971, 6, 1), 11.85], [Date.UTC(1971, 7, 1), 17.49], [Date.UTC(1971, 8, 1), 18.27], [Date.UTC(1971, 9, 1), 10.99], [Date.UTC(1971, 10, 1), 10.67], [Date.UTC(1971, 11, 1), 10.18]]
      }, {
        name: "2021",
        data: [[Date.UTC(1971, 0, 1), 10.85], [Date.UTC(1971, 1, 1), 10.89], [Date.UTC(1971, 2, 1), 21.04], [Date.UTC(1971, 3, 1), 21.02], [Date.UTC(1971, 4, 1), 11.03], [Date.UTC(1971, 5, 1), 11.39], [Date.UTC(1971, 6, 1), 11.77], [Date.UTC(1971, 7, 1), 21.12], [Date.UTC(1971, 8, 1), 21.1], [Date.UTC(1971, 9, 1), 11.7], [Date.UTC(1971, 10, 1), 11.55], [Date.UTC(1971, 11, 1), 11.35]]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            plotOptions: {
              series: {
                marker: {
                  radius: 2.5
                }
              }
            }
          }
        }]
      }
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

exports.IoTFlowsMultiLineChart = IoTFlowsMultiLineChart;