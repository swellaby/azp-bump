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
    let indexBumpWriteStub;
    let cli;

    setup(() => {
        indexBumpWriteStub = sandbox.stub(index, 'bumpWrite');
        cli = require('../../../bin/vsts-bump');
    });

    teardown(() => {
        sandbox.restore();
    });

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
