const appconstants = require("../constants");

const coerceIntoArray = (obj) => {
    return Array.isArray(obj) ? obj : [obj] || [];
};

/**
 * This prefixes log messages with the process name
 * @param {*} message 
 */
const serverMsg = (message) => {
    return `${appconstants.PROCESS_NAME}: ${message}`;
};

module.exports = {
    coerceIntoArray: coerceIntoArray,
    serverMsg: serverMsg
};
