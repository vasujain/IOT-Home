var config = {
    "appServer": "$appServer",
    "appToken": "$appToken",
}

const endpoint = atob(config.YXBwU2VydmVy) + atob(config.dmFsaWRhdG9y);
const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);

lastUpdated();
displayAllDevices();

function displayAllDevices() {
    var request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function () {

        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            var devicesList = JSON.parse(request.response);
            var devices = devicesList.result.deviceList;
            devices.forEach(device => {
                deviceStatus(device.deviceId);
            });
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
            app.appendChild(errorMessage);
        }
    }
    request.send(JSON.stringify({
        method: "getDeviceList"
    }));
}

function deviceStatus(currentDevice) {
    var request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function () {
        // Parsing Device JSON data 
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            var devicesList = JSON.parse(request.response);
            var responseData = devicesList.result.responseData;
            var finalData = JSON.parse(responseData.replace(/\\/g, ""));
            var deviceInfo = finalData.system.get_sysinfo;
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('id', 'currentDevice');

            const h1 = document.createElement('h1');
            h1.textContent = deviceInfo.alias;

            if (deviceInfo.relay_state == 1) {
                deviceInfo_relay_state = "<span style='color:green'><b> ON </b></span>";
                deviceStateToggleValue = 0;
            } else {
                deviceInfo_relay_state = "<span style='color:red'><b> OFF </b></span>";
                deviceStateToggleValue = 1;
            }
            var deviceAlias = deviceInfo.alias.replace(/ /g, "_");
            const deviceType = document.createElement('p');
            deviceType.innerHTML += "<b>" + deviceInfo.dev_name + "</b>";
            deviceType.innerHTML += "<br><b>Device Type: </b>" + deviceInfo.type;
            deviceType.innerHTML += "<br><b>Device model: </b>" + deviceInfo.model;
            deviceType.innerHTML += "<br><b>SW Ver: </b>" + deviceInfo.sw_ver;
            deviceType.innerHTML += "<br> <b>Status: </b>" + deviceInfo_relay_state;
            deviceType.innerHTML += "<br> <br> <center><button type='button' onclick=toggleDevice(\"" + currentDevice + "\",\"" + deviceStateToggleValue + "\",\"" + deviceAlias + "\"); style ='background-image: linear-gradient(120deg, #9e9e9eed 0%, #9e9e9e66 100%);font-size: 16px;margin: 4px 2px;color: white;padding: 15px 32px;border-radius: 15px;'>Toggle Device State !</button></center>"
            container.appendChild(card);
            card.appendChild(h1);
            card.appendChild(deviceType);
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
            app.appendChild(errorMessage);
        }
    }
    request.send(JSON.stringify({
        method: "passthrough",
        params: {
            deviceId: currentDevice,
            requestData: "{\"system\":{\"get_sysinfo\":null},\"emeter\":{\"get_realtime\":null}}"
        }
    }));
}

function toggleDevice(currentDevice, deviceStateToggleValue, deviceAlias) {
    console.log("Flipped " + deviceAlias + " to " + +deviceStateToggleValue);
    var request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function () {
        //
    }

    var requestStateData = "{\"system\":{\"set_relay_state\":{\"state\":" + deviceStateToggleValue + "}}}"
    request.send(JSON.stringify({
        method: "passthrough",
        params: {
            deviceId: currentDevice,
            requestData: requestStateData
        }
    }));

    // More of a hack since it takes almost 1 second for the status to update from TP APIs
    setTimeout(function () {
        location.reload();
        lastUpdated();
    }, 1000);
}

function lastUpdated() {
    var imgStyle = "<img onclick='location.reload()' src='img/refresh.png' style='width:24px; display:inline-block; margin:0; margin-left:10px; padding-left:4px; cursor:pointer'>";
    var updateContainer = document.getElementById('updated');
    updateContainer.innerHTML = "Last updated " + new Date().toLocaleString() + imgStyle;
    updateContainer.style.textAlign = "center";
    updateContainer.style.fontSize = "1.5pc";
}