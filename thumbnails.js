/*jslint es6 */
const path = require("path");
const fs = require("fs");
const appconstants = require("./constants.js");
var PDFImage = require("pdf-image").PDFImage;

const walkSync = function(dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist = walkSync(dir + '/' + file, filelist);
      }
      else {
          if (path.extname(file).toLowerCase() === ".pdf") {
              filelist.push(dir + '/' + file);
          }
      }
    });
    return filelist;
  };


/**
 * Queries the service for the filter cache api.
 * This is called by the CRON service
 */
function createThumbnails() {
    console.log("Thumbnails:");
    const filelist = walkSync(appconstants.AKN_ATTACHMENTS(), []);
    filelist.forEach(function (file, i) {
        const pdfImage = new PDFImage (file);
        if (fs.existsSync(file)) {
            console.log("Converting " + file);
            pdfImage.convertPage(0).then(function (imagePath) {
                console.log("Thumbnail generated: " + (i + 1) + " of " + filelist.length + " - " + imagePath);
                if (i == filelist.length - 1) {
                    console.log("***End of Thumbnail Job***");
                }
            }), function (err) {
                console.log(err);
            };
        }
        else 
          console.log("Not found");
    })
}

module.exports.createThumbnails = createThumbnails;