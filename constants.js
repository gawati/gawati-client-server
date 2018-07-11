const path = require("path");
const API_PROTOCOL = process.env.API_PROTOCOL || 'http' ;
const API_HOST = process.env.API_HOST || 'localhost' ;
const API_PORT = process.env.API_PORT || '8080' ;
const MAX_ATTACHMENTS = 10;

/** Folders */
const CONFIG_FOLDER = 'configs' ;

const AKN_ATTACHMENTS = () => 
    "./akn_data" ;
const TMP_PKG_FOLDER = () => path.join(".", "tmp");

const API_SERVER_BASE = () =>
    API_PROTOCOL + '://' + API_HOST + ":" + API_PORT + '/exist/restxq';

const PROCESS_NAME = "GAWATI-CLIENT-SERVER";

// see http://schema.akomantoso.com/index.html?type=element&item=akomaNtoso
const AKN_DOC_TYPES = require('./configs/aknDocTypes').aknDocTypes;
const DOC_TYPES = require('./configs/docTypes').docTypes;

module.exports = {
    CONFIG_FOLDER: CONFIG_FOLDER,
    API_SERVER_BASE: API_SERVER_BASE,
    AKN_ATTACHMENTS: AKN_ATTACHMENTS,
    TMP_PKG_FOLDER: TMP_PKG_FOLDER,
    PROCESS_NAME: PROCESS_NAME,
    MAX_ATTACHMENTS: MAX_ATTACHMENTS,
    AKN_DOC_TYPES: AKN_DOC_TYPES,
    DOC_TYPES: DOC_TYPES
};