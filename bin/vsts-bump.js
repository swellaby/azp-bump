#!/usr/bin/env node
'use strict';

const program = require('commander');

const index = require('../lib/index');
const packageJson = require('../package.json');

program
    .version(packageJson.version)
    .usage('<files> [options...]')
    .option('-t, --type [type]', 'the bump version type')
    .option('-i, --indent [indent]', 'the indent to use')
    .parse(process.argv);

const bump = () => {
    const opts = program.opts();
    console.log('Args: ' + program.args);
    console.log('Release Type: ' + opts['type']);
    console.log('Indent Type: ' + opts['indent']);
    return index.bumpTaskManifests(program.args, opts);
};

bump();

module.exports = {
    bump: bump
};
