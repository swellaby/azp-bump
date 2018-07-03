#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const log = require('fancy-log');
const program = require('commander');

const index = require('../lib/index');
const packageJson = require('../package.json');

const typeRegex = /^(patch|minor|major)$/i;
const versionPropertyTypeRegex = /^(string|number)$/i;
const versionPropertyTypeDescription = 'controls the property type of the version fields';

program
    .version(packageJson.version)
    .usage('<files> [options...]')
    .option('-t, --type [type]', 'the bump version type', typeRegex)
    .option('-i, --indent [indent]', 'the indent to use')
    .option('-q, --quiet', 'controls suppression of the log output')
    .option('-v, --version-property-type [versionPropertyType]', versionPropertyTypeDescription, versionPropertyTypeRegex)
    .parse(process.argv);

const logResult = (result) => {
    log.info(`Bumped ${chalk.blue(result.bumpedFiles.length)} task manifests using bump type ${chalk.blue(result.bumpType)}`);
    result.bumpedFiles.forEach(bumpedFile => {
        const oldVersion = bumpedFile.initialVersion;
        const newVersion = bumpedFile.bumpedVersion;
        const file = bumpedFile.filePath;
        log.info(`Bumped ${chalk.blue(oldVersion)} to ${chalk.magenta(newVersion)} in ${file}`);
    });
};

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
    bump: bump
};
