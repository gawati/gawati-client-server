const languageCodes = require("../configs/shortLanguageCodes");

const generalhelper = require("./GeneralHelper");

const getLangCodeAlpha3b = (alpha3b) => {
    return languageCodes.langs.lang.find(lingo => lingo["alpha3b"] === alpha3b ) ;
};

const getLangs = () => {
    return languageCodes.langs ; 
};

const getLangDesc = (alpha3b) => {
    let langAlpha = getLangCodeAlpha3b(alpha3b);
    if (langAlpha !== undefined) {
        let descArr = generalhelper.coerceIntoArray(langAlpha.desc);
        let langDesc = descArr.find( desc => desc.lang === alpha3b) || descArr.find( desc => desc.lang === "eng");
        return langDesc;
    }
    return alpha3b;
};

module.exports = {
    getLangCodeAlpha3b: getLangCodeAlpha3b,
    getLangs: getLangs,
    getLangDesc: getLangDesc
};