const dataServer = require("../configs/dataServer");
const tcpp = require('tcp-ping');
const urlParser = require('url');

const getServer = (name) => {
    return dataServer[name];
};

const getApi = (serverName, apiName) => {
    const server = getServer(serverName);
    const apiCall = server.api[apiName];
    return {method: apiCall.method, url: `${server.serviceEndPoint}${apiCall.url}` };
};

//Check if dependent services are up
const checkServices = () => {
    let services = Object.keys(dataServer).forEach(service => {
        const ep = getServer(service).serviceEndPoint;
        const parsedUrl = urlParser.parse(ep);
        tcpp.probe(parsedUrl['hostname'], parsedUrl['port'], function(err, available) {
            if (!available)
                console.log(` SERVICE '${service}' is not running`);
        });
    });
}

module.exports = {
    getServer: getServer,
    getApi: getApi,
    checkServices: checkServices
};