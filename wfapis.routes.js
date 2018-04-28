const wfapis = require("./wfapis");

var wfAPIs  = {};
const BASE_URI = "/workflows"

wfAPIs[`${BASE_URI}/meta`] = {
    method: "get", 
    stack: [
        wfapis.getAvailableWorkflowMetadata
    ]
};

wfAPIs[`${BASE_URI}/transit`] = {
    method: "post",
    stack: [
        wfapis.receiveSubmitData,
        wfapis.getTransitToStateInformation
    ]
};


module.exports.wfAPIs = wfAPIs;