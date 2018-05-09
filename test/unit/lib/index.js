'use strict';

const assert = require('chai').assert;
const index = require('../../../lib/index');

suite('index Suite:', () => {
    suite('bump Suite:', () => {
        test('Should throw not implemented error', () => {
            assert.throws(() => index.bump(), 'Not yet implemented');
        });
    });

    suite('bumpWrite Suite:', () => {
        test('Should throw not implemented error', () => {
            assert.throws(() => index.bumpWrite(), 'Not yet implemented');
        });
    });
});