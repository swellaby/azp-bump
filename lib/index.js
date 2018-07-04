'use strict';

const fs = require('fs');
const Glob = require('glob').Glob;
const utils = require('./utils');

/**
 * @typedef opts
 * @type {Object}
 * @property {string|number} indent - The type of indent spacing to use in task manifests.
 * @property {boolean} quiet - Set to true to supress log output.
 * @property {string} versionPropertyType - Controls what type of property the task version values will be set to.
 * @property {string} type - The version type to bump.
 */

/**
 * @typedef bumpedFileResult
 * @type {Object}
 * @property {string} filePath - The path to the task manifest file.
 * @property {string} initialVersion - The original version contained in the task manifest file.
 * @property {string} bumpedVersion - The bumped version of the file now in the task manifest file.
 */

/**
 * Helper function that builds an Error with an aggregated error message.
 * @private
 *
 * @param {string} baseErrorMessage - The base error message to use.
 * @param {Error} err - The original error encountered.
 * @returns {Error}
 */
const buildError = (baseErrorMessage, err) => {
    const errorMessageDetails = (err && err.message) ? err.message : 'unknown';
    const errorMessage = `${baseErrorMessage}${errorMessageDetails}`;
    return new Error(errorMessage);
};

/**
 * Helper function for validating the file globs.
 * @param {string[]} fileGlobs - The set of file globs.
 *
 * @private
 * @returns {boolean}
 */
const validateFileGlobs = (fileGlobs) => {
    return (fileGlobs && Array.isArray(fileGlobs) && fileGlobs.length >= 1);
};

/**
 * Helper function for updating a task manifest.
 * @param {string} filePath - The path to task manifest file
 * @param {string} fileContents - The contents of the task manifest file.
 * @param {opts} opts - The provided bump options.
 *
 * @private
 * @returns {Promise<bumpedFileResult>}
 */
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
 * Helper function for bumping task manifest files.
 * @private
 *
 * @param {string[]} filePaths - The task manifest file paths.
 * @param {opts} opts - The bumping options
 *
 * @returns {Promise<bumpedFileResult>[]}
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

/**
 * Helper function for bumping a glob of task manifest files.
 * @private
 *
 * @param {string} fileGlob - Glob of task manifest files.
 * @param {opts} opts - The bumping options
 *
 * @returns {Promise<bumpedFileResult[]>[]}
 */
const bumpTaskGlob = (fileGlob, opts) => new Promise((resolve, reject) => {
    const glob = new Glob(fileGlob);
    glob.on('end', matches => Promise.all(bumpTaskManifests(matches, opts))
        .then(result => resolve(result))
        .catch(err => reject(err))
    );
    glob.on('error', err => reject(buildError('Failed to match glob. Error details: ', err)));
});

const getBumpedTasks = () => {
    throw new Error('Not yet implemented');
};

/**
 * Bumps the versions contained inside task manifest files.
 *
 * @param {string[]} fileGlobs - The file globs for the task manifests to be bumped.
 * @param {opts} opts - The bumping options
 *
 * @returns {Promise<{ bumpedFiles: bumpedFileResult[], bumpType: string }>}
 */
const bumpTaskManifestFiles = (fileGlobs, opts) => new Promise((resolve, reject) => {
    if (!validateFileGlobs(fileGlobs)) {
        reject(new Error('Invalid arguments. Valid array of glob of task manifests must be specified'));
    }

    opts = utils.validateOptions(opts);
    Promise.all(fileGlobs.map(fileGlob => bumpTaskGlob(fileGlob, opts)))
        .then(bumpedFiles => resolve({ bumpedFiles: [].concat(...bumpedFiles), bumpType: opts.type }))
        .catch(err => reject(buildError('Fatal error occurred while attempting to bump file. Details: ', err)));
});

module.exports = {
    getBumpedTasks: getBumpedTasks,
    bumpTaskManifestFiles: bumpTaskManifestFiles
};