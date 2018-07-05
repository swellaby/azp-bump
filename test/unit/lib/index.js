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
    let utilsValidateReleaseTypeStub;
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
        utilsValidateReleaseTypeStub = sinon.stub(utils, 'validateReleaseType');
        const globOnStub = sinon.stub(Glob.prototype, 'on');
        globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
        globOnErrorStub = globOnStub.withArgs(helpers.globErrorEventName);
        fsReadFileStub = sinon.stub(fs, 'readFile');
        fsReadFileStub.yields(null, validTaskFileContents);
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

    suite('bumpTask Suite:', () => {
        const invalidTaskErrorMessage = 'Encountered one or more invalid tasks. Task must represent version as an object under the \'version\' key ' +
            'with Major, Minor, and Patch fields (that start with Uppercase letters)';

        setup(() => {
            utilsGetTaskVersionStub.throws(new Error(invalidTaskErrorMessage));
        });

        test('Should throw error when task is null', () => {
            assert.throws(() => index.bumpTask(null), invalidTaskErrorMessage);
        });

        test('Should throw error when task is undefined', () => {
            assert.throws(() => index.bumpTask(undefined), invalidTaskErrorMessage);
        });

        test('Should throw error when task is empty', () => {
            assert.throws(() => index.bumpTask({}), invalidTaskErrorMessage);
        });

        test('Should succesfuly bump version when task is valid', () => {
            utilsGetTaskVersionStub.onFirstCall().callsFake(() => helpers.initialVersion);
            const task = helpers.createSampleTaskContents(0, 1, 2);
            const opts = { type: helpers.minorReleaseType };
            index.bumpTask(task, helpers.minorReleaseType);
            assert.isTrue(utilsValidateReleaseTypeStub.firstCall.calledWith(opts));
            assert.isTrue(utilsGetTaskVersionStub.firstCall.calledWith(task));
            assert.isTrue(utilsBumpVersionStub.firstCall.calledWith(task, helpers.initialVersion));
        });
    });

    suite('bumpTasks Suite:', () => {
        const invalidTasksErrorMessage = 'Invalid argument. First parameter must be valid array of tasks.';

        test('Should throw TypeError when tasks are null', () => {
            assert.throws(() => index.bumpTasks(null), invalidTasksErrorMessage);
        });

        test('Should throw TypeError when tasks are undefined', () => {
            assert.throws(() => index.bumpTasks(undefined), invalidTasksErrorMessage);
        });

        test('Should throw TypeError when single tasks object is provided', () => {
            assert.throws(() => index.bumpTasks(helpers.createSampleTaskContents(0, 1, 2)), invalidTasksErrorMessage);
        });

        test('Should not throw TypeError when tasks is empty', () => {
            assert.doesNotThrow(() => index.bumpTasks([]));
        });

        test('Should bump task for each provided task', () => {
            const task1 = helpers.createSampleTaskContents(0, 2, 3);
            const task2 = helpers.createSampleTaskContents(1, 0, 7);
            const opts = { type: helpers.minorReleaseType };
            index.bumpTasks([ task1, task2 ], helpers.minorReleaseType);
            assert.isTrue(utilsValidateReleaseTypeStub.firstCall.calledWith(opts));
            assert.isTrue(utilsGetTaskVersionStub.firstCall.calledWith(task1));
            assert.isTrue(utilsBumpVersionStub.firstCall.calledWith(task1, helpers.initialVersion));
            assert.isTrue(utilsValidateReleaseTypeStub.secondCall.calledWith(opts));
            assert.isTrue(utilsGetTaskVersionStub.secondCall.calledWith(task2));
            assert.isTrue(utilsBumpVersionStub.secondCall.calledWith(task2, helpers.initialVersion));
        });
    });
});