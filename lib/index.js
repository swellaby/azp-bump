'use strict';

// const fs = require('fs');
// const Glob = require('glob').Glob;
// const utils = require('./utils');

// const validateFileGlobs = (fileGlobs) => {
//     if (!fileGlobs || !Array.isArray(fileGlobs) || fileGlobs.length < 1) {
//         return false;
//     }

//     return true;
// };

// /**
//  *
//  * @param {string[]} files - The task manifest files
//  * @param {Object} opts - The bumping options
//  */
// const bumpTaskManifestFiles = (files, opts) => {
//    files.map(file => {

//    });
// };

// const bumpTaskGlob = (fileGlob, opts) => {
//     return new Promise((resolve, reject) => {
//         const glob = new Glob(fileGlob);
//         glob.on('end', (err, matches) => {
//             bumpTaskManifestFiles(matches, opts);
//             resolve();
//         });
//         glob.on('error', (err) => {
//             let errMessage = 'Failed to match glob. Error details: ';
//             errMessage += (err && err.message) ? err.message : 'unknown';
//             reject(new Error(errMessage));
//         });
//     });
// };

const getBumpedTasks = () => {
    throw new Error('Not yet implemented');
};

/**
 *
 * @param {string[]} fileGlobs - The file globs for the task manifests.
 * @param {Object} opts - The bumping options
 */
// const bumpTaskManifests = (fileGlobs, opts) => {
const bumpTaskManifests = () => {
    // return new Promise((resolve, reject) => {
    //     if (!validateFileGlobs(fileGlobs)) {
    //         reject(new Error('Invalid arguments. Valid glob of task manifests must be specified'));
    //     }

    //     opts = utils.validateOptions(opts);
    //     Promise.all(fileGlobs.map(fileGlob => bumpTaskGlob(fileGlob, opts)).then((promises) => {

    //     }).catch((err) => {

    //     }));
    // });

    throw new Error('Not yet implemented');
};

module.exports = {
    getBumpedTasks: getBumpedTasks,
    bumpTaskManifests: bumpTaskManifests
};