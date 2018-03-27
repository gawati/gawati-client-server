const workflow = require('gawati-workflow');
const path = require('path');

const wf = workflow.discover(path.join(".", "workflow_configs"))
    .catch( (err) => {
        return err;
    });

wf.then(
    (code) => {
        if (code.Error && code.errno) {
            console.log(" ERROR = ", code);
        } else {
            console.log(" CODE = ", code);
        }
    }
);



