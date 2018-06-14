'use strict';

const assert = require('chai').assert;
const index = require('../../../lib/index');

suite('index Suite:', () => {
    suite('getBumpedTasks Suite:', () => {
        test('Should throw not implemented error', () => {
            assert.throws(() => index.getBumpedTasks(), 'Not yet implemented');
        });
    });

    suite('bumpTaskManifests Suite:', () => {
        test('Should throw not implemented error', () => {
            assert.throws(() => index.bumpTaskManifests(), 'Not yet implemented');
        });
    });
});