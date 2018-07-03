'use strict';

const assert = require('chai').assert;
const commander = require('commander');
const log = require('fancy-log');
const sinon = require('sinon');

const helpers = require('../../helpers');
const index = require('../../../lib/index');
const packageJson = require('../../../package.json');

suite('bin/vsts-bump Suite:', () => {
    const sandbox = sinon.createSandbox();
    const commanderVersionSpy = sinon.spy(commander, 'version');
    const commanderUsageSpy = sinon.spy(commander, 'usage');
    const commanderOptionSpy = sinon.spy(commander, 'option');
    const commanderParseStub = sinon.stub(commander, 'parse');
    let logInfoStub;
    let logErrorStub;
    const args = [ 'src/*.js', 'test/**/*.js' ];
    let opts = {};
    let commanderOptsStub;
    let indexBumpTaskManifestFilesStub;
    let cli;
    let processExitStub;

    setup(() => {
        processExitStub = sandbox.stub(process, 'exit');
        indexBumpTaskManifestFilesStub = sandbox.stub(index, 'bumpTaskManifestFiles');
        indexBumpTaskManifestFilesStub.callsFake(() => Promise.resolve(helpers.bumpResult));
        logInfoStub = sandbox.stub(log, 'info');
        logErrorStub = sandbox.stub(log, 'error');
        opts = {};
        opts.type = helpers.minorReleaseType;
        opts.indent = 4;
        commander.opts = () => null;
        commanderOptsStub = sinon.stub(commander, 'opts').callsFake(() => opts);
        commander.args = args;
        cli = require('../../../bin/vsts-bump');
        commander.args = args;
    });

    teardown(() => {
        sandbox.restore();
    });

    suiteTeardown(() => {
        sinon.restore();
    });

    suite('CLI config Suite:', () => {
        test('Should correctly set version', () => {
            assert.isTrue(commanderVersionSpy.calledWith(packageJson.version));
        });

        test('Should correctly set usage', () => {
            assert.isTrue(commanderUsageSpy.calledWith('<files> [options...]'));
        });

        test('Should correctly set type option', () => {
            const typeRegex = /^(patch|minor|major)$/i;
            assert.isTrue(commanderOptionSpy.calledWith('-t, --type [type]', 'the bump version type', typeRegex));
        });

        test('Should correctly set indent option', () => {
            assert.isTrue(commanderOptionSpy.calledWith('-i, --indent [indent]', 'the indent to use'));
        });

        test('Should correctly set quiet option', () => {
            assert.isTrue(commanderOptionSpy.calledWith('-q, --quiet', 'controls suppression of the log output'));
        });

        test('Should correctly set verison property type option', () => {
            const typeRegex = /^(string|number)$/i;
            const description = 'controls the property type of the version fields';
            assert.isTrue(commanderOptionSpy.calledWith('-v, --version-property-type [versionPropertyType]', description, typeRegex));
        });

        test('Should call parse with process.argv', () => {
            assert.isTrue(commanderParseStub.calledWith(process.argv));
        });
    });

    suite('bump Suite:', () => {
        const failureErrorMessageBase = 'Fatal error encountered. ';

        test('Should pass correct parameters to bumpTaskManifestFiles', () => {
            cli.bump();
            assert.isTrue(commanderOptsStub.called);
            assert.isTrue(indexBumpTaskManifestFilesStub.calledWith(args, opts));
        });

        test('Should handle fatal bump error correctly when error has message details', done => {
            const errorDetails = 'Crikey';
            indexBumpTaskManifestFilesStub.callsFake(() => Promise.reject(new Error(errorDetails)));
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(failureErrorMessageBase + errorDetails));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });

        test('Should handle fatal bump error correctly when error has no message details', done => {
            indexBumpTaskManifestFilesStub.callsFake(() => Promise.reject(new Error()));
            cli.bump().then(() => {
                assert.isTrue(logErrorStub.calledWith(failureErrorMessageBase + 'unknown'));
                assert.isTrue(processExitStub.calledWith(1));
                done();
            }).catch(err => done(err));
        });

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
});
