# iotflows-smart-widget

https://iotflows.com

IoTFlows Smart Widget React Component.

With Smart Widget, you can create various real-time and historical widgets. Each Smart Widget requires a smart_widget_uuid and a asset_uuid. 

## Installation
Use `npm` to install the iotflows.js module:

```
npm install @iotflows/iotflows-smart-widget --save
```

## Usage

```javascript
const {SmartWidget} = require('@iotflows/iotflows-smart-widget')
<SmartWidget
    username='CLIENT_ID'
    password='CLIENT_SECRET'
    widget_uuid='wdg_xxxxxxxxxxxxxxxxxxxxxx'
    asset_uuid='as_xxxxxxxxxxxxxxxxxxxxxxx'
/> 
```

Make sure to change `CLIENT_ID` and `CLIENT_SECRET` with the proper credentials obtained from IoTFlows console. 
These credentials can be either one of these options:
1. A [Device Client](https://docs.iotflows.com/real-time-data-streams-alerts-and-actions/create-a-device-api-key) that has permission to interact with the resources available in its project, or
2. An [Organization IoT API KEY](https://docs.iotflows.com/cloud-node-red-servers/subscribe-and-publish-to-real-time-data-streams#create-an-iot-api-key) that can have read-only or read/write permissions to the entire organization resources
3. A [User Client](https://rest-api-docs.iotflows.com/#tag/Users/paths/%7E1v1%7E1users%7E1authorize/get) that is authorized to interact with the permitted resources of the user. This option is most useful when you need to build a web or mobile app. For this option, you need to register your Application in IoTFlows and authenticate users using [OAuth2](https://oauth.net/2). With the obtained [JWT](https://jwt.io/), you can perform a [Basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) HTTP request to generate a User Client.

---
