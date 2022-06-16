"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.parse-float.js");

require("core-js/modules/es.array.reverse.js");

require("core-js/modules/es.string.ends-with.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.string.starts-with.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.json.stringify.js");

var _react = _interopRequireDefault(require("react"));

var _IoTFlowsLineChart = require("./widgets/IoTFlowsLineChart");

var _IoTFlowsLineChartSinglePoint = require("./widgets/IoTFlowsLineChartSinglePoint");

var _IoTFlowsGauge = require("./widgets/IoTFlowsGauge");

var _IoTFlowsNumerical = require("./widgets/IoTFlowsNumerical");

var _IoTFlowsString = require("./widgets/IoTFlowsString");

var _IoTFlowsAssetInfo = require("./widgets/IoTFlowsAssetInfo");

var _IoTFlowsMap = require("./widgets/IoTFlowsMap");

var _IoTFlowsMultiLineChart = require("./widgets/IoTFlowsMultiLineChart");

var _IoTFlowsMultiColumn = require("./widgets/IoTFlowsMultiColumn");

var _IoTFlowsPie = require("./widgets/IoTFlowsPie");

var _IoTFlowsCommand = require("./widgets/IoTFlowsCommand");

var _IoTFlowsHeatmap = require("./widgets/IoTFlowsHeatmap");

