"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsGauge = void 0;

var _react = _interopRequireDefault(require("react"));

var _highcharts = _interopRequireDefault(require("highcharts/highcharts.js"));

var _highchartsMore = _interopRequireDefault(require("highcharts/highcharts-more.js"));

var _solidGauge = _interopRequireDefault(require("highcharts/modules/solid-gauge.js"));

var _highchartsReactOfficial = _interopRequireDefault(require("highcharts-react-official"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import darkUnica from "highcharts/themes/dark-unica";
// darkUnica(Highcharts);
(0, _highchartsMore.default)(_highcharts.default);
(0, _solidGauge.default)(_highcharts.default);

class IoTFlowsGauge extends _react.default.Component {
  constructor(props) {
    super(props);
    this.chartComponent = /*#__PURE__*/_react.default.createRef();
    this.allowChartUpdate = false;
    this.chartAwaitingTimer = null;
    this.chartAwaitingCounter = 0;
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
      this.chartComponent.current.chart.series[0].points[0].update(nextProps.data);
      return false;
    } else return true;
  }

  render() {
    const options = {
      chart: {
        type: 'solidgauge'
      },
      title: {
        text: this.props.name // verticalAlign: 'middle', 
        // floating: true      

      },
      credits: {
        text: 'iotflows.com',
        href: 'http://www.iotflows.com'
      },
      tooltip: {
        enabled: false
      },
      pane: {
        center: ['50%', this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.is_arc && this.props.widget_settings.options.is_arc.value === "true" ? '65%' : '50%'],
        startAngle: this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.is_arc && this.props.widget_settings.options.is_arc.value === "true" ? -90 : 0,
        endAngle: this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.is_arc && this.props.widget_settings.options.is_arc.value === "true" ? 90 : 360,
        background: [{
          // Track for Move
          outerRadius: '110%',
          innerRadius: '90%',
          backgroundColor: _highcharts.default.color(_highcharts.default.getOptions().colors[0]).setOpacity(0.2).get(),
          borderWidth: 0,
          shape: 'arc'
        }]
      },
      yAxis: {
        min: this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.min && this.props.widget_settings.options.min.value !== undefined ? this.props.widget_settings.options.min.value : 0,
        max: this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.max && this.props.widget_settings.options.max.value !== undefined ? this.props.widget_settings.options.max.value : 100,
        lineWidth: 0,
        tickColor: 'darkblue'
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: true,
            borderWidth: 0,
            format: "<span style=\"font-size:2.75em; color: {point.color}; font-weight: bold\">{point.y}".concat(this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.unit && this.props.widget_settings.options.unit.value ? this.props.widget_settings.options.unit.value : '', "</span>")
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.options.is_arc && this.props.widget_settings.options.is_arc.value === "true" ? false : true
        }
      },
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B' // green

      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D' // yellow

      }, {
        from: 160,
        to: 300,
        color: '#DF5353' // red

      }],
      series: [{
        data: [{
          color: _highcharts.default.color(_highcharts.default.getOptions().colors[0]).setOpacity(0.95).get(),
          radius: '110%',
          innerRadius: '90%',
          y: 0
        }]
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

exports.IoTFlowsGauge = IoTFlowsGauge;