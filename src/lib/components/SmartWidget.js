import React from "react";
import {IoTFlowsLineChart} from './widgets/IoTFlowsLineChart'
import {IoTFlowsLineChartSinglePoint} from './widgets/IoTFlowsLineChartSinglePoint'
import {IoTFlowsGauge} from './widgets/IoTFlowsGauge'
import {IoTFlowsNumerical} from './widgets/IoTFlowsNumerical'
import {IoTFlowsAssetInfo} from './widgets/IoTFlowsAssetInfo'
import {IoTFlowsMap} from './widgets/IoTFlowsMap'
import {loadIoTFlows} from '@iotflows/iotflows-js'
var fetch = require('node-fetch');

export default class SmartWidget extends React.Component {
  constructor(props) {
    super(props);     
    this.state = {
      flow_data: {},
      historicalData: {},
      widget_flows: [],
      asset_info: {},      
      widget_template_uuid_of_widget_uuid: {}
    }
  }

  componentDidMount() {        
    try{this.readRealTime()} catch(e){console.log(e)}       
  }

  async readRealTime() {   
    var self = this
    // connect to the cloud
    self.iotflows = await loadIoTFlows(this.props.username, this.props.password);
    
    // read widget asset info    
    try {
        var res = await fetch(`https://api.iotflows.com/v1/widgets/${self.props.widget_uuid}`, {headers: self.iotflows.authHeader})
        var json = await res.json()        
        if(json && json.data && json.data[0])            
        {                    
          // map widget_template_uuid <-> widget_uuid
          let temp = self.state.widget_template_uuid_of_widget_uuid
          temp[self.props.widget_uuid] = json.data[0].widget_template_uuid        
          self.setState({widget_template_uuid_of_widget_uuid: temp})
          
          // read asset_info
          if(json.data[0].widget_template_uuid === "wdgt_asset_info")
          {
            var res2 = await fetch(`https://api.iotflows.com/v1/assets/${self.props.asset_uuid}`, {headers: self.iotflows.authHeader})
            var json2 = await res2.json()       
            if(json2 && json2.data && json2.data[0])            
            {          
              self.setState({asset_info: json2.data[0]})
            }
          }        
  
        }          
    } catch(e) {console.log(e)}

    try {        
        // read widget_flows info
        var res = await fetch(`https://api.iotflows.com/v1/assets/${self.props.asset_uuid}/widgets/${self.props.widget_uuid}/flows`, {headers: self.iotflows.authHeader})
        var json = await res.json()        
        if(json && json.data && json.data[0])            
        {          
          let widget_flows = json.data
          self.setState({widget_flows: widget_flows})
        
          // find distinct data streams of this widget
          let distinct_data_stream_uuids = []
          widget_flows.map(async widget_flow => {
            if(!distinct_data_stream_uuids.includes(widget_flow.data_stream_uuid)) distinct_data_stream_uuids.push(widget_flow.data_stream_uuid)
          })

          // fetch historical data and parse all flows of each data stream
          distinct_data_stream_uuids.map(async each_data_stream_uuid => {            
            let res2 = await fetch(`https://api.iotflows.com/v1/data_streams/${each_data_stream_uuid}/latest_subtopic_data`, {headers: self.iotflows.authHeader})
            let json2 = await res2.json()
            if(json2 && json2.data && json2.data[0])            
            {          
              json2.data.map(async each_flow_lastest_data => {
                widget_flows.map(async widget_flow => { 
                  // update the flow_data of this flow_uuid in the states 
                  if(!(each_flow_lastest_data.topic) || each_flow_lastest_data.topic.endsWith(widget_flow.flow_mqtt_subtopic))
                  {     
                                    
                    // if an array of historical data is needed, fetch it here                    
                    if (widget_flow.flow_mqtt_payload_parsing_expression.data_type == 'timeseries_single_point')
                    {                      
                      let res3 = await fetch(`https://api.iotflows.com/v1/data_streams/${each_data_stream_uuid}/historical_data?record_limit=50&containing_subtopic=${widget_flow.flow_mqtt_subtopic || ''}`, {headers: self.iotflows.authHeader})
                      let json3 = await res3.json()
                      if(json3 && json3.data && json3.data[0])            
                      {      
                        let result = []
                        json3.data.map(datapoint=>{
                          result.push([(new Date(datapoint.received_at)).getTime(), parseFloat(self.parseWithExpressionCondition(datapoint.data, widget_flow.flow_mqtt_payload_parsing_expression.data)) ])
                        })

                        let historicalData = self.state.historicalData || {}
                        historicalData[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result.reverse()                      
                        self.setState({historicalData}) 
                      }
                    }
                    else if (widget_flow.flow_mqtt_payload_parsing_expression.data_type == 'timeseries_single_coordinate')
                    {                      
                      let res3 = await fetch(`https://api.iotflows.com/v1/data_streams/${each_data_stream_uuid}/historical_data?record_limit=50&containing_subtopic=${widget_flow.flow_mqtt_subtopic || ''}`, {headers: self.iotflows.authHeader})
                      let json3 = await res3.json()
                      if(json3 && json3.data && json3.data[0])            
                      {                              
                        let result = []
                        json3.data.map(datapoint=>{
                          result.push([(new Date(datapoint.received_at)).getTime(), self.parseWithExpressionCondition(datapoint.data, widget_flow.flow_mqtt_payload_parsing_expression.data) ])
                        })                                              
                        let historicalData = self.state.historicalData || {}
                        historicalData[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result.reverse()                      
                        self.setState({historicalData}) 
                      }
                    }
                    else
                    {
                      let result = self.parsePayloadToFlowObject(each_flow_lastest_data.data, widget_flow.flow_mqtt_payload_parsing_expression)
                      let flow_data = self.state.flow_data || {}
                      flow_data[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result                                            
                      self.setState({flow_data}) 
                    }                                  
                  }
                })                          
              })
            }
          }) 

          // Subscribe and parse all flows of each data stream
          widget_flows.map(async widget_flow => {           
            await self.iotflows.subscribe({
              data_stream_uuid: widget_flow.data_stream_uuid,
              subtopic_subscription: true,
              callback: function handler(topic, payload) {                   
                // update the flow_data of this flow_uuid in the states 
                if(!(widget_flow.flow_mqtt_subtopic) || topic.endsWith(widget_flow.flow_mqtt_subtopic))
                {                
                  let result = self.parsePayloadToFlowObject(payload, widget_flow.flow_mqtt_payload_parsing_expression)                  
                  if(result) {
                    let flow_data = self.state.flow_data || {}
                    flow_data[self.props.asset_uuid + '-' + widget_flow.flow_uuid] = result                    
                    self.setState({flow_data})                    
                  }                  
                }                  
              }                  
            })       
          })       
        }                   
      } catch (e) {console.error("Error: can't read the widget_flows info.", e); return}             
            
  }

  // helper function to parse the payload based on the expression object
  parsePayloadToFlowObject(payload, ex)
  {    
    var self = this
    // parse payload
    let jsonPayload = payload
    if(typeof(jsonPayload !== 'object')) try {jsonPayload = JSON.parse(jsonPayload)} catch(e){}

    // construct the timeseries        
    try {             
      if(ex)
      {            
        // JSON sanity
        if(typeof(ex) !== 'object') try {ex = JSON.parse(ex)} catch(e){}
        
        // version check
        if(ex.version !== '1.1') {console.log("Parsing version is not supprted for this widget"); return;}
        
        // data_type
        switch(ex.data_type)
        {  
          case 'datetime':
            var datetime = self.parseWithExpressionCondition(jsonPayload, ex.data) 
            // parse as Date to local
            try {
              datetime = new Date(datetime)
              if(ex.datetime_format)
              {
                switch (ex.datetime_format){
                  case 'time':
                    datetime = datetime.toLocaleTimeString()
                    break;
                  case 'date':
                    datetime = datetime.toLocaleDateString()
                    break;
                  default:
                    datetime = datetime.toLocaleString()
                    break;
                }    
              }
                                         
            } catch(e){}                   
            return datetime
            break;
          
          case 'string':  
            return self.parseWithExpressionCondition(jsonPayload, ex.data)                            
            break;
        
          case 'number':
            var number = self.parseWithExpressionCondition(jsonPayload, ex.data) 
            // parse as float
            try {number = parseFloat(number)}catch(e){}
            // show digits if given
            if(ex.number_digits)
            {
              try {number = number.toFixed(ex.number_digits)}catch(e){}
            }
            return number || 0.0;
            break;

          case 'timeseries_single_point': 
            var number = self.parseWithExpressionCondition(jsonPayload, ex.data) 
            // parse as float          
            try {number = parseFloat(number)}catch(e){}
            // show digits if given
            if(ex.number_digits)
            {
              try {number = number.toFixed(ex.number_digits)}catch(e){}
            }
            // add timestamp
            var now = (new Date()).getTime()
            return [now, number]
            break;

          case 'timeseries_single_coordinate':
            var coordinate = self.parseWithExpressionCondition(jsonPayload, ex.data)             
            // add timestamp
            var now = (new Date()).getTime()
            return [now, coordinate]
            break;

          case 'timeseries_array':
            var timeseries = []
            // merge timestamps and data to form timeseries?
            if(ex.merge_require)
            {
              var data = [] 
              var timestamps = []
                              
              data = self.parseWithExpressionCondition(jsonPayload, ex.data)              

              if(!data) return;
              try{data = data.map(x=>parseFloat(x))}catch(e){}

              if(ex.datetime.type = 'starting_datetime_sampling_interval')
              {
                let starting_datetime = 1.0 //Date.now()
                let sampling_interval = 1.0
                let starting_datetime_ratio = 1.0
                try { 
                  starting_datetime_ratio = ex.datetime.starting_datetime_ratio || 1.0
                } catch(e) {console.log(e, "Can't find starting_datetime_ratio")}      

                try { 
                  starting_datetime = 1.0 //Date(self.parseWithExpressionCondition(jsonPayload, ex.datetime.starting_datetime)) || Date.now()
                } catch(e) {console.log(e, "Can't parse starting_datetime")}    

                try { 
                  sampling_interval = parseFloat(sampling_interval = self.parseWithExpressionCondition(jsonPayload, ex.datetime.sampling_interval)) || 1.0 
                } catch(e) {console.log(e, "Can't parse sampling_interval")}                                                                            

                // construct timeseries                  
                for(var n = 0; n < Object.keys(data).length; n++)
                {
                  timestamps.push( (starting_datetime * starting_datetime_ratio) + (n * sampling_interval) )
                }
                                  
              }
              else {
                //TODO: other datetime expressions here
                console.log('This datetime type is not supported yet.')
              }
                              
              // timeseries: timestamp-value pair     
              if(timestamps && data)              
              {
                for(var m = 0; m < Object.keys(data).length; m++)
                  timeseries.push([timestamps[m], data[m]])              
              }              
            }
            else
            {
              // TODO: if data requires no merging and already is in pair
            }            
            return timeseries;            
        }         
      }                                      
    } catch(e){
      console.log(e); return;
    }

  }

    
  // helper function for parsing json payload based on expressions and conditions
  parseWithExpressionCondition(jsonPayload, ex_con) {    
    let result;    

    try{jsonPayload = JSON.parse(jsonPayload)} catch(e){}
    
    // sanity check
    if(jsonPayload && ex_con && ex_con.expression && ex_con.expression.startsWith('.'))
    {      
      if(ex_con.condition && ex_con.expression.includes('[X]'))
      {
        let X = this.findIndexOfCondition(jsonPayload, ex_con.condition)
        if(X != -1)
          ex_con.expression = ex_con.expression.replace('[X]',`[${X}]`)      
        else
          return      
      }        
      result = this.getEx(jsonPayload, ex_con.expression)
      
      // convert to array if split_with character is given      
      if(ex_con.split_with && typeof(result)==='string')
      {        
        result = result.split(ex_con.split_with)
      }          
    }
    else
    {
      return jsonPayload;
    }    
    return result;
  }


  // {
  //   "expression": ".MeasurementData.MeasurementParameter[X].key[0]",
  //   "value": "DateTime"
  // }
  findIndexOfCondition(jsonPayload, conditionJson) {
    let index = -1;
    if(conditionJson && conditionJson.expression && conditionJson.expression.includes('.') && conditionJson.value)
    {
      let ex = conditionJson.expression
      let exUntilVariable = ex.split('[X')[0]
      let exAfterVariable = ex.split('X]')[1]      
      let arrayUntilVariable = this.getEx(jsonPayload, exUntilVariable)
      for(var i = 0; i < arrayUntilVariable.length; i++)
      {
        if(exAfterVariable)
        {          
          if(this.getEx(arrayUntilVariable[i], exAfterVariable) == conditionJson.value)
          {
            index = i
            break
          }
        }
        else
        {
          if(arrayUntilVariable[i] == conditionJson.value)
          {
            index = i
            break
          }
        }        
      }
    }
    return index
  }

  // helper function to parse a json data with the given expression
  // ex should not have any variables X, e.g. .MeasurementData.MeasurementParameter[2].key[0]
  getEx(jsonPayload, ex)
  {
    let result = jsonPayload;
    let splitEx = ex.split('.').slice(1)
    splitEx.map(segment => {
      if(segment.includes('['))
      {
        let variable = segment.split('[')[0]
        let index = parseInt(segment.split('[')[1].split(']')[0])
        result = result[variable][index]
      }
      else
      {
        result = result[segment]
      }      
    })
    return result
  }


  render() {
    
    return (
      <>          
        {this.state.widget_flows.map(widget_flow => {    
          switch(widget_flow.widget_template_uuid) {
            case 'wdgt_line_chart_timeseries_array':
              return <IoTFlowsLineChart 
                      key={this.props.asset_uuid+widget_flow.flow_uuid} 
                      name={widget_flow.flow_name} 
                      widget_settings={widget_flow.widget_settings}
                      data={this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]}/>                
              
            case 'wdgt_line_chart_timeseries_single_point':
              return <IoTFlowsLineChartSinglePoint                       
                      key={this.props.asset_uuid+widget_flow.flow_uuid} 
                      name={widget_flow.flow_name} 
                      widget_settings={widget_flow.widget_settings}
                      historicalData={this.state.historicalData[this.props.asset_uuid + '-' + widget_flow.flow_uuid]} 
                      data={this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]}/>      

            case 'wdgt_gauge':
              return <IoTFlowsGauge 
                      key={this.props.asset_uuid+widget_flow.flow_uuid} 
                      name={widget_flow.flow_name} 
                      widget_settings={widget_flow.widget_settings}
                      historicalData={this.state.historicalData[this.props.asset_uuid + '-' + widget_flow.flow_uuid]} 
                      data={this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]}/>                                
            case 'wdgt_numerical':
              return <IoTFlowsNumerical
                      key={this.props.asset_uuid+widget_flow.flow_uuid} 
                      name={widget_flow.flow_name}                                                                   
                      widget_settings={widget_flow.widget_settings}
                      data={this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]}/>                    
            case 'wdgt_map':
              return <IoTFlowsMap
                      key={this.props.asset_uuid+widget_flow.widget_uuid+widget_flow.flow_uuid} 
                      name={widget_flow.flow_name}                                                                   
                      widget_settings={widget_flow.widget_settings}
                      historicalData={this.state.historicalData[this.props.asset_uuid + '-' + widget_flow.flow_uuid]} 
                      data={this.state.flow_data[this.props.asset_uuid + '-' + widget_flow.flow_uuid]}/>                    
            default:
              return <></>              
          }            
        })}      

        {          
          ( this.state.asset_info && this.state.widget_template_uuid_of_widget_uuid[this.props.widget_uuid] == "wdgt_asset_info" &&
            <><IoTFlowsAssetInfo
                key={this.props.asset_uuid + '-' + this.props.widget_uuid}  
                asset_info={this.state.asset_info}/>            
            </>
          )                                         
        }
        
      </>
    );
  }
}