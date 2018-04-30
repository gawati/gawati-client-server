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

const error = (message,code = "general") => {
    return {"error": {"code": code, "value": message}};
}

module.exports = {
    coerceIntoArray: coerceIntoArray,
    serverMsg: serverMsg,
    error: error
};
