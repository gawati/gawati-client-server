const getCompRef = (eId, compRefs) => {
    let ref = compRefs.filter(ref => {
        return ref.GUID.split('#').pop() == eId;
    });
    return ref[0];
}

const getComponents = (embeddedContents, compRefs) => {
    let compKeys = Object.keys(embeddedContents).filter(key => key == 'embeddedContent');
    let components = compKeys.reduce((r, k) => r.concat(embeddedContents[k]), []);
    
    let newComponents = []; 
    components.forEach(comp => {
        let ref = getCompRef(comp.eId, compRefs);
        newComponents.push({
            index: parseInt(comp.eId.split('-').pop()),
            showAs: ref.showAs,
            iriThis: ref.src,
            origFileName: comp.origFileName,
            fileName: comp.file,
            fileType: comp.fileType,
            type: comp.type
        })
    });
    return newComponents;
};

module.exports = {
    getComponents: getComponents
};