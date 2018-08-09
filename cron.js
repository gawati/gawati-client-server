/**
 * This module exposes the cron processes run on the server
 * It can be started with a standalone node instance:
 * 
 * .. code-block::bash
 *      node cron.js
 * 
 * or with the main service by passing WITH_CRON=1 as a environment prefix
 */
const schedule = require("node-schedule");
const thumbnailGen = require("./thumbnails.js");

const NODE_ENV = process.env.NODE_ENV || "production";

console.log(`Starting in ${NODE_ENV} mode`);

/*
* Run every 12 hours
*/
const CRON_THUMBNAIL_CRON_SIGNATURE = "0 0 12 * * *";

var cmsCacheCron = schedule.scheduleJob(
    CRON_THUMBNAIL_CRON_SIGNATURE,
    thumbnailGen.createThumbnails
);
// call it the first time when the cron is started
thumbnailGen.createThumbnails();

