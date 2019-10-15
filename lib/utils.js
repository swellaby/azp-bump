'use strict';

const semver = require('semver');

const defaultReleaseType = 'patch';
const defaultJsonIndent = 2;
const defaultVersionPropertyType = 'number';
const stringVersionPropertyType = 'string';

/**
 * Helper function for validating the bump release type.
 * @param {Object} opts - The options for this plugin.
 */
const validateReleaseType = (opts) => {
    if (!opts.type || !semver.inc('1.0.0', opts.type)) {
        opts.type = defaultReleaseType;
    }
};

/**
 * Helper function for validating the json indent value.
 * @param {Object} opts - The options for this plugin.
 */
const validateJsonIndent = (opts) => {
    if (!opts.indent) {
        opts.indent = defaultJsonIndent;
        return;
    }

    if (opts.indent === '\t' || opts.indent === 't' || opts.indent === 'tab') {
        opts.indent = '\t';
        return;
    }

    const indent = Number(opts.indent);

    if (indent !== opts.indent || indent < 1 || indent > 10) {
        opts.indent = defaultJsonIndent;
    }
};

/**
 * Helper function for validating the types of the version property values.
 *
 * @param {Object} opts - The options for this plugin.
 */
const validateVersionPropertyType = (opts) => {
    if (!opts.versionPropertyType || opts.versionPropertyType !== stringVersionPropertyType) {
        opts.versionPropertyType = defaultVersionPropertyType;
    }
};

/**
 * Helper function for validating the plugin options.
 * @param {Object} opts - The options for this plugin.
 *
 * @returns {Object} - The plugin options with validated and/or default values.
 */
const validateOptions = (opts) => {
    const options = opts || {};
    validateReleaseType(options);
    validateJsonIndent(options);
    validateVersionPropertyType(options);

    return options;
};

/**
 * Helper function for doing some sanity validation on the task version properties.
 * @private
 * @param {string|number} versionProp - The version
 */
const versionPropIsValid = versionProp => {
    const num = Number(versionProp);
    return (!isNaN(num) && Number.isInteger(num.valueOf()) && num.valueOf() >= 0 && versionProp !== '');
};

/**
 * Extracts the version of the task.
 *
 * @param {Object} task - The object representation of the task.
 * @returns {string}
 */
const getTaskVersion = (task) => {
    const version = task.version;
    const major = version.Major;
    const minor = version.Minor;
    const patch = version.Patch;
    if (versionPropIsValid(major) && versionPropIsValid(minor) && versionPropIsValid(patch)) {
        const dot = '.';
        return major + dot + minor + dot + patch;
    } else {
        throw new Error('Encountered one or more invalid tasks. Task must represent version as an object under the \'version\' key ' +
            'with Major, Minor, and Patch fields (that start with Uppercase letters)');
    }
};

/**
 * Bumps the task's version using the specified release type.
 *
 * @param {Object} task - The object representation of the task.
 * @param {string} currentVersion - The current version of the task.
 * @param {Object} opts - The options for this plugin.
 *
 * @returns {string} - The bumped version of the specified version.
 */
const bumpVersion = (task, currentVersion, opts) => {
    const bumpedVersion = semver.inc(currentVersion, opts.type);
    let major = semver.major(bumpedVersion);
    let minor = semver.minor(bumpedVersion);
    let patch = semver.patch(bumpedVersion);

    if (opts.versionPropertyType === stringVersionPropertyType) {
        major = major.toString();
        minor = minor.toString();
        patch = patch.toString();
    }

    task.version.Major = major;
    task.version.Minor = minor;
    task.version.Patch = patch;
    return bumpedVersion;
};

module.exports = {
    validateOptions,
    validateReleaseType,
    validateJsonIndent,
    validateVersionPropertyType,
    getTaskVersion,
    bumpVersion
};
