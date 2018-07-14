'use strict';

const assert = require('chai').assert;
const commander = require('commander');
const fs = require('fs');
const Glob = require('glob').Glob;
const log = require('fancy-log');
const sinon = require('sinon');

const helpers = require('../../helpers');
const index = require('../../../lib/index');

suite('vsts-bump errors Suite:', () => {
    let logErrorStub;
    const args = [ 'src/*.js', 'test/**/*.js' ];
    let opts = {};
    let commanderOptsStub;
    let commanderParseStub;
    let cli;
    let processExitStub;
    let globOnEndStub;
    let globOnErrorStub;
    let fsReadFileStub;
    let fsWriteFileStub;
    const cliErrorMessageBase = 'Fatal error encountered. ';
    const failureErrorMessageBase = 'Fatal error occurred while attempting to bump file. Details: ';
    const noDetailsErrorMessage = cliErrorMessageBase + 'unknown';
    const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);

    setup(() => {
        const globOnStub = sinon.stub(Glob.prototype, 'on');
        globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
        globOnErrorStub = globOnStub.withArgs(helpers.globErrorEventName);
        fsReadFileStub = sinon.stub(fs, 'readFile');
        fsReadFileStub.yields(null, validTaskFileContents);
        fsWriteFileStub = sinon.stub(fs, 'writeFile');
        fsWriteFileStub.yields(null);
        processExitStub = sinon.stub(process, 'exit');
        logErrorStub = sinon.stub(log, 'error');
        opts = {};
        opts.type = helpers.minorReleaseType;
        opts.indent = 4;
        commander.opts = () => null;
        commanderOptsStub = sinon.stub(commander, 'opts').callsFake(() => opts);
        commander.args = args;
        commanderParseStub = sinon.stub(commander, 'parse');
        const libStub = sinon.stub(index, 'bumpTaskManifestFiles').resolves({});
        cli = require('../../../bin/vsts-bump');
        libStub.restore();
        commander.args = args;
    });

    teardown(() => {
        sinon.restore();
    });

    const setGlobEndStub = () => {
        globOnEndStub.yields(helpers.taskFilePaths);
    };

    test('Should log correct error message when promise rejects with no error message details', done => {
        sinon.stub(require('../../../lib/index'), 'bumpTaskManifestFiles').rejects(new Error());
        cli.bump().then(() => {
            assert.isTrue(commanderOptsStub.called);
            assert.isTrue(commanderParseStub.called);
            assert.isTrue(logErrorStub.calledWith(noDetailsErrorMessage));
            assert.isTrue(processExitStub.calledWith(1));
            done();
        }).catch(err => done(err));
    });

    suite('glob Error Suite:', () => {
        const globErrorMessageBase = 'Failed to match glob. Error details: ';
        const emptyGlobErrorDetailsMessage = cliErrorMessageBase + failureErrorMessageBase + globErrorMessageBase + helpers.noErrorMessagePropertyDefaultMessage;
        const globErrorDetailsErrorMessageBase = cliErrorMessageBase + failureErrorMessageBase + globErrorMessageBase;

        test('Should reject with correct error when Glob emits an error with no detailed message', done => {
            globOnErrorStub.yields(new Error());
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(emptyGlobErrorDetailsMessage));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });

        test('Should reject with correct error when Glob emits an error with a detailed message', done => {
            const detailedError = 'OH MY GLOB';
            globOnErrorStub.yields(new Error(detailedError));
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(globErrorDetailsErrorMessageBase + detailedError));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });
    });

    suite('fsRead Error Suite:', () => {
        setup(() => {
            setGlobEndStub();
            fsReadFileStub.yields(new Error(), null);
        });

        test('Should reject with correct error message when file read fails with detailed error', done => {
            const detailedErrorMessage = 'errno file not found';
            const expectedErrorMessage = cliErrorMessageBase + failureErrorMessageBase + detailedErrorMessage;
            fsReadFileStub.yields(new Error(detailedErrorMessage), null);
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(expectedErrorMessage));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });

        test('Should reject with correct error message when file read fails with no error details', done => {
            fsReadFileStub.yields(new Error(), null);
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(cliErrorMessageBase + failureErrorMessageBase + helpers.noErrorMessagePropertyDefaultMessage));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });
    });

    suite('fsWrite Error Suite:', () => {
        setup(() => {
            setGlobEndStub();
            fsWriteFileStub.yields(new Error());
        });

        test('Should reject with correct error message when there is a file write error', done => {
            const detailedErrorMessage = 'errno file locked';
            const expectedErrorMessage = cliErrorMessageBase + failureErrorMessageBase + detailedErrorMessage;
            fsWriteFileStub.yields(new Error(detailedErrorMessage));
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(expectedErrorMessage));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });

        test('Should reject with correct error message when file write fails with no error details', done => {
            const expectedErrorMessage = cliErrorMessageBase + failureErrorMessageBase + helpers.noErrorMessagePropertyDefaultMessage;
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(expectedErrorMessage));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });
    });

    suite('invalid file contents Suite:', () => {
        setup(() => {
            setGlobEndStub();
        });

        test('Should reject with correct error message when file contents are invalid', done => {
            fsReadFileStub.yields(null, '{/]');
            const expectedErrorMessage = cliErrorMessageBase + failureErrorMessageBase + 'Unexpected token / in JSON at position 1';
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(expectedErrorMessage));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });
    });
});