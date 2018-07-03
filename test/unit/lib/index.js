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
    let jsonStringifyStub;
    const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);
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
        jsonStringifyStub = sinon.stub(JSON, 'stringify').callsFake(() => validTaskFileContents);
    });

    teardown(() => {
        sinon.restore();
    });

    suite('bumpTaskManifestFiles Suite:', () => {
        suite('validateFileGlobs Suite:', () => {
            const invalidArgsErrorMessage = 'Invalid arguments. Valid array of glob of task manifests must be specified';

            test('Should reject with correct error message when args is null', done => {
                index.bumpTaskManifestFiles(null).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is undefined', done => {
                index.bumpTaskManifestFiles(undefined).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is an empty string', done => {
                index.bumpTaskManifestFiles('').catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is an empty object', done => {
                index.bumpTaskManifestFiles({}).catch(err => {
                    assert.deepEqual(err.message, invalidArgsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error message when args is an empty array', done => {
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

            test('Should reject with correct error when Glob emits an error with no detailed message', done => {
                globOnErrorStub.yields(new Error());
                index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                    assert.deepEqual(err.message, expectedEmptyDetailsErrorMessage);
                    done();
                });
            });

            test('Should reject with correct error when Glob emits an error with a detailed message', done => {
                const detailedError = 'OH MY GLOB';
                const expectedErrorMessage = failureErrorMessageBase + globErrorMessageBase + detailedError;
                globOnErrorStub.yields(new Error(detailedError));
                index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                    assert.deepEqual(err.message, expectedErrorMessage);
                    done();
                });
            });
        });

        suite('glob Success Suite:', () => {
            setup(() => {
                globOnEndStub.yields(helpers.taskFilePaths);
            });

            suite('utilsValidateOpts Suite:', () => {
                test('Should pass opts to utils for validation', done => {
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(() => {
                        assert.isTrue(utilsValidateOptionsStub.calledWith(opts));
                        done();
                    }).catch(err => done(err));
                });
            });

            suite('bumpTaskManifests Suite:', () => {
                test('Should provide correct encoding option for reading', done => {
                    const correctEncoding = { encoding: 'utf-8' };
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).then(() => {
                        assert.isTrue(fsReadFileStub.firstCall.calledWith(helpers.taskOneFilePath, correctEncoding));
                        assert.isTrue(fsReadFileStub.secondCall.calledWith(helpers.taskTwoFilePath, correctEncoding));
                        done();
                    }).catch(err => done(err));
                });

                test('Should reject with correct error message when file read fails with detailed error', done => {
                    const detailedErrorMessage = 'errno file not found';
                    const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
                    fsReadFileStub.onSecondCall().yields(new Error(detailedErrorMessage), null);
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, expectedErrorMessage);
                        done();
                    });
                });

                test('Should reject with correct error message when file read fails with no error details', done => {
                    fsReadFileStub.onSecondCall().yields(new Error(), null);
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, noDetailsErrorMessage);
                        done();
                    });
                });
            });

            suite('updateTaskManifest Suite:', () => {
                test('Should reject with correct error message when a json parse exception is thrown', done => {
                    const detailedErrorMessage = 'invalid json parse';
                    const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
                    jsonParseStub.throws(new Error(detailedErrorMessage));
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, expectedErrorMessage);
                        done();
                    });
                });

                test('Should reject with correct error message when get exception is thrown by utils.getTaskVersion', done => {
                    const detailedErrorMessage = 'invalid json version key';
                    const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
                    utilsGetTaskVersionStub.throws(new Error(detailedErrorMessage));
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, expectedErrorMessage);
                        done();
                    });
                });

                test('Should reject with correct error message when get exception is thrown by utils.bumpVersion', done => {
                    const detailedErrorMessage = 'bump failure';
                    const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
                    utilsBumpVersionStub.throws(new Error(detailedErrorMessage));
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, expectedErrorMessage);
                        done();
                    });
                });

                test('Should call file write operation with correct inputs', done => {
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(() => {
                        assert.isTrue(jsonStringifyStub.calledWith(helpers.validSampleOneTaskContents, null, helpers.defaultJsonIndent));
                        assert.isTrue(fsWriteFileStub.firstCall.calledWith(helpers.taskOneFilePath, validTaskFileContents));
                        assert.isTrue(fsWriteFileStub.secondCall.calledWith(helpers.taskTwoFilePath, validTaskFileContents));
                        done();
                    }).catch(err => done(err));
                });

                test('Should reject with correct error message when there is a file write error', done => {
                    const detailedErrorMessage = 'errno file locked';
                    const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
                    fsWriteFileStub.onSecondCall().yields(new Error(detailedErrorMessage));
                    index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                        assert.deepEqual(err.message, expectedErrorMessage);
                        done();
                    });
                });
            });

            test('Should resolve with correct result object when bump is successful', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs).then(result => {
                    assert.deepEqual(result, helpers.bumpResult);
                    done();
                }).catch(err => done(err));
            });
        });
    });

    suite('getBumpedTasks Suite:', () => {
        test('Should throw not implemented error', () => {
            assert.throws(() => index.getBumpedTasks(), 'Not yet implemented');
        });
    });
});