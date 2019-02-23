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
        bumpedTaskOneContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, 2);
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
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default indent when opts is null', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, null).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default indent when opts is undefined', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, undefined).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default indent when opts is empty', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, {}).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has null indent specified', done => {
                opts.indent = null;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has undefined indent specified', done => {
                opts.indent = undefined;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has invalid indent specified', done => {
                opts.indent = 'bad';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has NaN indent specified', done => {
                opts.indent = NaN;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has invalid numeric string indent specified', done => {
                opts.indent = '10 20';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has negative numeric string indent specified', done => {
                opts.indent = -3;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has zero indent specified', done => {
                opts.indent = 0;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has indent greater than 10 specified', done => {
                opts.indent = 18;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has indent of 1 specified', done => {
                const indent = 1;
                opts.indent = indent;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has indent of 10 specified', done => {
                const indent = 10;
                opts.indent = indent;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has indent between 1 and 10 specified', done => {
                const indent = 8;
                opts.indent = indent;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, indent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default indent when opts has valid string indent specified', done => {
                const indent = '3';
                opts.indent = indent;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has t character indent specified', done => {
                const indent = 't';
                opts.indent = indent;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has tab string indent specified', done => {
                const indent = 'tab';
                opts.indent = indent;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use specified indent when opts has tab character indent specified', done => {
                opts.indent = helpers.tabCharacter;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedVersionTaskContents, helpers.tabCharacter);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });
        });

        suite('bump type Suite:', () => {
            test('Should use the default bump type when opts is not specified', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default bump type when opts is null', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, null).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default bump type when opts is undefined', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, undefined).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default bump type when opts is empty', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, {}).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has null type specified', done => {
                opts.type = null;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has undefined type specified', done => {
                opts.type = undefined;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has invalid type specified', done => {
                opts.type = 'bad';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has empty string type specified', done => {
                opts.type = '';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has upper case PATCH type specified', done => {
                opts.type = 'PATCH';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has upper case MINOR type specified', done => {
                opts.type = 'MINOR';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has upper case MAJOR type specified', done => {
                opts.type = 'MAJOR';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.defaultReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use patch bump type when opts has patch type specified', done => {
                opts.type = helpers.patchReleaseType;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    assert.deepEqual(bumpResult.bumpType, helpers.patchReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has minor type specified', done => {
                opts.type = helpers.minorReleaseType;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedMinorVersionTaskContents, helpers.defaultJsonIndent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles[0].bumpedVersion, '0.9.0');
                    assert.deepEqual(bumpResult.bumpedFiles[1].bumpedVersion, '0.9.0');
                    assert.deepEqual(bumpResult.bumpType, helpers.minorReleaseType);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default bump type when opts has major type specified', done => {
                opts.type = helpers.majorReleaseType;
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneNumericBumpedMajorVersionTaskContents, helpers.defaultJsonIndent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles[0].bumpedVersion, '1.0.0');
                    assert.deepEqual(bumpResult.bumpedFiles[1].bumpedVersion, '1.0.0');
                    assert.deepEqual(bumpResult.bumpType, helpers.majorReleaseType);
                    done();
                }).catch(err => done(err));
            });
        });

        suite('versionPropertyType Suite:', () => {
            test('Should use the default property type when opts is not specified', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default property type when opts is null', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, null).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default property type when opts is undefined', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, undefined).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use the default property type when opts is empty', done => {
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, {}).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default property type when opts has null property type specified', done => {
                opts.versionPropertyType = null;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default property type when opts has undefined property type specified', done => {
                opts.versionPropertyType = undefined;
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default property type when opts has empty string property type specified', done => {
                opts.versionPropertyType = '';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default property type when opts has invalid property type specified', done => {
                opts.versionPropertyType = 'bad';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default property type when opts has upper case STRING property type specified', done => {
                opts.versionPropertyType = 'STRING';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use default property type when opts has mixed case string property type specified', done => {
                opts.versionPropertyType = 'StrInG';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use number property type when opts has number property type specified', done => {
                opts.versionPropertyType = 'number';
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, bumpedTaskOneContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });

            test('Should use string property type when opts has string property type specified', done => {
                opts.versionPropertyType = 'string';
                const taskContents = helpers.createBumpedTaskJsonString(helpers.validSampleOneBumpedTaskContents, helpers.defaultJsonIndent);
                index.bumpTaskManifestFiles(helpers.singleGlobArgs, opts).then(bumpResult => {
                    assert.isTrue(fsWriteFileStub.calledWith(helpers.taskOneFilePath, taskContents));
                    assert.deepEqual(bumpResult.bumpedFiles, helpers.bumpedFileResults);
                    done();
                }).catch(err => done(err));
            });
        });
    });

    suite('bumpTask Suite:', () => {
        let task;

        setup(() => {
            task = JSON.parse(JSON.stringify(helpers.validSampleOneTaskContents));
        });

        teardown(() => {
            task = null;
        });

        test('Should bump the default version when no bumpType is specified', () => {
            index.bumpTask(task);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when null bumpType is specified', () => {
            index.bumpTask(task, null);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when undefined bumpType is specified', () => {
            index.bumpTask(task, undefined);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when empty string bumpType is specified', () => {
            index.bumpTask(task, '');
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when invalid string bumpType is specified', () => {
            index.bumpTask(task, 'aSdFaSef');
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the patch version when patch bumpType is specified', () => {
            index.bumpTask(task, helpers.patchReleaseType);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the minor version when minor bumpType is specified', () => {
            index.bumpTask(task, helpers.minorReleaseType);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedMinorVersionTaskContents);
        });

        test('Should bump the minor version when major bumpType is specified', () => {
            index.bumpTask(task, helpers.majorReleaseType);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedMajorVersionTaskContents);
        });
    });

    suite('bumpTasks Suite:', () => {
        let task;

        setup(() => {
            task = JSON.parse(JSON.stringify(helpers.validSampleOneTaskContents));
        });

        teardown(() => {
            task = null;
        });

        test('Should bump the default version when no bumpType is specified', () => {
            index.bumpTasks([ task ]);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when null bumpType is specified', () => {
            index.bumpTasks([ task ], null);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when undefined bumpType is specified', () => {
            index.bumpTasks([ task ], undefined);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when empty string bumpType is specified', () => {
            index.bumpTasks([ task ], '');
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the default version when invalid string bumpType is specified', () => {
            index.bumpTasks([ task ], 'aSdFaSef');
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the patch version when patch bumpType is specified', () => {
            index.bumpTasks([ task ], helpers.patchReleaseType);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedVersionTaskContents);
        });

        test('Should bump the minor version when minor bumpType is specified', () => {
            index.bumpTasks([ task ], helpers.minorReleaseType);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedMinorVersionTaskContents);
        });

        test('Should bump the minor version when major bumpType is specified', () => {
            index.bumpTasks([ task ], helpers.majorReleaseType);
            assert.deepEqual(task, helpers.validSampleOneNumericBumpedMajorVersionTaskContents);
        });
    });
});
