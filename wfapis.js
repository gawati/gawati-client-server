const generalhelper = require("./utils/GeneralHelper");
const constants = require("./constants");
const logr = require("./logging");
const wf = require("./utils/Workflow");

var wfAPIs  = {};


/**
 * Receives the Form posting, not suitable for multipart form data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAvailableWorkflowMetadata = (req, res) =>  {
    const workflow = wf.wf;
    res.send(
        workflow.map( (flow) => flow.object.getWorkflowTypeInfo())
    );
};

wfAPIs['/workflows/meta'] = [
    getAvailableWorkflowMetadata
];


module.exports.wfAPIs = wfAPIs;