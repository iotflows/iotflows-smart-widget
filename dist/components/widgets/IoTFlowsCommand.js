"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsCommand = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.json.stringify.js");

var _react = _interopRequireDefault(require("react"));

require("./styles.css");

var _material = require("@mui/material");

var _LoadingButton = _interopRequireDefault(require("@mui/lab/LoadingButton"));

var _Stack = _interopRequireDefault(require("@mui/material/Stack"));

var _Snackbar = _interopRequireDefault(require("@mui/material/Snackbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IoTFlowsCommand extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      inputData: "",
      loading: false,
      action_name: "",
      open: false,
      message: ''
    };
  }

  componentDidMount() {
    // fetch the action name
    try {
      fetch("https://api.iotflows.com/v1/actions/".concat(this.props.widget_settings.actions[0].action_uuid), {
        headers: this.props.auth_header
      }).then(res => res.json()).then(json => this.setState({
        action_name: json.action_name
      }));
    } catch (e) {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== undefined && nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    } else return null;
  }

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
    }, this.state.action_name), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: '.9em',
        fontWeight: '400',
        color: 'gray',
        fontFamily: 'sans-serif'
      }
    }, this.props.name, ": ", this.state.data), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_Stack.default, {
      direction: "row",
      spacing: 2
    }, /*#__PURE__*/_react.default.createElement(_material.Input, {
      size: "small",
      defaultValue: '',
      inputProps: this.state.inputData,
      onChange: e => this.setState({
        inputData: e.target.value
      })
    }), /*#__PURE__*/_react.default.createElement(_LoadingButton.default, {
      size: "small",
      loading: this.state.loading,
      variant: "outlined",
      onClick: () => {
        this.setState({
          loading: true
        }, async () => {
          try {
            var res = await fetch("https://api.iotflows.com/v1/actions/".concat(this.props.widget_settings.actions[0].action_uuid), {
              method: 'POST',
              headers: this.props.auth_header,
              body: JSON.stringify({
                data: this.state.inputData
              })
            });
            this.setState({
              loading: false
            });

            if (res.ok) {
              var json;

              try {
                json = await res.json();
              } catch (e) {}

              if (json && json.message) this.setState({
                message: "Successfully sent to device. Returned message: ".concat(json.message),
                open: true
              });else this.setState({
                message: "Successfully sent to device.",
                open: true
              });
            } else this.setState({
              message: "Device offline or unreachable.",
              open: true
            });
          } catch (e) {
            this.setState({
              message: "Action failed.",
              open: true
            });
          }
        });
      }
    }, "Run"), /*#__PURE__*/_react.default.createElement(_Snackbar.default, {
      open: this.state.open,
      autoHideDuration: 5000,
      onClose: () => {
        this.setState({
          open: false
        });
      },
      message: this.state.message
    })));
  }

} //


exports.IoTFlowsCommand = IoTFlowsCommand;