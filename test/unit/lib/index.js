'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const Glob = require('glob').Glob;
const sinon = require('sinon');

const helpers = require('../../helpers');
const index = require('../../../lib/index');
const utils = require('../../../lib/utils');

suite('index Suite:', () => {
    let utilsValidateOptionsStub;
    let utilsGetTaskVersionStub;
    let utilsBumpVersionStub;
    let globOnEndStub;
    let globOnErrorStub;
    let fsReadFileStub;
    let fsWriteFileStub;
    let jsonParseStub;
    let jsonStringifySpy;
    const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);
    const sampleGlob = 'tasks/**/task.json';
    const taskOneFilePath = 'tasks/one/task.json';
    const taskTwoFilePath = 'tasks/two/task.json';
    const taskFilePaths = [ taskOneFilePath, taskTwoFilePath ];
    const singleGlobArgs = [ sampleGlob ];
    const opts = {};
    const failureErrorMessageBase = 'Fatal error occurred while attempting to bump file. Details: ';
    const noDetailsErrorMessage = failureErrorMessageBase + 'unknown';

    setup(() => {
        utilsValidateOptionsStub = sinon.stub(utils, 'validateOptions').callsFake(() => helpers.defaultOptions);
        utilsGetTaskVersionStub = sinon.stub(utils, 'getTaskVersion').callsFake(() => helpers.initialVersion);
        utilsBumpVersionStub = sinon.stub(utils, 'bumpVersion').callsFake(() => helpers.bumpedVersion);
        const globOnStub = sinon.stub(Glob.prototype, 'on');
        globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
        globOnErrorStub = globOnStub.withArgs(helpers.globErrorEventName);
        fsReadFileStub = sinon.stub(fs, 'readFile');
        fsReadFileStub.yields(null, helpers.validTaskFileContents);
        fsWriteFileStub = sinon.stub(fs, 'writeFile');
        fsWriteFileStub.yields(null);
        jsonParseStub = sinon.stub(JSON, 'parse').callsFake(() => helpers.validSampleOneTaskContents);
        jsonStringifySpy = sinon.spy(JSON, 'stringify');
    });

    teardown(() => {
        sinon.restore();
    });

    suite('bumpTaskManifests Suite:', () => {
        suite('validateFileGlobs Suite:', () => {
            const invalidArgsErrorMessage = 'Invalid arguments. Valid array of glob of task manifests must be specified';

            test('Should reject with correct error message when args is null', (done) => {
                index.bumpTaskManifestFiles(null).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is undefined', (done) => {
                index.bumpTaskManifestFiles(undefined).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is an empty string', (done) => {
                index.bumpTaskManifestFiles('').catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is an empty object', (done) => {
                index.bumpTaskManifestFiles({}).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is an empty array', (done) => {
                index.bumpTaskManifestFiles([]).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });
        });

        suite('globError Suite:', () => {
            const globErrorMessageBase = 'Failed to match glob. Error details: ';
            const emptyGlobErrorDetailsMessage = globErrorMessageBase + helpers.noErrorMessagePropertyDefaultMessage;
            const expectedEmptyDetailsErrorMessage = failureErrorMessageBase + emptyGlobErrorDetailsMessage;

            test('Should reject with correct error when Glob emits an error with no detailed message', (done) => {
                globOnErrorStub.yields(new Error());
                index.bumpTaskManifestFiles(singleGlobArgs).catch(err => {
                    assert.deepEqual(err.message, expectedEmptyDetailsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error when Glob emits an error with a detailed message', (done) => {
                const detailedError = 'OH MY GLOB';
                const expectedErrorMessage = failureErrorMessageBase + globErrorMessageBase + detailedError;
                globOnErrorStub.yields(new Error(detailedError));
                index.bumpTaskManifestFiles(singleGlobArgs).catch(err => {
                    assert.deepEqual(err.message, expectedErrorMessage);
                    done();
                });
            });
        });

        suite('glob Success Suite:', () => {
            setup(() => {
                globOnEndStub.yields(taskFilePaths);
            });

            suite('utilsValidateOpts Suite:', () => {
                test('Should pass opts to utils for validation', (done) => {
                    index.bumpTaskManifestFiles(singleGlobArgs, opts).then(() => {
                        assert.isTrue(utilsValidateOptionsStub.calledWith(opts));
                        done();
                    }).catch(err => done(err));
                });
            });

            suite('fsReadFile Suite:', () => {
                test('Should provide correct encoding option for reading', (done) => {
                    const correctEncoding = { encoding: 'utf-8' };
                    index.bumpTaskManifestFiles(singleGlobArgs).then(() => {
                        assert.isTrue(fsReadFileStub.firstCall.calledWith(taskOneFilePath, correctEncoding));
                        assert.isTrue(fsReadFileStub.secondCall.calledWith(taskTwoFilePath, correctEncoding));
                        done();
                    }).catch(err => done(err));
                });

                test('Should reject with correct error message when file read fails with detailed error', (done) => {
                    const detailedErrorMessage = 'errno file not found';
                    const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
                    fsReadFileStub.onSecondCall().yields(new Error(detailedErrorMessage), null);
                    index.bumpTaskManifestFiles(singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, expectedErrorMessage);
                        done();
                    });
                });

                test('Should reject with correct error message when file read fails with no error details', (done) => {
                    fsReadFileStub.onSecondCall().yields(new Error(), null);
                    index.bumpTaskManifestFiles(singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, noDetailsErrorMessage);
                        done();
                    });
                });
            });
        });
    });

    suite('getBumpedTasks Suite:', () => {
        test('Should throw not implemented error', () => {
            assert.throws(() => index.getBumpedTasks(), 'Not yet implemented');
        });
    });
});