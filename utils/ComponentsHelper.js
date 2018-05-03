const getCompRef = (eId, compRefs) => {
    let ref = compRefs.filter(ref => {
        return ref.GUID.split("#").pop() == eId;
    });
    return ref[0];
};

const getComponents = (embeddedContents, compRefs) => {
    console.log(" EMBEDDED CONTENTS ", embeddedContents, compRefs);
    let compKeys = Object.keys(embeddedContents).filter(key => key == "embeddedContent");
    let components = compKeys.reduce((r, k) => r.concat(embeddedContents[k]), []);
    
    let newComponents = []; 
    components.forEach(comp => {
        let ref = getCompRef(comp.eId, compRefs);
        newComponents.push({
            index: parseInt(comp.eId.split("-").pop()),
            showAs: ref.showAs,
            iriThis: ref.src,
            origFileName: comp.origFileName,
            fileName: comp.file,
            fileType: comp.fileType,
            type: comp.type
        });
    });
    return newComponents;
};

/**
 * Checks if an existing component with the same attachment `index` exists.
 * Returns the position of the matched component.
 */
const posOfComp = (index, components) => {
    for (var i = 0; i < components.length; i++) {
        if (components[i].index == index) {
            return i;
        }
    }
    return -1;
};

module.exports = {
    getComponents: getComponents,
    posOfComp: posOfComp
};