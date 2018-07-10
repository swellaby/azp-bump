'use strict';

const fs = require('fs');
const Glob = require('glob').Glob;
const utils = require('./utils');

/**
 * @typedef {Object} opts
 * @property {string|number} indent - The type of indent spacing to use in task manifests.
 * @property {boolean} quiet - Set to true to supress log output.
 * @property {string} versionPropertyType - Controls what type of property the task version values will be set to.
 * @property {string} type - The version type to bump.
 */

/**
 * @typedef {Object} BumpedFileResult
 * @property {string} filePath - The path to the task manifest file.
 * @property {string} initialVersion - The original version contained in the task manifest file.
 * @property {string} bumpedVersion - The bumped version of the file now in the task manifest file.
 */

/**
 * @typedef {Object} BumpedTask
 * @property {string} filePath - The path to the task manifest file.
 * @property {string} initialVersion - The original version contained in the task manifest file.
 * @property {string} bumpedVersion - The bumped version of the file now in the task manifest file.
 * @property {object} task - The JSON object representation of the task manifest file contents.
 */

/**
 * @typedef {Object} Task
 * @property {{ Major: number|string, Minor: number|string, Patch: number|string }} version - The version of the task.
 */

/**
 * @typedef {Object} TaskManifestFile
 * @property {string} filePath - The path to the task manifest file.
 * @property {string} fileContents - The contesnts of the task manifest file.
 */

/**
 * @typedef {Object} BumpResult
 * @property {BumpedFileResult[]} bumpedFiles - The details of each bumped task manifest file
 * @property {string} bumpType - The type of version bump that was used.
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
 * Helper function for writing the updated task back to manifest file.
 * @param {BumpedTask} bumpedTask - The bumped task.
 * @param {opts} opts - The provided bump options.
 *
 * @private
 * @returns {Promise<BumpedFileResult>}
 */
const writeBumpedTaskToFile = (bumpedTask, opts) => new Promise((resolve, reject) => {
    fs.writeFile(bumpedTask.filePath, JSON.stringify(bumpedTask.task, null, opts.indent), err => {
        if (!err) {
            const filePath = bumpedTask.filePath;
            const initialVersion = bumpedTask.initialVersion;
            const bumpedVersion = bumpedTask.bumpedVersion;
            resolve({ filePath, initialVersion, bumpedVersion });
        } else {
            reject(err);
        }
    });
});

/**
 * Helper function for updating a task manifest.
 * @param {TaskManifestFile} taskManifestFile - The task manifest file
 * @param {opts} opts - The provided bump options.
 *
 * @private
 * @returns {Promise<BumpedTask>}
 */
const bumpTaskObjects = (taskManifestFile, opts) => new Promise((resolve, reject) => {
    try {
        const task = JSON.parse(taskManifestFile.fileContents);
        const initialVersion = utils.getTaskVersion(task);
        const bumpedVersion = utils.bumpVersion(task, initialVersion, opts);
        const filePath = taskManifestFile.filePath;
        resolve({ filePath, task, initialVersion, bumpedVersion });
    } catch (err) {
        reject(err);
    }
});

/**
 * Reads the contents of a task manifest file from disk.
 *
 * @param {string} filePath - The path to the task manifest file.
 * @returns {TaskManifestFile}
 */
const readTaskManifestFile = (filePath) => new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (fileErr, fileContents) => {
        if (!fileErr) {
            resolve({ filePath, fileContents});
        } else {
            reject(fileErr);
        }
    });
});

/**
 * Helper function for bumping task manifest files.
 * @private
 *
 * @param {string[]} filePaths - The task manifest file paths.
 * @param {opts} opts - The bumping options
 *
 * @returns {Promise<BumpedFileResult>[]}
 */
const bumpTaskManifests = (filePaths, opts) => new Promise((resolve, reject) => {
    Promise.all(filePaths.map(filePath => readTaskManifestFile(filePath)))
        .then(manifests => Promise.all(manifests.map(manifest => bumpTaskObjects(manifest, opts)))
            .then(bumpedTasks => Promise.all(bumpedTasks.map(bumpedTask => writeBumpedTaskToFile(bumpedTask, opts)))
                .then(result => resolve(result))))
        .catch(err => reject(err));
});

/**
 * Helper function for bumping a glob of task manifest files.
 * @private
 *
 * @param {string} fileGlob - Glob of task manifest files.
 * @param {opts} opts - The bumping options
 *
 * @returns {Promise<BumpedFileResult[]>[]}
 */
const bumpTaskGlob = (fileGlob, opts) => new Promise((resolve, reject) => {
    const glob = new Glob(fileGlob);
    glob.on('end', matches => bumpTaskManifests(matches, opts)
        .then(result => resolve(result))
        .catch(err => reject(err))
    );
    glob.on('error', err => reject(buildError('Failed to match glob. Error details: ', err)));
});

/**
 * Bumps the versions contained inside task manifest files.
 *
 * @param {string[]} fileGlobs - The file globs for the task manifests to be bumped.
 * @param {opts} [opts] - The bumping options
 *
 * @returns {Promise<BumpResult>}
 */
const bumpTaskManifestFiles = (fileGlobs, opts) => new Promise((resolve, reject) => {
    if (!validateFileGlobs(fileGlobs)) {
        return reject(new Error('Invalid arguments. Valid array of glob of task manifests must be specified'));
    }
    opts = utils.validateOptions(opts);
    Promise.all(fileGlobs.map(fileGlob => bumpTaskGlob(fileGlob, opts)))
        .then(bumpedFiles => resolve({ bumpedFiles: [].concat(...bumpedFiles), bumpType: opts.type }))
        .catch(err => reject(buildError('Fatal error occurred while attempting to bump file. Details: ', err)));
});

/**
 * Bumps the version of the provided task.
 * @param {Task} task - The task to bump.
 * @param {string} [bumpType] - The version bump type.
 *
 * @throws {Error} - Will throw an error if the provided task is not valid.
 */
const bumpTask = (task, bumpType) => {
    const opts = { type: bumpType };
    utils.validateReleaseType(opts);
    const initialVersion = utils.getTaskVersion(task);
    utils.bumpVersion(task, initialVersion, opts);
};

/**
 * Bumps the version of the provided tasks.
 * @param {Task[]} tasks - The tasks to bump.
 * @param {string} [bumpType] - The version bump type.
 *
 * @throws {TypeError} - Will throw an error if the provided tasks parameter is not a valid array of tasks.
 */
const bumpTasks = (tasks, bumpType) => {
    if (!tasks || !Array.isArray(tasks)) {
        throw new TypeError('Invalid argument. First parameter must be valid array of tasks.');
    }

    tasks.forEach(task => {
        bumpTask(task, bumpType);
    });
};

module.exports = {
    bumpTask: bumpTask,
    bumpTasks: bumpTasks,
    bumpTaskManifestFiles: bumpTaskManifestFiles
};