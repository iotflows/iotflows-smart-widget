import React from "react";
import "./styles.css";
import {TextField, Button, Grid, Input} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

export class IoTFlowsCommand extends React.Component {
  constructor(props) {
    super(props);        
    this.state = { 
      data: "",
      inputData: "",
      loading: false,
      action_name: "",
      open: false,
      message: ''      
    }
  }

  componentDidMount()
  {
    // fetch the action name
    try{
      fetch(`https://api.iotflows.com/v1/actions/${this.props.widget_settings.actions[0].action_uuid}`, {headers: this.props.auth_header})
        .then(res => res.json())
        .then(json => this.setState({action_name: json.action_name}));      
    }
    catch(e){}
    
  }

  static getDerivedStateFromProps(nextProps, prevState){    
    if(nextProps.data !== undefined && nextProps.data!==prevState.data){      
      return { data: nextProps.data};
    }
    else return null;
  }

  

  render() {
            

    return (
          <div style={{display:'flex',  flexDirection:'column', justifyContent: 'center', alignItems: 'center',  height:'100%'}}>                              
          <div style={{fontSize:'1em', fontWeight:'400', color:'#6b7280', fontFamily: 'sans-serif'}}>{this.state.action_name}</div>          
          <div style={{fontSize:'.9em', fontWeight:'400', color:'gray', fontFamily: 'sans-serif'}}>{this.props.name}: {this.state.data}</div>
          
          <br/>
          <Stack direction="row" spacing={2}>
            <Input 
              size="small" 
              defaultValue={''} 
              inputProps={this.state.inputData} 
              onChange={(e) => this.setState({inputData: e.target.value})}
            />
            <LoadingButton 
              size="small" 
              loading={this.state.loading} 
              variant="outlined"
              onClick={() => {
                this.setState({
                  loading: true
                }, async () => {     
                  
                  try{
                      var res = await fetch(`https://api.iotflows.com/v1/actions/${this.props.widget_settings.actions[0].action_uuid}`, {
                        method: 'POST',                        
                        headers: this.props.auth_header,
                        body: JSON.stringify({data: this.state.inputData})
                      });
                      this.setState({loading: false})
                      if(res.ok)
                      {                      
                        var json
                        try {json = await res.json()}                       
                        catch(e){}                      
                        if(json && json.message)                      
                          this.setState({message: `Successfully sent to device. Returned message: ${json.message}`, open: true})
                        else
                          this.setState({message: `Successfully sent to device.`, open: true})
                      }
                      else                    
                        this.setState({message: "Device offline or unreachable.", open: true})                                     
                    }
                    catch(e)
                    {
                      this.setState({message: "Action failed.", open: true})                                     
                    }
                });
              }}>
              Run
            </LoadingButton>            
            <Snackbar
              open={this.state.open}
              autoHideDuration={5000}
              onClose={() => {this.setState({open:false})}}
              message={this.state.message}                            
            />
          </Stack>
        </div>
    );
  }
}


//