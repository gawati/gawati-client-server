const wfapis = require("./wfapis");

var wfAPIs  = {};
const BASE_URI = "/workflows"

/*
Returns default Workflow and Permissions for state 'draft' and doc type.
Input json object submitted to the API:
{
    "data": {
        "aknType": "act",
        "aknSubType": "legge"
    }
}
*/
wfAPIs[`${BASE_URI}/defaults`] = {
    method: "post",
    stack: [
        wfapis.getDefaults
    ]
};

/*
Returns metadata about configured workflows in the server. 
No input parameters
*/
wfAPIs[`${BASE_URI}/meta`] = {
    method: "get", 
    stack: [
        wfapis.getAvailableWorkflowMetadata
    ]
};

/*
Does a document transition from one state to another
Input json object submitted to the API:

{
    "data": {
        "docIri": "/akn/ke/act/legge/1970-06-03/Cap_44/eng@/!main",
        "aknType": "act",
        "aknSubType": "legge",
        "stateFrom": "draft",
        "stateTo": "editable",
        "transitionName": "make_editable"
    }
}
*/
wfAPIs[`${BASE_URI}/transit`] = {
    method: "post",
    stack: [
        wfapis.receiveSubmitData,
        wfapis.getTransitToStateInformation,
        wfapis.doTransit
    ]
};


module.exports.wfAPIs = wfAPIs;