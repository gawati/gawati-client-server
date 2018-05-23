/**
 * Returns applicable roles for a client
 * @param {*} client name of client
 * @returns array of roles 
 */
const getRolesForClient = (token) => {
  let roles = [];
  let client = token.client_id;

  if (token.resource_access) {
      if (token.resource_access[client]) {
          roles = token.resource_access[client].roles;
      }
  }
  if (token.realm_access) {
      roles = roles.concat(token.realm_access.roles);
  }
  return roles;
};

module.exports = {
    getRolesForClient: getRolesForClient
};