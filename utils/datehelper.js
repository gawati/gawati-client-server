const moment = require("moment");

const parseDateISODatePart = (dateStr) => {
    return moment(dateStr, "YYYY-MM-DD").format("YYYY-MM-DD");
};


module.exports = {
    parseDateISODatePart: parseDateISODatePart
}