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
            assert.isTrue(commanderVersionSpy.calledWithExactly(packageJson.version, '-v, --version'));
        });

        test('Should correctly set usage', () => {
            assert.isTrue(commanderUsageSpy.calledWithExactly('<files> [options...]'));
        });

        test('Should correctly set type option', () => {
            const typeRegex = /^(patch|minor|major)$/i;
            const typeDescription = 'The bump version type. Allowed values: major, minor, or patch.';
            assert.isTrue(commanderOptionSpy.calledWithExactly('-t, --type [type]', typeDescription, typeRegex, 'patch'));
        });

        test('Should correctly set indent option', () => {
            const indentDescription = 'The spacing indent to use while updating the task manifests. Specifying a number will use that many spaces, ' +
                'or a string to use a tab character. Allowed values: 1-10 (inclusive) OR t, tab, or \'\\t\'.';
            assert.isTrue(commanderOptionSpy.calledWithExactly('-i, --indent [indent]', indentDescription, cli.parseIndent, 2));
        });

        test('Should correctly set quiet option', () => {
            assert.isTrue(commanderOptionSpy.calledWithExactly('-q, --quiet', 'Including this flag will disable the log output'));
        });

        test('Should correctly set version property type option', () => {
            const typeRegex = /^(string|number)$/i;
            const versionPropertyTypeDescription = 'Controls the property type of the version fields. Allowed values: string, number.';
            assert.isTrue(commanderOptionSpy.calledWithExactly('-p, --version-property-type [versionPropertyType]', versionPropertyTypeDescription, typeRegex, 'number'));
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

    suite('parseIndent Suite:', () => {
        test('Should return tab character when specified indent is t', () => {
            assert.deepEqual(cli.parseIndent('t'), helpers.tabCharacter);
        });

        test('Should return tab character when specified indent is tab', () => {
            assert.deepEqual(cli.parseIndent('tab'), helpers.tabCharacter);
        });

        test('Should return tab character when specified indent is tab character', () => {
            assert.deepEqual(cli.parseIndent('\\t'), helpers.tabCharacter);
        });

        test('Should return number when specified indent is one as a string', () => {
            assert.deepEqual(cli.parseIndent('1'), 1);
        });

        test('Should return number when specified indent is ten as a string', () => {
            assert.deepEqual(cli.parseIndent('10'), 10);
        });
    });
});
