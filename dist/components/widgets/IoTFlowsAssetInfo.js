"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoTFlowsAssetInfo = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@material-ui/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var fetch = require('node-fetch');
const StyledTableCell = (0, _core.withStyles)(theme => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.gray,
    fontWeight: 700,
    fontFamily: 'Trebuchet MS',
    fontSize: 11,
    height: '20px',
    padding: '8px',
    paddingLeft: '12px',
    borderBottom: 'none'
  },
  body: {
    fontSize: 13,
    fontFamily: 'Trebuchet MS',
    height: '24px',
    padding: '8px'
  }
}))(_core.TableCell);
const cellStyle = {
  paddingLeft: '12px',
  color: '#6b7280'
};

class IoTFlowsAssetInfo extends _react.default.Component {
  constructor(props) {
    super(props);
    this.chartComponent = /*#__PURE__*/_react.default.createRef();
  }

  componentDidMount() {}

  render() {
    let asset_info = this.props.asset_info;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Card, {
      style: {
        height: '100%',
        overflow: 'scroll',
        border: 0
      },
      variant: "outlined"
    }, /*#__PURE__*/_react.default.createElement(_core.CardContent, {
      style: {
        textAlign: 'left'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: asset_info.asset_custom_picture_url || asset_info.machine_picture_url,
      alt: "Machine image",
      style: {
        borderRadius: '8px',
        width: '100%'
      }
    })), /*#__PURE__*/_react.default.createElement(_core.TableContainer, {
      styled: {
        marginTop: '12px'
      }
    }, /*#__PURE__*/_react.default.createElement(_core.Table, {
      "aria-label": "data table"
    }, /*#__PURE__*/_react.default.createElement("colgroup", null, /*#__PURE__*/_react.default.createElement("col", {
      style: {
        width: '30%'
      }
    }), /*#__PURE__*/_react.default.createElement("col", {
      style: {
        width: '70%'
      }
    })), /*#__PURE__*/_react.default.createElement(_core.TableHead, null, /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      style: {
        paddingLeft: '12px',
        borderBottom: 'none'
      },
      colSpan: 2
    }, "Asset"))), /*#__PURE__*/_react.default.createElement(_core.TableBody, null, asset_info.asset_custom_name && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Name"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.asset_custom_name)), !asset_info.asset_custom_name && asset_info.machine_name && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Name"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.machine_name)), asset_info.asset_custom_description && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Description"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.asset_custom_description)), !asset_info.asset_custom_description && asset_info.machine_description && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Description"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.machine_description)), asset_info.asset_custom_identifier && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "ID"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.asset_custom_identifier)), !asset_info.asset_custom_identifier && asset_info.machine_identifier && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "ID"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.machine_identifier)), /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Tags"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, "CNC")), asset_info.asset_custom_homepage_url && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Homepage URL"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: {
        cursor: 'pointer'
      },
      onClick: () => window.open(asset_info.asset_custom_identifier, "_blank")
    }, asset_info.asset_custom_identifier)), !asset_info.asset_custom_homepage_url && asset_info.machine_homepage_url && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Homepage URL"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: {
        cursor: 'pointer'
      },
      onClick: () => window.open(asset_info.machine_homepage_url, "_blank")
    }, asset_info.machine_homepage_url))), /*#__PURE__*/_react.default.createElement(_core.TableHead, null, /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      style: {
        paddingLeft: '12px',
        borderBottom: 'none'
      },
      colSpan: 2
    }, 'Manufacturer', "\xA0\xA0\xA0", asset_info.manufacturer_is_verified && /*#__PURE__*/_react.default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "1.3em",
      height: "1.3em",
      fill: "#2563eb",
      viewBox: "0 0 16 16"
    }, /*#__PURE__*/_react.default.createElement("path", {
      d: "M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"
    }))))), /*#__PURE__*/_react.default.createElement(_core.TableBody, null, asset_info.manufacturer_name && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Name"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.manufacturer_name)), asset_info.manufacturer_description && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Description"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.manufacturer_description)), asset_info.manufacturer_homepage_url && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Homepage URL"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: {
        cursor: 'pointer'
      },
      onClick: () => window.open(asset_info.manufacturer_homepage_url, "_blank")
    }, asset_info.manufacturer_homepage_url)), asset_info.manufacturer_support_email && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Support Email"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.manufacturer_support_email)), asset_info.manufacturer_support_phone && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Support Phone"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.manufacturer_support_phone)), asset_info.manufacturer_support_homepage_url && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Support URL"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: {
        cursor: 'pointer'
      },
      onClick: () => window.open(asset_info.manufacturer_support_homepage_url, "_blank")
    }, asset_info.manufacturer_support_homepage_url))), /*#__PURE__*/_react.default.createElement(_core.TableHead, null, /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      style: {
        paddingLeft: '12px',
        borderBottom: 'none'
      },
      colSpan: 2
    }, "Device"))), /*#__PURE__*/_react.default.createElement(_core.TableBody, null, asset_info.device_name && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Name"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.device_name)), asset_info.device_description && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Description"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.device_description)), asset_info.device_last_heard && /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left",
      style: cellStyle
    }, "Last Connection Established"), /*#__PURE__*/_react.default.createElement(StyledTableCell, {
      align: "left"
    }, asset_info.device_last_heard))))))));
  }

}

exports.IoTFlowsAssetInfo = IoTFlowsAssetInfo;