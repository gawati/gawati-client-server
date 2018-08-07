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
    const filelist = walkSync('akn_data', []);
    filelist.forEach(function (file, i) {
        const pdfImage = new PDFImage (file);
        if (fs.existsSync(file)) {
            console.log("converting" + file);
            pdfImage.convertPage(0).then(function (imagePath) {
                console.log("Thumbnail generated: " + i + " of " + filelist.length + " - " + imagePath);
            }), function (err) {
                console.log(err);
            };
        }
        else 
          console.log("Not found");
    })
}

// function createThumbnails () {
//     const file = "E:/gawati/gawati-editor-fe/akn_data/akn/ao/act/legge/2018-06-21/1/ara@/akn_ao_act_legge_2018-06-21_1_ara_main_1.pdf";
//     var pdfImage = new PDFImage(file);
// console.log("Start");
// pdfImage.convertPage(0).then(function (imagePath) {
//   // 0-th page (first page) of the slide.pdf is available as slide-0.png
//   console.log("Converted.");
//   fs.existsSync("akn_data/akn/ao/act/legge/2018-06-21/1/ara@/akn_ao_act_legge_2018-06-21_1_ara_main_1-0.png") // => true
// }, function (err) {
//       console.log(err);
// });
// };

module.exports.createThumbnails = createThumbnails;