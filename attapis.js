const axios = require("axios");
const fs = require("fs-extra");
const FormData = require('form-data');
const logr = require("./logging");
const path = require("path");
const mkdirp = require("mkdirp");

const urihelper = require("./utils/UriHelper");
const generalhelper = require("./utils/GeneralHelper");
const componentsHelper = require("./utils/ComponentsHelper");
const servicehelper = require("./utils/ServiceHelper");
const constants = require("./constants");
/**
 * Restructures the formObject to a standard form.
 * @param {object} req.body object 
 */
const constructFormObject = (bodyObject) => {
    var formObject = bodyObject;
    var newObj = Object.assign({}, formObject);
    for (const key in formObject) {
        if (key.startsWith("doc")) {
            newObj[key] = JSON.parse(formObject[key]);
        }
    }
    return formObject = {
        pkgIdentity: newObj,
        pkgAttachments: JSON.parse(formObject["pkgAttachments"])
    };
};

/**
 * Receives the submitted data. This particular API expects multipart form data. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveFilesSubmitData = (req, res, next) => {
    // convert the formdata multipart object to use the json object form expected in formObject.
    console.log(" IN: receiveFilesSubmitData");
    res.locals.formObject = constructFormObject(req.body) ;
    res.locals.formFiles = req.files ; 
    next();
};

/**
 * Get the next file index available for embeddedContents
 * Checks components stored in eXist, not in the filesystem.
 * We allow only upto MAX_ATTACHMENTS (Default = 10)
 *
 * @param {*} existing components
 */
const getFileIndexDB = (components) => {
    let ind = 1;
    let indices = components.map(comp => comp.index);
    while (ind <= constants.MAX_ATTACHMENTS) {
        if (indices.includes(ind)) {
            ind += 1;
        } else {
            break;
        }
    }
    return ind;
};

/**
 * Writes the uploaded attachment to the filesystem.
 *
 * @param {*} file parameters
 * @param {*} response message
 */
const writeFile = (fileParams, responseMsg) => {
    const {index, newPath, newFileName, buffer, attTitle, embeddedIri, origName, fileExt} = fileParams;
    return new Promise(function(resolve, reject) {
        fs.writeFile(path.join(newPath, newFileName), buffer,  function(err) {
            if (err) {
                logr.error(generalhelper.serverMsg("ERROR while writing to file "), err) ;
                responseMsg.step_1.status = "failure";
                responseMsg.step_1.msg.push(
                    {
                        "originalname": origName,
                        "err": err
                    }
                );
                reject(err);
            } else {
                logr.info(generalhelper.serverMsg(" File was written to file system "));
                responseMsg.step_1.msg.push(
                    {
                        "index": index,
                        "showAs": attTitle,
                        "iriThis": embeddedIri,
                        "origFileName": origName,
                        "fileName": newFileName,
                        "fileType": fileExt,
                        "type": "embedded"
                    }
                );
                responseMsg.step_1.status = "write_to_fs_success";
                resolve(responseMsg);
            }
        });
    });
};

