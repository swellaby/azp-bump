#!/usr/bin/env node
'use strict';

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
    .option('-q, --quiet [quiet]', 'controls suppression of the log output')
    .option('-v, --versionPropertyType [versionPropertyType]', versionPropertyTypeDescription, versionPropertyTypeRegex)
    .parse(process.argv);

const bump = () => {
    const opts = program.opts();
    return index.bumpTaskManifestFiles(program.args, opts).then(result => {
        console.log(result);
        process.exit(0);
    }).catch(err => {
        console.error(`failed: ${err.message}`);
        process.exit(1);
    });
};

bump();

module.exports = {
    bump: bump
};
