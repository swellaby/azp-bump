'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const Glob = require('glob').Glob;
const sinon = require('sinon');

const helpers = require('../../../helpers');
const index = require('../../../../lib/index');

suite('lib errors files Suite:', () => {
    let globOnEndStub;
    let globOnErrorStub;
    let fsReadFileStub;
    let fsWriteFileStub;
    // const opts = {};
    const failureErrorMessageBase = 'Fatal error occurred while attempting to bump file. Details: ';
    const noDetailsErrorMessage = failureErrorMessageBase + 'unknown';
    const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);

    setup(() => {
        const globOnStub = sinon.stub(Glob.prototype, 'on');
        globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
        globOnErrorStub = globOnStub.withArgs(helpers.globErrorEventName);
        fsReadFileStub = sinon.stub(fs, 'readFile');
        fsReadFileStub.yields(null, validTaskFileContents);
        fsWriteFileStub = sinon.stub(fs, 'writeFile');
        fsWriteFileStub.yields(null);
    });

    teardown(() => {
        sinon.restore();
    });

    const setGlobEndStub = () => {
        globOnEndStub.yields(helpers.taskFilePaths);
    };

    suite('glob Error Suite:', () => {
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

    suite('fsRead Error Suite:', () => {
        setup(() => {
            setGlobEndStub();
            fsReadFileStub.yields(new Error(), null);
        });

        test('Should provide correct encoding option for reading', done => {
            const correctEncoding = { encoding: 'utf-8' };
            index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(() => {
                assert.isTrue(fsReadFileStub.firstCall.calledWith(helpers.taskOneFilePath, correctEncoding));
                done();
            });
        });

        test('Should reject with correct error message when file read fails with detailed error', done => {
            const detailedErrorMessage = 'errno file not found';
            const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
            fsReadFileStub.yields(new Error(detailedErrorMessage), null);
            index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                assert.deepEqual(err.message, expectedErrorMessage);
                done();
            });
        });

        test('Should reject with correct error message when file read fails with no error details', done => {
            index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                assert.deepEqual(err.message, noDetailsErrorMessage);
                done();
            });
        });
    });

    suite('fsWrite Error Suite:', () => {
        setup(() => {
            setGlobEndStub();
            fsWriteFileStub.yields(new Error());
        });

        test('Should call file write operation with correct inputs', done => {
            index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                const task = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, 2);
                assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, task));
                assert.deepEqual(err.message, noDetailsErrorMessage);
                done();
            });
        });

        test('Should reject with correct error message when there is a file write error', done => {
            const detailedErrorMessage = 'errno file locked';
            const expectedErrorMessage = failureErrorMessageBase + detailedErrorMessage;
            fsWriteFileStub.yields(new Error(detailedErrorMessage));
            index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                assert.deepEqual(err.message, expectedErrorMessage);
                done();
            });
        });

        test('Should reject with correct error message when file write fails with no error details', done => {
            index.bumpTaskManifestFiles(helpers.singleGlobArgs).catch(err => {
                assert.deepEqual(err.message, noDetailsErrorMessage);
                done();
            });
        });
    });
});