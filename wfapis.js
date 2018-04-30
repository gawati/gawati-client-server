const axios = require("axios");
const gen = require('./utils/GeneralHelper');
const logr = require("./logging");
const wf = require("./utils/Workflow");
const servicehelper = require("./utils/ServiceHelper");
const urihelper = require("./utils/UriHelper");
const serializeError = require("serialize-error");
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

const stateXml = (name, title, level, initial, permissions) => 
    `<state name="${name}" title="${title}" level="${level}" color="${initial}">
        ${permissions}
     </state>
    `;

const permissionXml = (name, roles) =>
    `<permission name="${name}" roles="${roles}" />`
    ;

const workflowStateToXML = (stateObj) => {
    let {name, title, level, initial} = stateObj;
    const permissionsArr = stateObj.permission.map( (eachPerm) => {
        const {name, roles} = eachPerm;
        return permissionXml(name, roles);
    });
    const permissions = permissionsArr.join("\n");
    const stateXmlString  = stateXml(name, title, level, initial, permissions);
    console.log("workflowStateToXML ", stateXmlString);
    return stateXmlString;
};

/**
 * The roles are split by spaces, we convert that into an array
 * @param {object} state 
 */
const stateRefactorPermissionsForStorage = (state) => {
    let newState = {...state};
    newState.permission = state.permission.map( (aPerm) => {
        const rolesArr = aPerm.roles.split(/\s+/);
        return {
            name: aPerm.name,
            roles: rolesArr
        };
    });
    return newState;
}

/**
 * Calls the eXist-db api that does the transit
 * @param {*} req 
 * @param {*} res 
 */
const doTransit = (req, res) => {
    const apiObj = servicehelper.getApi("xmlServer", "transit");
    const data = res.locals.transitObject;
    axios({
        method: apiObj.method,
        url: apiObj.url,
        data: data
    }).then(
        (response) => {
            res.json(response.data);
        }
    ).catch(
        (err) => {
            const {message, stack} = serializeError(err);
            res.json({error: {code: "EXCEPTION", value: message + " \n " + stack}});
        }
    );
}

/**
 * Builds the object that is passed to the eXist-db api
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getTransitToStateInformation = (req, res, next) => {
    //{from: from, to: to, name: name};
    let wfData = res.locals.formObject;
    const {transitionName, stateTo, docIri, aknType, aknSubType} = wfData;
    // find the workflow for the type and subtype
    const workflow = wf.getWorkflowforTypeAndSubType(aknType, aknSubType);
    if (workflow !== null) {
        // now get the required state
        const stateToObj = workflow.getState(stateTo);
        if (stateToObj == null) {
            const msg = `ERROR: Invalid state ${stateTo}; Not defined in workflow for ${aknType} - ${aknSubType}` ;
            logr.error(msg);
            res.json(gen.error(msg));
        } else {
            const refactoredState = stateRefactorPermissionsForStorage(stateToObj);
            const data = {
                docIri: docIri,
                fileName: urihelper.fileNameFromIRI(docIri, "xml"),
                aknType: aknType,
                aknSubType: aknSubType,
                state: refactoredState
            };
            res.locals.transitObject = data;
            next();
        }
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
    getTransitToStateInformation: getTransitToStateInformation,
    doTransit: doTransit
};