/**
 * Writes a binary file to file system.
 * Single uploads only, they are processed from the file
 * provided by multer
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const writeSubmittedFiletoFS = (req, res, next) => {
    console.log(" IN: writeSubmittedFiletoFS", res.locals.formFiles.length, 
        res.locals.formObject.pkgIdentity["docIri"].value);
    let aknObj = res.locals.formObject.pkgIdentity;
    let attachments = res.locals.formObject.pkgAttachments.value;
    let iri = aknObj["docIri"].value;
    let formFile = res.locals.formFiles[0];

    let arrIri = iri.split("/");
    let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
    let newPath = path.join(constants.AKN_ATTACHMENTS(), subPath);
    // to fix
    //let aknFileName = urihelper.fileNameFromIRI(iri, "doc");
    var responseMsg = {
        "step_1": {"status": "", "msg": [] },
        "step_2": {"status": "", "msg": [] }
    };
    mkdirp(newPath, function(err) {
        if (err) {
            logr.error(generalhelper.serverMsg(" ERROR while creating folder "), err) ;
            responseMsg.step_1.status = "failure";
            responseMsg.step_1.msg.push(
                {
                    "originalname":  formFile.originalname,
                    "err": err
                }
            );
            res.locals.binaryFilesWriteResponse = responseMsg;
            next();
        } else {
            const fileParams = {
                index: aknObj["index"],
                attTitle: aknObj["title"],
                origName: formFile.originalname,
                mimeType: formFile.mimetype,
                buffer: formFile.buffer,
                fileExt: path.extname(formFile.originalname),
                filePrefix: urihelper.fileNamePrefixFromIRI(iri),
                newPath: newPath,
            };
            //Generate index for new uploads.
            if (!fileParams.index) {
                fileParams.index = getFileIndexDB(attachments);
            }
            fileParams.embeddedIri = `${iri}_${fileParams.index}`;
            fileParams.newFileName = `${fileParams.filePrefix}_${fileParams.index}${fileParams.fileExt}`;

            writeFile(fileParams, responseMsg)
                .then(result => {
                    console.log(" RESPONSE MSG = ", JSON.stringify(result));
                    res.locals.binaryFilesWriteResponse = responseMsg;
                    next();
                })
                .catch(err => {
                    res.locals.binaryFilesWriteResponse = responseMsg;
                    console.log(err);
                });
        }
    });
};

const addAttInfoToAknObject = (req, res, next) => {
    console.log(" IN: addAttInfoToAknObject");
    const writeResponse = res.locals.binaryFilesWriteResponse;
    var attachments = res.locals.formObject.pkgAttachments.value || [];

    if (writeResponse.step_1.status === "write_to_fs_success") {
        // see msg object shape below in comment.
        const writeInfo = writeResponse.step_1.msg[0];
        /*
        responseMsg.step_1.msg.push (
            {
                'title': attTitle,
                'originalname': origName, 
                'newname': newFileName,
                'extension': fileExt,
                'iri': embeddedIri
            }
        )
        ;
        */
        var pos = componentsHelper.posOfComp(writeInfo.index, attachments);

        //Case Update: Remove the old item before pushing the new one.
        if (pos > -1) {
            attachments.splice(pos, 1);
        }
        attachments.push(writeInfo);
    }

    res.locals.attPackage = {
        "docIri": res.locals.formObject.pkgIdentity["docIri"].value,
        "attachments": attachments
    };

    res.locals.returnResponse = {success: "finished"};
    next();
};



/**
 * Receives the submitted data. 
 * Data: attachment info to be removed and parent document data.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const receiveAttSubmitData = (req, res, next) => {
    console.log(" IN: receiveAttSubmitData");
    res.locals.emDoc = req.body.data.emDoc;
    res.locals.formObject = req.body.data.pkg;
    next();
};

/**
 * Removes the given file from the filesystem.
 *
 * @param {*} full path
 * @param {*} response message
 */
const removeFile = (fullPath, responseMsg) => {
    return new Promise(function(resolve, reject) {
        fs.unlink(fullPath, (err) => {
            if (err) {
                logr.error(generalhelper.serverMsg("ERROR while removing file "), err);
                responseMsg.step_1.status = "failure";
                responseMsg.step_1.msg.push(
                    {
                        "File": fullPath,
                        "err": err
                    }
                );
                reject(err);
            } else {
                logr.info(generalhelper.serverMsg(" File was written to file system "));
                responseMsg.step_1.msg.push(
                    {
                        "File": fullPath
                    }
                );
                responseMsg.step_1.status = "remove_from_fs_success";
                resolve(responseMsg);
            }
        });
    });
};

/**
 * Remove attachment from FS.
 */
const removeAttFromFS = (req, res, next) => {
    console.log("IN: removeAttFromFS");
    let fullPath = getAttFSPath(res.locals.emDoc, res.locals.formObject);
    var responseMsg = {
        "step_1": {"status": "", "msg": [] }
    };

    removeFile(fullPath, responseMsg)
        .then(result => {
            console.log(" RESPONSE MSG = ", JSON.stringify(result));
            res.locals.binaryFileRemoveResponse = responseMsg;
            next();
        })
        .catch(err => {
            res.locals.binaryFileRemoveResponse = responseMsg;
            console.log(err);
        });
};

const deleteAttFromFS =(attachments) => {
    console.log("attachments are " + JSON.stringify(attachments));
    for(let att of attachments){

        let arrIri = att.iriThis.split("/");
        let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
        let attPath = path.join(constants.AKN_ATTACHMENTS(), subPath);

        let fileExt = path.extname(att.origFileName);
        let filePrefix = urihelper.fileNamePrefixFromIRI(att.iriThis);
        let attFileName = `${filePrefix}${fileExt}`;

        let fullPath = path.join(attPath, attFileName);

        var responseMsg = {
        "step_1": {"status": "", "msg": [] }
    };

        removeFile(fullPath, responseMsg)
            .then(result => {
                console.log(" RESPONSE MSG = ", JSON.stringify(result));
            })
            .catch(err => {
                console.log(err);
            });
        }
}
/**
 * Remove attachment from attachments list.
 */
