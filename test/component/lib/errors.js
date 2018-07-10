// 'use strict';

// const assert = require('chai').assert;
// const fs = require('fs');
// const Glob = require('glob').Glob;
// const semver = require('semver');
// const sinon = require('sinon');

// const helpers = require('../../helpers');
// const index = require('../../../lib/index');

// suite('lib errors Suite:', () => {
//     let globOnEndStub;
//     let globOnErrorStub;
//     let fsReadFileStub;
//     let fsWriteFileStub;
//     const validTaskFileContents = JSON.stringify(helpers.validSampleOneTaskContents);
//     const opts = {};
//     const failureErrorMessageBase = 'Fatal error occurred while attempting to bump file. Details: ';
//     const noDetailsErrorMessage = failureErrorMessageBase + 'unknown';

//     setup(() => {
//         const globOnStub = sinon.stub(Glob.prototype, 'on');
//         globOnEndStub = globOnStub.withArgs(helpers.globEndEventName);
//         globOnErrorStub = globOnStub.withArgs(helpers.globErrorEventName);
//         fsReadFileStub = sinon.stub(fs, 'readFile');
//         fsReadFileStub.yields(null, validTaskFileContents);
//         fsWriteFileStub = sinon.stub(fs, 'writeFile');
//         fsWriteFileStub.yields(null);
//     });

//     teardown(() => {
//         sinon.restore();
//     });

//     // test('')
// });