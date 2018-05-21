const axios = require("axios");
const aknobject = require("../aknobject");
const aknhelper = require("../utils/AknHelper");
const servicehelper = require("../utils/ServiceHelper");
const wf = require("../utils/Workflow");
const serializeError = require("serialize-error");

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
 * Prepare the transition object.
 */
const prepareTransitObj = (docJson, status, iri) => {
  const aknDoc = docJson.akomaNtoso;
  const aknType = aknhelper.getAknRootDocType(aknDoc);
  const aknSubType = aknDoc[aknType].name;

  // find the workflow for the type and subtype
  const workflow = wf.getWorkflowforTypeAndSubType(aknType, aknSubType);

  if (workflow !== null) {
    // now get the required state
    const stateTo = status;
    const stateToObj = workflow.getState(stateTo);
    if (stateToObj == null) {
        const msg = `ERROR: Invalid state ${stateTo}; Not defined in workflow for ${aknType} - ${aknSubType}` ;
        console.log(msg);
        return null;
    } else {
        const refactoredState = stateRefactorPermissionsForStorage(stateToObj);
        const transitObj = {
            docIri: iri,
            aknType: aknType,
            aknSubType: aknSubType,
            state: refactoredState
        };
        return transitObj;
    }
  }
}

/**
 * Transition the document to `status`.
 */
const transit = (docJson, status, iri) => {
  const transitObj = prepareTransitObj(docJson, status, iri);
  if (transitObj) {
    //Call the eXist-db api that does the transit
    const apiObj = servicehelper.getApi("xmlServer", "transit");
    const data = transitObj;
    axios({
      method: apiObj.method,
      url: apiObj.url,
      data: data
    }).then(
      (response) => {
        console.log(response.data);
      }
    ).catch(
      (err) => {
        const {message, stack} = serializeError(err);
        console.log({error: {code: "EXCEPTION", value: message + " \n " + stack}});
      }
    );
  }
}

/**
 * Get JSON for iri.
 * Returns a promise.
 */
const loadJSONForIri = (iri) => {
  console.log(" IN: loadJSONForIri");
  const loadApi = servicehelper.getApi("xmlServer", "getXml");
  const {url, method} = loadApi;
  return axios({
    method: method,
    url: url,
    data: {iri}
  });
}

const updateStatus = (statusObj) => {
  const {status, iri} = statusObj;
  loadJSONForIri(iri)
  .then(res => {
    transit(res.data, status, iri);
  })
  .catch(err => console.log(err));
}

module.exports.updateStatus = updateStatus;