var _iotflowsJs = require("@iotflows/iotflows-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetch = require('node-fetch');

class SmartWidget extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      flow_data: {},
      historicalData: {},
      widget_flows: [],
      asset_info: {},
      widget_template_uuid_of_widget_uuid: {},
      sat_status_per_day: {}
    };
  }

  componentDidMount() {
    try {
      this.readRealTime();
    } catch (e) {
      console.log(e);
    } // localStorage.setItem('cache', null)    

  }

  async readRealTime() {
    var self = this; // connect to the cloud

    self.iotflows = await (0, _iotflowsJs.loadIoTFlows)(this.props.username, this.props.password); // read widget asset info    

    try {
      var json = await this.fetchCachedURL("https://api.iotflows.com/v1/widgets/".concat(self.props.widget_uuid));

      if (json && json.data && json.data[0]) {
        // map widget_template_uuid <-> widget_uuid
        let temp = self.state.widget_template_uuid_of_widget_uuid;
        temp[self.props.widget_uuid] = json.data[0].widget_template_uuid;
        self.setState({
          widget_template_uuid_of_widget_uuid: temp
        }); // read asset_info

        if (json.data[0].widget_template_uuid === "wdgt_asset_info") {
          var json2 = await this.fetchCachedURL("https://api.iotflows.com/v1/assets/".concat(self.props.asset_uuid));

          if (json2 && json2.data && json2.data[0]) {
            self.setState({
              asset_info: json2.data[0]
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    try {
      // read flows_data info
      var json = await this.fetchCachedURL("https://api.iotflows.com/v1/assets/".concat(self.props.asset_uuid, "/widgets/").concat(self.props.widget_uuid, "/flows_data"));

      if (json && json.data && json.data[0]) {
        let widget_flows = json.data;
        self.setState({
          widget_flows: widget_flows
        });
        widget_flows.map(async widget_flow => {
          if (widget_flow.flow_mqtt_payload_parsing_expression.data_type == 'timeseries_single_point') {
            let result = [];
            widget_flow.data.map(datapoint => {
              result.push([new Date(datapoint.received_at).getTime(), parseFloat(self.parseWithExpressionCondition(datapoint.data, widget_flow.flow_mqtt_payload_parsing_expression.data))]);
            });
            let historicalData = self.state.historicalData || {};
            historicalData[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result.reverse();
            self.setState({
              historicalData
            });
          } else if (widget_flow.flow_mqtt_payload_parsing_expression.data_type == 'timeseries_single_coordinate') {
            let result = [];
            widget_flow.data.map(datapoint => {
              result.push([new Date(datapoint.received_at).getTime(), self.parseWithExpressionCondition(datapoint.data, widget_flow.flow_mqtt_payload_parsing_expression.data)]);
            });
            let historicalData = self.state.historicalData || {};
            historicalData[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result.reverse();
            self.setState({
              historicalData
            });
          } else {
            let result = self.parsePayloadToFlowObject(widget_flow.data[0].data, widget_flow.flow_mqtt_payload_parsing_expression);
            let flow_data = self.state.flow_data || {};
            flow_data[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result;
            self.setState({
              flow_data
            });
          }
        }); // Subscribe and parse all flows of each data stream

        widget_flows.map(async widget_flow => {
          await self.iotflows.subscribe({
            data_stream_uuid: widget_flow.data_stream_uuid,
            subtopic_subscription: true,
            callback: function handler(topic, payload) {
              // update the flow_data of this flow_uuid in the states 
              if (!widget_flow.flow_mqtt_subtopic || topic.endsWith(widget_flow.flow_mqtt_subtopic)) {
                let result = self.parsePayloadToFlowObject(payload, widget_flow.flow_mqtt_payload_parsing_expression);

                if (result) {
                  let flow_data = self.state.flow_data || {};
                  flow_data[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result;
                  self.setState({
                    flow_data
                  });
                }
              }
            }
          });
        });
      }
    } catch (e) {
      console.error("Error: can't read the widget_flows info.", e);
      return;
    } // // hack for now: read sat_status_per_day
    // var res = await fetch('https://api.iotflows.com/v1/data_streams/ds_2e420d6725134d078ead21608ca49898/sat_status_per_day?topic_containing=CONTROLLER1&starting_date=3/6/2022&ending_date=3/12/2022')
    // var json = await res.json()     
    // if(json && json.data)
    // {
    //   self.setState({sat_status_per_day: json.data})
    // }

  }

  parsePayloadToFlowObject(payload, ex) {
    var self = this; // parse payload

    let jsonPayload = payload;
    if (typeof (jsonPayload !== 'object')) try {
      jsonPayload = JSON.parse(jsonPayload);
    } catch (e) {} // construct the timeseries        

    try {
      if (ex) {
        // JSON sanity
        if (typeof ex !== 'object') try {
          ex = JSON.parse(ex);
        } catch (e) {} // version check

        if (ex.version !== '1.1') {
          console.log("Parsing version is not supprted for this widget");
          return;
        } // data_type


        switch (ex.data_type) {
          case 'datetime':
            var datetime = self.parseWithExpressionCondition(jsonPayload, ex.data); // parse as Date to local

            try {
              datetime = new Date(datetime);

              if (ex.datetime_format) {
                switch (ex.datetime_format) {
                  case 'time':
                    datetime = datetime.toLocaleTimeString();
                    break;

                  case 'date':
                    datetime = datetime.toLocaleDateString();
                    break;

                  default:
                    datetime = datetime.toLocaleString();
                    break;
                }
              }
            } catch (e) {}

            return datetime;
            break;

          case 'string':
            return self.parseWithExpressionCondition(jsonPayload, ex.data);
            break;

          case 'number':
            var number = self.parseWithExpressionCondition(jsonPayload, ex.data); // parse as float

            try {
              number = parseFloat(number);
            } catch (e) {} // show digits if given


            if (ex.number_digits) {
              try {
                number = number.toFixed(ex.number_digits);
              } catch (e) {}
            }

            return number || 0.0;
            break;

          case 'timeseries_single_point':
            var number = self.parseWithExpressionCondition(jsonPayload, ex.data); // parse as float          

            try {
              number = parseFloat(number);
            } catch (e) {} // show digits if given


            if (ex.number_digits) {
              try {
                number = number.toFixed(ex.number_digits);
              } catch (e) {}
            } // add timestamp


            var now = new Date().getTime();
            return [now, number];
            break;

          case 'timeseries_single_coordinate':
            var coordinate = self.parseWithExpressionCondition(jsonPayload, ex.data); // add timestamp

            var now = new Date().getTime();
            return [now, coordinate];
            break;

          case 'timeseries_array':
            var timeseries = []; // merge timestamps and data to form timeseries?

            if (ex.merge_require) {
              var data = [];
              var timestamps = [];
              data = self.parseWithExpressionCondition(jsonPayload, ex.data);
              if (!data) return;

              try {
                data = data.map(x => parseFloat(x));
              } catch (e) {}

              if (ex.datetime.type = 'starting_datetime_sampling_interval') {
                let starting_datetime = Date.now();
                let sampling_interval = 1.0;
                let starting_datetime_ratio = 1.0; // try { 
                //   starting_datetime_ratio = parseFloat(ex.datetime.starting_datetime_ratio) || 1.0                  
                // } catch(e) {console.log(e, "Can't find starting_datetime_ratio")}      

                try {
                  starting_datetime = Date.parse(self.parseWithExpressionCondition(jsonPayload, ex.datetime.starting_datetime)) || Date.now();
                } catch (e) {
                  console.log(e, "Can't parse starting_datetime");
                }

                try {
                  sampling_interval = parseFloat(sampling_interval = self.parseWithExpressionCondition(jsonPayload, ex.datetime.sampling_interval)) || 1.0;
                } catch (e) {
                  console.log(e, "Can't parse sampling_interval");
                } // construct timeseries                  


                for (var n = 0; n < Object.keys(data).length; n++) {
                  timestamps.push(starting_datetime * starting_datetime_ratio + n * sampling_interval);
                }
              } else {
                //TODO: other datetime expressions here
                console.log('This datetime type is not supported yet.');
              } // timeseries: timestamp-value pair     


              if (timestamps && data) {
                for (var m = 0; m < Object.keys(data).length; m++) timeseries.push([timestamps[m], data[m]]);
              }
            } else {// TODO: if data requires no merging and already is in pair
            }

            return timeseries;
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }
  } // helper function for parsing json payload based on expressions and conditions


  parseWithExpressionCondition(jsonPayload, ex_con) {
    let result;

    try {
      jsonPayload = JSON.parse(jsonPayload);
    } catch (e) {} // sanity check


    if (jsonPayload && ex_con && ex_con.expression && ex_con.expression.startsWith('.')) {
      if (ex_con.condition && ex_con.expression.includes('[X]')) {
        let X = this.findIndexOfCondition(jsonPayload, ex_con.condition);
        if (X != -1) ex_con.expression = ex_con.expression.replace('[X]', "[".concat(X, "]"));else return;
      }

      result = this.getEx(jsonPayload, ex_con.expression); // convert to array if split_with character is given      

      if (ex_con.split_with && typeof result === 'string') {
        result = result.split(ex_con.split_with);
      }
    } else {
      return jsonPayload;
    }

    return result;
  } // {
  //   "expression": ".MeasurementData.MeasurementParameter[X].key[0]",
  //   "value": "DateTime"
  // }


  findIndexOfCondition(jsonPayload, conditionJson) {
    let index = -1;

    if (conditionJson && conditionJson.expression && conditionJson.expression.includes('.') && conditionJson.value) {
      let ex = conditionJson.expression;
      let exUntilVariable = ex.split('[X')[0];
      let exAfterVariable = ex.split('X]')[1];
      let arrayUntilVariable = this.getEx(jsonPayload, exUntilVariable);

      for (var i = 0; i < arrayUntilVariable.length; i++) {
        if (exAfterVariable) {
          if (this.getEx(arrayUntilVariable[i], exAfterVariable) == conditionJson.value) {
            index = i;
            break;
          }
        } else {
          if (arrayUntilVariable[i] == conditionJson.value) {
            index = i;
            break;
          }
        }
      }
    }

    return index;
  } // helper function to parse a json data with the given expression
  // ex should not have any variables X, e.g. .MeasurementData.MeasurementParameter[2].key[0]


  getEx(jsonPayload, ex) {
    let result = jsonPayload;
    let splitEx = ex.split('.').slice(1);
    splitEx.map(segment => {
      if (segment.includes('[')) {
        let variable = segment.split('[')[0];
        let index = parseInt(segment.split('[')[1].split(']')[0]);
        if (result !== undefined && result[variable] != undefined && result[variable][index] !== undefined) result = result[variable][index];
      } else {
        if (result !== undefined) {
          result = result[segment];
        }
      }
    });
    return result;
  }

  async fetchCachedURL(url) {
    var cache = JSON.parse(localStorage.getItem('cache') || "{}");
    var json = {};

    if (cache && cache[url]) {
      json = cache[url];
    } else {
      if (!cache) cache = {};

      try {
        var res = await fetch(url, {
          headers: this.iotflows.authHeader
        });
        json = await res.json();

        if (json && json.data && json.data[0]) {
          // add the new result to cache for this url        
          localStorage.setItem('cache', JSON.stringify(cache));
        }
      } catch (e) {
        console.log(e);
      }
    }

    return json;
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, this.state.widget_flows.map(widget_flow => {
      switch (widget_flow.widget_template_uuid) {
        case 'wdgt_line_chart_timeseries_array':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsLineChart.IoTFlowsLineChart, {
            key: this.props.asset_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_line_chart_timeseries_single_point':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsLineChartSinglePoint.IoTFlowsLineChartSinglePoint, {
            key: this.props.asset_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            historicalData: this.state.historicalData[this.props.asset_uuid + '-' + widget_flow.flow_uuid],
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_gauge':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsGauge.IoTFlowsGauge, {
            key: this.props.asset_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            historicalData: this.state.historicalData[this.props.asset_uuid + '-' + widget_flow.flow_uuid],
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_numerical':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsNumerical.IoTFlowsNumerical, {
            key: this.props.asset_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_string':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsString.IoTFlowsString, {
            key: this.props.asset_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });
        // <IoTFlowsHeatmap data={this.state.sat_status_per_day}/>

        case 'wdgt_command':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsCommand.IoTFlowsCommand, {
            key: this.props.asset_uuid + widget_flow.flow_uuid + '_command',
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            auth_header: this.iotflows.authHeader,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_map':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsMap.IoTFlowsMap, {
            key: this.props.asset_uuid + widget_flow.widget_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            historicalData: this.state.historicalData[this.props.asset_uuid + '-' + widget_flow.flow_uuid],
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_pie':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsPie.IoTFlowsPie, {
            key: this.props.asset_uuid + widget_flow.widget_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_multi_column':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsMultiColumn.IoTFlowsMultiColumn, {
            key: this.props.asset_uuid + widget_flow.widget_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        case 'wdgt_multi_line_chart':
          return /*#__PURE__*/_react.default.createElement(_IoTFlowsMultiLineChart.IoTFlowsMultiLineChart, {
            key: this.props.asset_uuid + widget_flow.widget_uuid + widget_flow.flow_uuid,
            name: widget_flow.flow_name,
            widget_settings: widget_flow.widget_settings,
            data: this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]
          });

        default:
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
      }
    }), this.state.asset_info && this.state.widget_template_uuid_of_widget_uuid[this.props.widget_uuid] == "wdgt_asset_info" && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_IoTFlowsAssetInfo.IoTFlowsAssetInfo, {
      key: this.props.asset_uuid + '-' + this.props.widget_uuid,
      asset_info: this.state.asset_info
    })));
  }

}

exports.default = SmartWidget;