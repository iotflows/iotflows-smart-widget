"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsNumerical = void 0;

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.parse-float.js");

require("core-js/modules/es.array.reverse.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.regexp.to-string.js");

var _react = _interopRequireDefault(require("react"));

require("./styles.css");

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IoTFlowsNumerical extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0.0
    };
  }

  render() {
    let data = this.props.data;
    let dataShortString = data;
    let number_of_decimals = this.props.widget_settings && this.props.widget_settings.options && this.props.widget_settings.number_of_decimals ? this.props.widget_settings.options.number_of_decimals : 1;

    try {
      data = parseFloat(data).toFixed(number_of_decimals);
      dataShortString = nFormatter(data, number_of_decimals);
    } catch (e) {
      console.log(e);
    }

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
      key: dataShortString,
      timeout: 100,
      classNames: "zoomoutin"
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: '2em',
        color: '#81b5e5',
        fontWeight: '600',
        fontFamily: 'sans-serif'
      }
    }, dataShortString))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: '0.8em',
        fontWeight: '400',
        color: '#b0b0b0',
        fontFamily: 'sans-serif'
      }
    }, commafy(data)));
  }

} // Helper function to format numbers


exports.IoTFlowsNumerical = IoTFlowsNumerical;

function nFormatter(num, digits) {
  const lookup = [{
    value: 1,
    symbol: ""
  }, {
    value: 1e3,
    symbol: "k"
  }, {
    value: 1e6,
    symbol: "M"
  }, {
    value: 1e9,
    symbol: "G"
  }, {
    value: 1e12,
    symbol: "T"
  }, {
    value: 1e15,
    symbol: "P"
  }, {
    value: 1e18,
    symbol: "E"
  }];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
} // Helper function to add comma to numbers


function commafy(num) {
  var str = num.toString().split('.');

  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }

  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }

  return str.join('.');
}