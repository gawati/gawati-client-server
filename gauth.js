const axios = require('axios');
const winston = require('winston');
const querystring = require('querystring');
const serializeError = require('serialize-error');

const AUTH_EXCEPTION = "auth_exception";
const AUTH_TOKEN_INACTIVE = "auth_token_inactive";
const AUTH_TOKEN_INVALID = "auth_token_invalid";

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

/**
 * Given a keycloak json object and token , validates the token 
 * by introspecting it
 * @param {*} authObject 
 * @param {*} token 
 */
const introspect = async (authObject, token) => {
    const url = introspectUrl(authObject);
    const authz = authorization(authObject);
    const headers = introspectHeader(authObject);
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
 * express js middleware function to validate the Client token's validity. 
 * Should be placed before functions in the call stack. 
 * This middle ware API expects an options object which has an 'authJSON' property that contains the KeyCloak json object. It sets the decoded authentication token into ``res.locals.gawati_auth``.
 * To use this as an express JS middleware you need to invoke it via an anonymous function.
 * @example
 *   const AUTH_OPTIONS = {'authJSON': authJSON};
 *   router.post("/doc/file/open",
 *           jsonParser,
 *          [
 *               function (req, res, next) {
 *                   return gauth.authTokenValidate(req, res, next, AUTH_OPTIONS)
 *               },
 *               terminal
 *           ]
 *   );
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} options 
 */
const authTokenValidate = async (req, res, next, options) => {
    const data = req.body; 
    const token = req.token;
    try {
        const introspectedObject = await introspect(options.authJSON, token);
        if (introspectedObject.active) {
            if (introspectedObject.active === true) {
                res.locals.gawati_auth = introspectedObject;
                // returned a valid introspection response, so proceed
                next();
            } else {
                winston.log("info", "auth_token_inactive: the auth token is not active anymore");
                res.json(
                    {"error": 
                        {"code": AUTH_TOKEN_INACTIVE}
                    });
            }
        } else {
            winston.log("info", "auth_token_invalid: an invalid auth token was provided");
            res.json(
                {"error": 
                    {"code": AUTH_TOKEN_INVALID}
                }
            );
        }
    } catch (err) {
        winston.log("error", "authTokenValidate exception ", err);
        res.json({"error": {"code": AUTH_EXCEPTION, "value": serializeError(err)}});
    }
} ;




module.exports = {
    introspectUrl: introspectUrl,
    introspect: introspect,
    authorization: authorization,
    authTokenValidate: authTokenValidate
};

