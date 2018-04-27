const wfapis = require("./wfapis");

var wfAPIs  = {};
const BASE_URI = "/workflows"

wfAPIs[`${BASE_URI}/meta`] = {
    method: "get", 
    stack: [
        wfapis.getAvailableWorkflowMetadata
    ]
};

wfAPIs[`${BASE_URI}/canTransit`] = {
    method: "post",
    stack: [
        wfapis.canRolesTransit
    ]
};


module.exports.wfAPIs = wfAPIs;