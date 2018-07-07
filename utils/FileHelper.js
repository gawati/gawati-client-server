const fs = require("fs-extra");
const mkdirp = require("mkdirp");
/**
 * Promisified File functions
 */

/**
 * Writes a given string/buffer to file.
 */
const writeFile = (data, filename) => {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filename, data, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

/**
 * Copy files from src to dest.
 */
const copyFiles = (src, dest) => {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(src)) {
      fs.copy(src, dest, function(err) {
        if (err) reject(err);
        else resolve(true);
      })
    } else {
      resolve(true);
    }
  });
}

/**
 * Remove file/folder at path.
 * Removes files in folder recursively (like rm -rf)
 */
const removeFileFolder = (path) => {
  return new Promise(function(resolve, reject) {
    fs.remove(path, function(err) {
      if (err) reject(err);
      else resolve(true);
    })
  });
}

/**
 * Create directory
 */
const createFolder = (path) => {
  return new Promise(function(resolve, reject) {
    mkdirp(path, function(err) {
      if (err) reject(err);
      else resolve(true);
    })
  });
}

module.exports = {
    createFolder: createFolder,
    removeFileFolder: removeFileFolder,
    copyFiles: copyFiles,
    writeFile: writeFile
};