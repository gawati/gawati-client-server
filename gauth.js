const axios = require('axios');
const winston = require('winston');
const querystring = require('querystring');

const introspectUrl = (authObject) => {
    const url = authObject.url; 
    const realm = authObject.realm; 
    return `${url}/realms/${realm}/protocol/openid-connect/token/introspect` ;
};

const authorization = (authObject) => {
    const user = authObject["clientId"] ;
    const pass = authObject["credentials"]["secret"] ; 
    const base64cred =  Buffer.from(`${user}:${pass}`).toString('base64');
    console.log(" authorization cred ", base64cred);
    return base64cred;
};

const introspectHeader = (authObject) => {
    const authz = authorization(authObject);
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authz}`
    };
};

const introspect = async (authObject, token) => {
    const url = introspectUrl(authObject);
    const authz = authorization(authObject);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authz}`
    };
    const data = {
        'token': token
    };
    try {
        axios.post(
            url, 
            querystring.stringify(data),
            {headers: headers}
        ).then ( (resp) => {
            return resp.data;
        }).catch ( (err) => {
            winston.log(" introspect ", err);
            return err;
        });
    } catch (err) {
        console.log(" Error in introspect ", err);
    }
};



module.exports = {
    introspectUrl: introspectUrl,
    introspect: introspect,
    authorization: authorization
};

