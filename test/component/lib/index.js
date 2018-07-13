'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const Glob = require('glob').Glob;
const sinon = require('sinon');

const helpers = require('../../helpers');
const index = require('../../../lib/index');

suite('index Suite:', () => {
    let globOnEndStub;
    let fsReadFileStub;
    let fsWriteFileStub;
    let opts;
    const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);
    let bumpedTaskOneContents;

    const createBumpedTaskJsonString = (taskContents, indent) => {
        return JSON.stringify(taskContents, null, indent);
    };

    setup(() => {
        const globOnStub = sinon.stub(Glob.prototype, 'on');
        globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
        globOnEndStub.yields(helpers.taskFilePaths);
        fsReadFileStub = sinon.stub(fs, 'readFile');
        fsReadFileStub.yields(null, validTaskFileContents);
        fsWriteFileStub = sinon.stub(fs, 'writeFile');
        fsWriteFileStub.yields(null);
        opts = {
            type: helpers.defaultReleaseType,
            indent: helpers.defaultJsonIndent,
            versionPropertyType: helpers.defaultVersionPropertyType
        };
        bumpedTaskOneContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, 2);
    });

    teardown(() => {
        sinon.restore();
        opts = null;
    });

    suite('bumpTaskManifestFiles Suite:', () => {
        suite('indent Suite:', () => {
            test('Should use the default indent when opts is not specified', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default indent when opts is null', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, null).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default indent when opts is undefined', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, undefined).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default indent when opts is empty', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, {}).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has null indent specified', done => {
                opts.indent = null;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has undefined indent specified', done => {
                opts.indent = undefined;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has invalid indent specified', done => {
                opts.indent = 'bad';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has NaN indent specified', done => {
                opts.indent = NaN;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has invalid numeric string indent specified', done => {
                opts.indent = '10 20';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has negative numeric string indent specified', done => {
                opts.indent = -3;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has zero indent specified', done => {
                opts.indent = 0;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has indent greater than 10 specified', done => {
                opts.indent = 18;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has indent of 1 specified', done => {
                const indent = 1;
                opts.indent = indent;
                const taskContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });


            test('Should use specified indent when opts has indent of 10 specified', done => {
                const indent = 10;
                opts.indent = indent;
                const taskContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has indent between 1 and 10 specified', done => {
                const indent = 8;
                opts.indent = indent;
                const taskContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has valid string indent specified', done => {
                const indent = '3';
                opts.indent = indent;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has t character indent specified', done => {
                const indent = 't';
                opts.indent = indent;
                const taskContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has tab string indent specified', done => {
                const indent = 'tab';
                opts.indent = indent;
                const taskContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has tab character indent specified', done => {
                opts.indent = helpers.tabCharacter;
                const taskContents = createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles.length, helpers.taskFilePaths.length);
                    done();
                }).catch(err => done(err));
            });
        });

        suite('bump type Suite:', () => {

        });

        suite('versionPropertyType Suite:', () => {

        });
    });
});