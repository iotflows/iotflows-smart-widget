import React from "react";
// var fetch = require('node-fetch');
import { Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles} from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.gray,
    fontWeight: 700,
    fontFamily:'Trebuchet MS',
    fontSize: 11,
    height: '20px',
    padding: '8px',
    paddingLeft: '12px', 
    borderBottom: 'none'    
  },
  body: {
    fontSize: 13,
    fontFamily:'Trebuchet MS',
    height: '24px',
    padding: '8px',
  },
}))(TableCell);

const cellStyle = {
  paddingLeft: '12px', 
  color:'#6b7280'
}

export class IoTFlowsAssetInfo extends React.Component {
  constructor(props) {
    super(props);        
    this.chartComponent = React.createRef();    
  }

  componentDidMount() {       
    
  }

  render() {
    
    let asset_info = this.props.asset_info
    
    return (      
      <>        
          <Card style={{height:'100%', overflow:'scroll', border: 0}} variant="outlined">
            <CardContent style={{textAlign: 'left'}}>
              <div style={{textAlign:'center'}} >
                <img src={asset_info.asset_custom_picture_url || asset_info.machine_picture_url} alt="Machine image" style={{borderRadius:'8px', width: '100%'}}/>
              </div>
              <TableContainer styled={{marginTop:'12px'}}>
                <Table aria-label="data table">
                  <colgroup>
                    <col style={{width:'30%'}}/>
                    <col style={{width:'70%'}}/>
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell style={{paddingLeft: '12px', borderBottom: 'none'}} colSpan={2}>Asset</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody >
                    {asset_info.asset_custom_name &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Name</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.asset_custom_name}</StyledTableCell>
                      </TableRow>
                    }
                    {!asset_info.asset_custom_name && asset_info.machine_name &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Name</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.machine_name}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.asset_custom_description &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Description</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.asset_custom_description}</StyledTableCell>
                      </TableRow>
                    }
                    {!asset_info.asset_custom_description && asset_info.machine_description &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Description</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.machine_description}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.asset_custom_identifier &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>ID</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.asset_custom_identifier}</StyledTableCell>
                      </TableRow>
                    }
                    {!asset_info.asset_custom_identifier && asset_info.machine_identifier &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>ID</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.machine_identifier}</StyledTableCell>
                      </TableRow>
                    }
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Tags</StyledTableCell>
                        <StyledTableCell align="left" >CNC</StyledTableCell>
                      </TableRow>
                    {asset_info.asset_custom_homepage_url &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Homepage URL</StyledTableCell>
                        <StyledTableCell align="left" style={{cursor:'pointer'}} onClick={() => window.open(asset_info.asset_custom_identifier, "_blank")}>{asset_info.asset_custom_identifier}</StyledTableCell>
                      </TableRow>
                    }
                    {!asset_info.asset_custom_homepage_url && asset_info.machine_homepage_url &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Homepage URL</StyledTableCell>
                        <StyledTableCell align="left" style={{cursor:'pointer'}} onClick={() => window.open(asset_info.machine_homepage_url, "_blank")}>{asset_info.machine_homepage_url}</StyledTableCell>
                      </TableRow>
                    }
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell style={{paddingLeft: '12px', borderBottom: 'none'}} colSpan={2}>
                        {'Manufacturer'}&nbsp;&nbsp;&nbsp;
                        {asset_info.manufacturer_is_verified &&
                          <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" fill="#2563eb" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                          </svg>
                        }
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody >
                    {asset_info.manufacturer_name &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Name</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.manufacturer_name}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.manufacturer_description &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Description</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.manufacturer_description}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.manufacturer_homepage_url &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Homepage URL</StyledTableCell>
                        <StyledTableCell align="left" style={{cursor:'pointer'}} onClick={() => window.open(asset_info.manufacturer_homepage_url, "_blank")}>{asset_info.manufacturer_homepage_url}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.manufacturer_support_email &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Support Email</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.manufacturer_support_email}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.manufacturer_support_phone &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Support Phone</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.manufacturer_support_phone}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.manufacturer_support_homepage_url &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Support URL</StyledTableCell>
                        <StyledTableCell align="left" style={{cursor:'pointer'}} onClick={() => window.open(asset_info.manufacturer_support_homepage_url, "_blank")}>{asset_info.manufacturer_support_homepage_url}</StyledTableCell>
                      </TableRow>
                    }
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell style={{paddingLeft: '12px', borderBottom: 'none'}} colSpan={2}>
                        Device
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody >
                    {asset_info.device_name &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Name</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.device_name}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.device_description &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Description</StyledTableCell>
                        <StyledTableCell align="left" >{asset_info.device_description}</StyledTableCell>
                      </TableRow>
                    }
                    {asset_info.device_last_heard &&
                      <TableRow >
                        <StyledTableCell align="left" style={cellStyle}>Last Connection Established</StyledTableCell>
                        <StyledTableCell align="left" >{(asset_info.device_last_heard)}</StyledTableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>         
      </>
    );
  }
}
