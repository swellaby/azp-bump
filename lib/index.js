'use strict';

const fs = require('fs');
const Glob = require('glob').Glob;
const utils = require('./utils');

const validateFileGlobs = (fileGlobs) => {
    return (fileGlobs && Array.isArray(fileGlobs) && fileGlobs.length >= 1);
};

const updateTaskManifest = (filePath, fileContents, opts) => new Promise((resolve, reject) => {
    try {
        const task = JSON.parse(fileContents);
        const initialVersion = utils.getTaskVersion(task);
        const bumpedVersion = utils.bumpVersion(task, initialVersion, opts);
        fs.writeFile(filePath, JSON.stringify(task, null, opts.indent), err => {
            if (!err) {
                resolve({ filePath, initialVersion, bumpedVersion });
            } else {
                reject(err);
            }
        });
    } catch (err) {
        reject(err);
    }
});

/**
 *
 * @param {string[]} filePaths - The task manifest file paths.
 * @param {Object} opts - The bumping options
 */
const bumpTaskManifests = (filePaths, opts) => {
    return filePaths.map(filePath => new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (fileErr, fileContents) => {
            if (!fileErr) {
                updateTaskManifest(filePath, fileContents, opts)
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            } else {
                reject(fileErr);
            }
        });
    }));
};

const bumpTaskGlob = (fileGlob, opts) => new Promise((resolve, reject) => {
    const glob = new Glob(fileGlob);
    glob.on('end', matches => Promise.all(bumpTaskManifests(matches, opts))
        .then(result => resolve(result))
        .catch(err => reject(err))
    );
    glob.on('error', (err) => {
        let errMessage = 'Failed to match glob. Error details: ';
        errMessage += (err && err.message) ? err.message : 'unknown';
        reject(new Error(errMessage));
    });
});

const getBumpedTasks = () => {
    throw new Error('Not yet implemented');
};

/**
 *
 * @param {string[]} fileGlobs - The file globs for the task manifests.
 * @param {Object} opts - The bumping options
 */
const bumpTaskManifestFiles = (fileGlobs, opts) => new Promise((resolve, reject) => {
    if (!validateFileGlobs(fileGlobs)) {
        reject(new Error('Invalid arguments. Valid array of glob of task manifests must be specified'));
    }

    opts = utils.validateOptions(opts);
    Promise.all(fileGlobs.map(fileGlob => bumpTaskGlob(fileGlob, opts)))
        .then((bumpedFiles) => resolve(bumpedFiles))
        .catch((err) => reject(new Error(`Fatal error occurred while attempting to bump file. Details: ${(err && err.message) ? err.message : 'unknown'}`)));
});

module.exports = {
    getBumpedTasks: getBumpedTasks,
    bumpTaskManifestFiles: bumpTaskManifestFiles
};