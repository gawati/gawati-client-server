const logr = require("./logging");
const wf = require("./utils/Workflow");

/**
 * Receives the Form posting, not suitable for multipart form data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveSubmitData = (req, res, next) =>  {
    console.log(" IN: receiveSubmitData");
    const formObject = req.body.data ; 
    res.locals.formObject = formObject; 
    next();
};


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


const doTransit = (req, res) => {
    //{from: from, to: to, name: name};
    let wfData = res.locals.formObject;
    const {transitionName, stateTo, docIri, aknType, aknSubType} = wfData;
    // find the workflow for the type and subtype
    const workflow = wf.getWorkflowforTypeAndSubType(aknType, aknSubType);
    if (workflow !== null) {
        // now get the required state
        res.json(workflow.getState(stateTo));
    } else {
        res.json({error: "No matching workflow"});
    }
};

const canRolesTransit = (req, res) => {
    const workflow = wf.wf ; 
    const rolesTransitMap = req.body.data ; 
    
    console.log(" req.body.data ", req.body.data);
    res.send (
        rolesTransitMap
    );
};

module.exports = {
    receiveSubmitData: receiveSubmitData,
    getAvailableWorkflowMetadata: getAvailableWorkflowMetadata,
    canRolesTransit: canRolesTransit,
    doTransit: doTransit
};