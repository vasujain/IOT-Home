# home simualator app

- [View the tutorial](https://github.com/vasujain/IOT-Home/blob/master/README.md)

- [View the demo](https://github.com/vasujain/IOT-Home/tree/master/assets/video/iothome.mov)

# Steps
1. Create an account at https://www.tplinkcloud.com/
2. Authenticate to TP-Link cloud API and get a token
3. Get the end point URL and Device ID
4. Put the token in scripts.js and get it started.

Use sample curl:

```
curl -X POST \
  https://wap.tplinkcloud.com \
  -H 'Content-Type: application/json' \
  -d '{
 "method": "login",
 "params": {
 "appType": "Kasa_Android",
 "cloudUserName": "YOUR_CLOUD_USER_NAME",
 "cloudPassword": "YOUR_CLOUD_USER_PWD",
 "terminalUUID": "MY_UUID_v4"
 }
}'
```
