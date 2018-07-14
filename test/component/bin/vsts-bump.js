'use strict';

const assert = require('chai').assert;
const commander = require('commander');
const fs = require('fs');
const Glob = require('glob').Glob;
const log = require('fancy-log');
const sinon = require('sinon');

const helpers = require('../../helpers');
const index = require('../../../lib/index');

suite('vsts-bump Suite:', () => {
    let logInfoStub;
    let opts = {};
    let cli;
    let processExitStub;
    let globOnEndStub;
    let fsReadFileStub;
    let fsWriteFileStub;
    const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);
    let bumpedTaskOneContents;

    setup(() => {
        const globOnStub = sinon.stub(Glob.prototype, 'on');
        globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
        globOnEndStub.yields(helpers.taskFilePaths);
        fsReadFileStub = sinon.stub(fs, 'readFile');
        fsReadFileStub.yields(null, validTaskFileContents);
        fsWriteFileStub = sinon.stub(fs, 'writeFile');
        fsWriteFileStub.yields(null);
        processExitStub = sinon.stub(process, 'exit');
        logInfoStub = sinon.stub(log, 'info');
        sinon.stub(log, 'error');
        opts = {
            type: helpers.defaultReleaseType,
            indent: helpers.defaultJsonIndent,
            versionPropertyType: helpers.defaultVersionPropertyType
        };
        commander.opts = () => null;
        sinon.stub(commander, 'opts').callsFake(() => opts);
        sinon.stub(commander, 'parse');
        const libStub = sinon.stub(index, 'bumpTaskManifestFiles').resolves({});
        cli = require('../../../bin/vsts-bump');
        libStub.restore();
        commander.args = helpers.singleGlobArgs;
        bumpedTaskOneContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, 2);
    });

    teardown(() => {
        sinon.restore();
        opts = null;
    });

    suite('indent Suite:', () => {
        test('Should use the default indent when opts is empty', done => {
            opts = {};
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has null indent specified', done => {
            opts.indent = null;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has undefined indent specified', done => {
            opts.indent = undefined;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has invalid indent specified', done => {
            opts.indent = 'bad';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has NaN indent specified', done => {
            opts.indent = NaN;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has invalid numeric string indent specified', done => {
            opts.indent = '10 20';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has negative numeric string indent specified', done => {
            opts.indent = -3;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has zero indent specified', done => {
            opts.indent = 0;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has indent greater than 10 specified', done => {
            opts.indent = 18;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use specified indent when opts has indent of 1 specified', done => {
            const indent = 1;
            opts.indent = indent;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use specified indent when opts has indent of 10 specified', done => {
            const indent = 10;
            opts.indent = indent;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use specified indent when opts has indent between 1 and 10 specified', done => {
            const indent = 8;
            opts.indent = indent;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default indent when opts has valid string indent specified', done => {
            const indent = '3';
            opts.indent = indent;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use specified indent when opts has t character indent specified', done => {
            const indent = 't';
            opts.indent = indent;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use specified indent when opts has tab string indent specified', done => {
            const indent = 'tab';
            opts.indent = indent;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use specified indent when opts has tab character indent specified', done => {
            opts.indent = helpers.tabCharacter;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });
    });

    suite('bump type Suite:', () => {
        test('Should use the default bump type when opts is empty', done => {
            opts = {};
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has null type specified', done => {
            opts.type = null;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has undefined type specified', done => {
            opts.type = undefined;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has invalid type specified', done => {
            opts.type = 'bad';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has emtpy string type specified', done => {
            opts.type = '';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has upper case PATCH type specified', done => {
            opts.type = 'PATCH';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has upper case MINOR type specified', done => {
            opts.type = 'MINOR';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has upper case MAJOR type specified', done => {
            opts.type = 'MAJOR';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use patch bump type when opts has patch type specified', done => {
            opts.type = helpers.patchReleaseType;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has minor type specified', done => {
            opts.type = helpers.minorReleaseType;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedMinorVersionTaskContents, helpers.defaultJsonIndent);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default bump type when opts has major type specified', done => {
            opts.type = helpers.majorReleaseType;
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedMajorVersionTaskContents, helpers.defaultJsonIndent);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });
    });

    suite('versionPropertyType Suite:', () => {
        test('Should use the default property type when opts is empty', done => {
            opts = {};
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default property type when opts has null property type specified', done => {
            opts.versionPropertyType = null;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default property type when opts has undefined property type specified', done => {
            opts.versionPropertyType = undefined;
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default property type when opts has empty string property type specified', done => {
            opts.versionPropertyType = '';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default property type when opts has invalid property type specified', done => {
            opts.versionPropertyType = 'bad';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default property type when opts has upper case STRING property type specified', done => {
            opts.versionPropertyType = 'STRING';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use default property type when opts has mixed case string property type specified', done => {
            opts.versionPropertyType = 'StrinG';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use number property type when opts has number property type specified', done => {
            opts.versionPropertyType = 'number';
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should use string property type when opts has string property type specified', done => {
            opts.versionPropertyType = 'string';
            const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneBumpedTaskContents, helpers.defaultJsonIndent);
            cli.bump().then(() => {
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });
    });

    suite('quiet Suite:', () => {
        test('Should not log output on success when quiet is set to true', done => {
            opts.quiet = true;
            cli.bump().then(() => {
                assert.isFalse(logInfoStub.called);
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });

        test('Should log output on success when quiet is not set to true', done => {
            cli.bump().then(() => {
                assert.isTrue(logInfoStub.firstCall.calledWith(helpers.defaultBumpSummaryMessage));
                assert.isTrue(logInfoStub.secondCall.calledWith(helpers.taskOneBumpedMessage));
                assert.isTrue(logInfoStub.thirdCall.calledWith(helpers.taskTwoBumpedMessage));
                assert.isTrue(processExitStub.calledWith(0));
                done();
            }).catch(err => done(err));
        });
    });

    suite('parseIndent Suite:', () => {
        test('Should return tab character when specified indent is t', () => {
            assert.deepEqual(cli.parseIndent('t'), helpers.tabCharacter);
        });

        test('Should return tab character when specified indent is tab', () => {
            assert.deepEqual(cli.parseIndent('tab'), helpers.tabCharacter);
        });

        test('Should return tab character when specified indent is tab character', () => {
            assert.deepEqual(cli.parseIndent(helpers.tabCharacter), helpers.tabCharacter);
        });

        test('Should return number when specified indent is one as a string', () => {
            assert.deepEqual(cli.parseIndent('1'), 1);
        });

        test('Should return number when specified indent is ten as a string', () => {
            assert.deepEqual(cli.parseIndent('10'), 10);
        });
    });
});