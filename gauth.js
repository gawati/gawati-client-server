const axios = require('axios');
const winston = require('winston');
const querystring = require('querystring');

/**
 * Returns the Token introspect URL for Keycloak. 
 * Expects a keycloak Object rendered out of the KeyCloak JSON file
 * @param {*} authObject 
 * @returns URL as a string
 */
const introspectUrl = (authObject) => {
    const url = authObject.url; 
    const realm = authObject.realm; 
    return `${url}/realms/${realm}/protocol/openid-connect/token/introspect` ;
};

/**
 * Returns the authorization header string required for making calls to the KeyCloak API. 
 * Uses the information provided in the KeyCloak JSON file to make the decision.
 * @param {*} authObject 
 * @returns Authorization header as a string
 */
const authorization = (authObject) => {
    const user = authObject["clientId"] ;
    const pass = authObject["credentials"]["secret"] ; 
    const base64cred =  Buffer.from(`${user}:${pass}`).toString('base64');
    return base64cred;
};

/**
 * 
 * @param {*} authObject 
 */
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
        const response = await axios.post(
                url, 
                querystring.stringify(data),
                {headers: headers}
            );
        return response.data ? response.data : response;
    } catch (err) {
        return err;
    }
};

/**
 * express js middleware function to validate the Client token's validity
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function authTokenValidate(req, res, next) {
    const data = req.body; 
    const token = req.token;
    try {
        const introspectedObject = await gauth.introspect(authJSON, token);
        if (introspectedObject.active) {
            if (introspectedObject.active === true) {
                res.locals.gawati_auth = introspectedObject;
                next();
            } else {
                winston.log("info", "auth_token_inactive: the auth token is not active anymore");
                res.json(
                    {"error": 
                        {"code": "auth_token_inactive"}
                    });
            }
        }
    } catch (err) {
        res.json({"error": err});
    }
} ;



module.exports = {
    introspectUrl: introspectUrl,
    introspect: introspect,
    authorization: authorization,
    authTokenValidate: authTokenValidate
};