const removeAttInfoFromAknObject = (req, res, next) => {
    console.log("IN: removeAttInfoFromAknObject");
    const removeResponse = res.locals.binaryFileRemoveResponse;
    var attachments = res.locals.formObject.pkgAttachments.value || [];

    if (removeResponse.step_1.status === "remove_from_fs_success") {
        const fileInfo = res.locals.emDoc;
        var pos = componentsHelper.posOfComp(fileInfo.index, attachments);

        //Case Remove: Remove the attachment.
        if (pos > -1) {
            attachments.splice(pos, 1);
        }
    }

    res.locals.attPackage = {
        "docIri": res.locals.formObject.pkgIdentity["docIri"].value,
        "attachments": attachments
    };

    res.locals.returnResponse = {success: "finished"};
    next();
};

/**
 * Saves the attachments for a particular document to the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const saveAttToXmlDb = (req, res, next) => {
    console.log(" IN: saveAttToXmlDb");
    const saveAttApi = servicehelper.getApi("xmlServer", "saveAttachments");
    const {url, method} = saveAttApi;
    axios({
        method: method,
        url: url,
        data: res.locals.attPackage
    }).then(
        (response) => {
            res.locals.returnResponse = response.data;
            next();
        }
    ).catch(
        (err) => {
            res.locals.returnResponse = err;
            next();
        }
    );
};

/**
 * Retrieves the FS full path of an existing attachment.
 */
const getAttFSPath = (emDoc, pkg) => {
    console.log(" IN: getAttFSPath");
    let aknObj = pkg.pkgIdentity;
    let iri = aknObj["docIri"].value;

    let arrIri = iri.split("/");
    let subPath = arrIri.slice(1, arrIri.length - 1 ).join("/");
    let attPath = path.join(constants.AKN_ATTACHMENTS(), subPath);

    let fileExt = path.extname(emDoc.origFileName);
    let filePrefix = urihelper.fileNamePrefixFromIRI(iri);
    let attFileName = `${filePrefix}_${emDoc.index}${fileExt}`;

    let fullPath = path.join(attPath, attFileName);
    return fullPath
}

/**
 * Calls the extractor service to get text for the attachment.
 */
const extractText = (req, res, next) => {
    console.log(" IN: extractText");
    let fullPath = getAttFSPath(res.locals.emDoc, res.locals.formObject);
    const extractTextApi = servicehelper.getApi("extractText", "pdf2txt");
    const {url, method} = extractTextApi;

    let data = new FormData();
    data.append('file', fs.createReadStream(fullPath));

    axios({
        method: method,
        url: url,
        data: data,
        headers: data.getHeaders()
    }).then(
        (response) => {
            res.locals.text = response.data["text"];
            res.locals.returnResponse = {
                "step_1": {"status": "extract_text_success"}
            };
            next();
        }
    ).catch(
        (err) => {
            res.locals.returnResponse = {
                "step_1": {"status": "failure"}
            };
            next();
        }
    );
};

/**
 * Saves the full text for attachment to the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const saveFTtoXmlDb = (req, res, next) => {
    console.log(" IN: saveFTtoXmlDb");
    let iri = res.locals.emDoc.iriThis;

    if (res.locals.returnResponse.step_1.status === 'extract_text_success') {
        const saveFTApi = servicehelper.getApi("xmlServer", "saveXml");
        const {url, method} = saveFTApi;

        let data = {
            'fileXml': urihelper.fileNameFromIRI(iri, "xml"),
            'update': true,
            'iri': iri,
            'data': res.locals.text,
        }
        axios({
            method: method,
            url: url,
            data: data
        }).then(
            (response) => {
                res.locals.returnResponse = response.data;
                next();
            }
        ).catch(
            (err) => {
                res.locals.returnResponse = err;
                next();
            }
        );
    } else {
        res.locals.returnResponse = {
            'error': { 'code': iri, 'message': 'Error while extracting text' }
        }
        next();
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const returnResponse = (req, res) => {
    console.log(" IN: returnResponse");    
    res.json(res.locals.returnResponse);
};

module.exports = {
    //Create and Update attachment methods
    receiveFilesSubmitData: receiveFilesSubmitData,    
    writeSubmittedFiletoFS: writeSubmittedFiletoFS,
    addAttInfoToAknObject: addAttInfoToAknObject,

    //Remove attachment methods
    receiveAttSubmitData: receiveAttSubmitData,
    removeAttFromFS: removeAttFromFS,
    removeAttInfoFromAknObject: removeAttInfoFromAknObject,
    deleteAttFromFS: deleteAttFromFS,

    //Extract text from attachment methods
    extractText: extractText,
    saveFTtoXmlDb: saveFTtoXmlDb,

    //Common methods
    saveAttToXmlDb: saveAttToXmlDb,
    returnResponse: returnResponse
};