const coerceIntoArray = (obj) => {
    return Array.isArray(obj) ? obj : [obj] || [];
};

module.exports = {
    coerceIntoArray: coerceIntoArray
};
