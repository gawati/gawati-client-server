const workflow = require('gawati-workflow');
const path = require('path');

const wf = workflow.discoverSync(path.join(".", "workflow_configs"))

const nextStates = (docAknType, curWFState, wfArr) => {
    let relevantWF = wfArr.filter(function (el) {
        return el.object.wfInfo.status === 'valid' &&
               el.object.wfInfo.wf.workflow.doctype === docAknType &&
               el.object.wfInfo.wf.workflow.subtype === 'legislation';
    });
    return relevantWF[0].object.getNextStateNames(curWFState);
}

module.exports = {
    wf: wf,
    nextStates: nextStates
};

