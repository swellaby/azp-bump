#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const log = require('fancy-log');
const program = require('commander');

const index = require('../lib/index');
const packageJson = require('../package.json');

const typeDescription = 'The bump version type. Allowed values: major, minor, or patch.';
const typeRegex = /^(patch|minor|major)$/i;
const indentDescription = 'The spacing indent to use while updating the task manifests. Specifying a number will use that many spaces, ' +
    'or a string to use a tab character. Allowed values: 1-10 (inclusive) OR t, tab, or \'\\t\'.';
const versionPropertyTypeRegex = /^(string|number)$/i;
const versionPropertyTypeDescription = 'Controls the property type of the version fields. Allowed values: string, number.';

/**
 * Helper function used for parsing CLI indent option.
 * @private
 * @param {string} indent - The indent specified
 */
const parseIndent = indent => {
    if (indent === 't' || indent === 'tab' || indent === '\\t') {
        return '\t';
    }

    return parseInt(indent);
};

program
    .version(packageJson.version, '-v, --version')
    .usage('<files> [options...]')
    .option('-t, --type [type]', typeDescription, typeRegex, 'patch')
    .option('-i, --indent [indent]', indentDescription, parseIndent, 2)
    .option('-q, --quiet', 'Including this flag will disable the log output')
    .option('-p, --version-property-type [versionPropertyType]', versionPropertyTypeDescription, versionPropertyTypeRegex, 'number')
    .parse(process.argv);

/**
 * Helper function for logging the bump result.
 * @param {Object} result
 * @private
 */
const logResult = (result) => {
    log.info(`Bumped ${chalk.blue(result.bumpedFiles.length)} task manifest file(s) using bump type ${chalk.blue(result.bumpType)}`);
    result.bumpedFiles.forEach(bumpedFile => {
        const oldVersion = bumpedFile.initialVersion;
        const newVersion = bumpedFile.bumpedVersion;
        const file = bumpedFile.filePath;
        log.info(`Bumped ${chalk.blue(oldVersion)} to ${chalk.magenta(newVersion)} in ${file}`);
    });
};

/**
 * Main bump functionality
 * @private
 */
const bump = () => {
    const opts = program.opts();
    return index.bumpTaskManifestFiles(program.args, opts).then(result => {
        if (!opts.quiet) {
            logResult(result);
        }
        process.exit(0);
    }).catch(err => {
        log.error(`Fatal error encountered. ${(err && err.message) ? err.message: 'unknown'}`);
        process.exit(1);
    });
};

bump();

module.exports = {
    bump: bump,
    parseIndent: parseIndent
};
