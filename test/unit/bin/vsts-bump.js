'use strict';

const assert = require('chai').assert;
const commander = require('commander');
const sinon = require('sinon');
const index = require('../../../lib/index');
const packageJson = require('../../../package.json');

suite('bin/vsts-bump Suite:', () => {
    const sandbox = sinon.createSandbox();
    const commanderVersionSpy = sinon.spy(commander, 'version');
    const commanderUsageSpy = sinon.spy(commander, 'usage');
    const commanderOptionSpy = sinon.spy(commander, 'option');
    const commanderParseStub = sinon.stub(commander, 'parse');
    const args = [ 'src/*.js', 'test/**/*.js' ];
    const opts = {
        type: 'minor',
        indent: 4
    };
    let commanderOptsStub;
    let indexBumpTaskManifestsStub;
    let cli;

    setup(() => {
        indexBumpTaskManifestsStub = sandbox.stub(index, 'bumpTaskManifests');
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
            assert.isTrue(commanderOptionSpy.calledWith('-t, --type [type]', 'the bump version type'));
        });

        test('Should correctly set indent option', () => {
            assert.isTrue(commanderOptionSpy.calledWith('-i, --indent [indent]', 'the indent to use'));
        });

        test('Should call parse with process.argv', () => {
            assert.isTrue(commanderParseStub.calledWith(process.argv));
        });
    });

    test('Should pass correct parameters to bumpWrite', () => {
        cli.bump();
        assert.isTrue(commanderOptsStub.called);
        assert.isTrue(indexBumpTaskManifestsStub.calledWith(args, opts));
    });
});
