'use strict';

const assert = require('chai').assert;

const helpers = require('../../../helpers');
const index = require('../../../../lib/index');

suite('lib errors params Suite:', () => {
    const invalidTaskErrorMessage = 'Encountered one or more invalid tasks. Task must represent version as an object under the \'version\' key ' +
        'with Major, Minor, and Patch fields (that start with Uppercase letters)';

    suite('bumpTaskManifestFiles Suite:', () => {
        const errorMessage = 'Invalid arguments. Valid array of glob of task manifests must be specified';

        test('Should reject with an error when fileGlobs is null', done => {
            index.bumpTaskManifestFiles(null).catch(err => {
                assert.deepEqual(err.message, errorMessage);
                done();
            });
        });

        test('Should reject with an error when fileGlobs is undefined', done => {
            index.bumpTaskManifestFiles(undefined).catch(err => {
                assert.deepEqual(err.message, errorMessage);
                done();
            });
        });

        test('Should reject with an error when fileGlobs is not an array', done => {
            index.bumpTaskManifestFiles({}).catch(err => {
                assert.deepEqual(err.message, errorMessage);
                done();
            });
        });
    });

    suite('bumpTask Suite:', () => {
        test('Should throw an error when task is null', () => {
            assert.throws(() => index.bumpTask(null));
        });

        test('Should throw an error when task is undefined', () => {
            assert.throws(() => index.bumpTask(undefined));
        });

        test('Should throw an error when task does not have a version key', () => {
            assert.throws(() => index.bumpTask({}));
        });

        test('Should throw correct error when task version object is missing a key', () => {
            const badTask = helpers.createSampleTaskContents(0, 1);
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has wrong case key', () => {
            const badTask = helpers.createSampleTaskContents(0, 1);
            badTask.version.patch = 2;
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has NaN string property', () => {
            const badTask = helpers.createSampleTaskContents(0, 1, 'fooBarOo');
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has decimal string property', () => {
            const badTask = helpers.createSampleTaskContents('0', '1', '1.3');
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has empty string property', () => {
            const badTask = helpers.createSampleTaskContents('', '1', '0');
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has decimal numeric property', () => {
            const badTask = helpers.createSampleTaskContents(0, 1, 1.3);
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has negative whole number string property', () => {
            const badTask = helpers.createSampleTaskContents('0', '1', '-1');
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task version object has negative whole number numeric property', () => {
            const badTask = helpers.createSampleTaskContents(0, 1, -2);
            assert.throws(() => index.bumpTask(badTask), invalidTaskErrorMessage);
        });
    });

    suite('bumpTasks Suite:', () => {
        const invalidTasksParamErrorMessage = 'Invalid argument. First parameter must be valid array of tasks.';

        test('Should throw an error when task array is null', () => {
            assert.throws(() => index.bumpTasks(null), invalidTasksParamErrorMessage);
        });

        test('Should throw an error when task array is undefined', () => {
            assert.throws(() => index.bumpTasks(undefined), invalidTasksParamErrorMessage);
        });

        test('Should throw an error when task array contains task that does not have a version key', () => {
            assert.throws(() => index.bumpTasks([{}]));
        });

        test('Should throw correct error when task array contains task with version object that is missing a key', () => {
            const badTask = helpers.createSampleTaskContents(0, 1);
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has wrong case key', () => {
            const badTask = helpers.createSampleTaskContents(0, 1);
            badTask.version.patch = 2;
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has NaN string property', () => {
            const badTask = helpers.createSampleTaskContents(0, 1, 'fooBarOo');
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has decimal string property', () => {
            const badTask = helpers.createSampleTaskContents('0', '1', '1.3');
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has empty string property', () => {
            const badTask = helpers.createSampleTaskContents('', '1', '0');
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has decimal numeric property', () => {
            const badTask = helpers.createSampleTaskContents(0, 1, 1.3);
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has negative whole number string property', () => {
            const badTask = helpers.createSampleTaskContents('0', '1', '-1');
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });

        test('Should throw correct error when task array contains task with version object that has negative whole number numeric property', () => {
            const badTask = helpers.createSampleTaskContents(0, 1, -2);
            assert.throws(() => index.bumpTasks([ badTask ]), invalidTaskErrorMessage);
        });
    });
});
