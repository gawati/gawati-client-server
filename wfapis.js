const axios = require("axios");
const gen = require("./utils/GeneralHelper");
const logr = require("./logging");
const wf = require("./utils/Workflow");
const servicehelper = require("./utils/ServiceHelper");
const qh = require("./utils/QueueHelper");
const serializeError = require("serialize-error");
const mq = require("./docPublishServices/queues");
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
 * Default Workflow and Permissions:
 * - state: 'draft'
 * - doctype, subtype: from the first workflow object in the array
 * - wfStateInfo: Get state info for the above doctype and subtype
 * - permissions: Get default permissions for 'draft' state
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getDefaults = (req, res) =>  {
    const {aknType, aknSubType} = req.body.data;
    const wfArr = wf.wf;
    const wfDefault = {state: {status: 'draft', 'label': 'Draft'}};
    const wfStateInfo = Object.assign({}, wfDefault, wf.getWFStateInfo(aknType, aknSubType, 'draft', wfArr));
    const draftObj = wfStateInfo.allStates.find(state => state.name == 'draft');

    permissions = {
        permission: draftObj.permission
    }
    res.send({workflow: wfStateInfo, permissions})
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
};

/**
 * Calls the eXist-db api that does the transit
 * @param {*} req 
 * @param {*} res 
 */
const doTransit = (req, res) => {
    console.log(" IN: doTransit");
    const apiObj = servicehelper.getApi("xmlServer", "transit");
    const data = res.locals.transitObject;
    axios({
        method: apiObj.method,
        url: apiObj.url,
        data: data
    }).then(
        (response) => {
            const {docIri: iri, state} = data;
            // Publishes the document iri on the IRI_Q if document has transited to under_processing due to a publish request
            if (state.name === 'under_processing') {
                qh.publishOnIriQ(iri)
            }
            res.json(response.data);
        }
    ).catch(
        (err) => {
            const {message, stack} = serializeError(err);
            res.json({error: {code: "EXCEPTION", value: message + " \n " + stack}});
        }
    );
};

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


module.exports = {
    receiveSubmitData: receiveSubmitData,
    getAvailableWorkflowMetadata: getAvailableWorkflowMetadata,
    getTransitToStateInformation: getTransitToStateInformation,
    doTransit: doTransit,
    getDefaults: getDefaults
};