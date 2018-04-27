const generalhelper = require("./utils/GeneralHelper");
const constants = require("./constants");
const logr = require("./logging");
const wf = require("./utils/Workflow");



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


const canRolesTransit = (req, res) => {
    const workflow = wf.wf ; 
    const rolesTransitMap = req.body.data ; 
    
    console.log(" req.body.data ", req.body.data);
    res.send (
        rolesTransitMap
    );
}

module.exports = {
    getAvailableWorkflowMetadata: getAvailableWorkflowMetadata,
    canRolesTransit: canRolesTransit
};