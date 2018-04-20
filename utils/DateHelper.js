const moment = require("moment");

const parseDateISODatePart = (dateStr) => {
    return moment(dateStr, "YYYY-MM-DD").format("YYYY-MM-DD");
};

const ISOStringDateToDate = (dateStr) => 
     moment(dateStr).toDate();

module.exports = {
    parseDateISODatePart: parseDateISODatePart,
    ISOStringDateToDate: ISOStringDateToDate
}