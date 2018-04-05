const workflow = require('gawati-workflow');
const path = require('path');

const wf = workflow.discoverSync(path.join(".", "workflow_configs"))

const getWFStateInfo = (docAknType, subtype, curWFState, wfArr) => {
    //Get the relevant Workflow config for the current doc type and subtype
    var relevantWF = wfArr.filter(function (el) {
        return el.object.wfInfo.status === 'valid' &&
               el.object.wfInfo.wf.workflow.doctype === docAknType
            //    &&
            //    el.object.wfInfo.wf.workflow.subtype === subtype;
    });

    return {
        nextStates: relevantWF[0].object.getNextStateNames(curWFState),
        allStates: relevantWF[0].object.getStates()
    }
}

module.exports = {
    wf: wf,
    getWFStateInfo: getWFStateInfo
};