const dataServer = require('../configs/dataServer');

const getServer = (name) => {
    return dataServer[name];
};

const getApi = (serverName, apiName) => {
    const server = getServer(serverName);
    const apiCall = server.api[apiName];
    return `${server.serviceEndPoint}${apiCall}`;
}

module.exports = {
    getServer: getServer,
    getApi: getApi
};