const workflow = require('gawati-workflow');
const path = require('path');

/**
 * We call the disoverSync api here to load the workflows
 * This is called at startup time and not at runtime, and so is non-blocking, despite
 * being a synchronous API
 */
const wf = workflow.discoverSync(path.join(".", "workflow_configs"))

/**
 * Returns the state information for a workflow - for a specified docType and subType 
 * comboination.  Expects the current state, and an array containing loaded workflows
 * as additional inputs.
 * @param {*} docAknType 
 * @param {*} subtype 
 * @param {*} curWFState 
 * @param {*} wfArr 
 */
const getWFStateInfo = (docAknType, subtype, curWFState, wfArr) => {
    //Get the relevant Workflow config for the current doc type and subtype
    console.log(" getWfStateinfo docAknType, subtype, curWFState, wfArr = ", docAknType, subtype, curWFState, wfArr);
    var relevantWF = wfArr.filter(function (el) {
        return el.object.wfInfo.status === 'valid' &&
               el.object.wfInfo.wf.workflow.doctype === docAknType &&
               el.object.wfInfo.wf.workflow.subtype === subtype;
    });

    return {
        nextStates: relevantWF[0].object.getNextStateNames(curWFState),
        allStates: relevantWF[0].object.getStates(),
        transitionsFromState: relevantWF[0].object.getTransitionsForFromState(curWFState)
    }
}

module.exports = {
    wf: wf,
    getWFStateInfo: getWFStateInfo
};