'use strict';

const chalk = require('chalk');

const patchReleaseType = 'patch';
const minorReleaseType = 'minor';
const majorReleaseType = 'major';
const defaultReleaseType = patchReleaseType;

const defaultJsonIndent = 2;
const stringVersionPropertyType = 'string';
const numberVersionPropertyType = 'number';
const defaultVersionPropertyType = numberVersionPropertyType;

const defaultOptions = {
    type: defaultReleaseType,
    indent: defaultJsonIndent,
    versionPropertyType: defaultVersionPropertyType
};

const major = 0;
const minor = 8;
const patch = 2;
const majorStr = major.toString();
const minorStr = minor.toString();
const patchStr = patch.toString();
const zeroStr = '0';

const createVersionObject = ((major, minor, patch) => {
    return {
        Major: major,
        Minor: minor,
        Patch: patch
    };
});

const createSampleTaskContents = ((major, minor, patch) => {
    return {
        decription: 'test',
        id: 'asdf876asdfkasd',
        name: 'test-task',
        version: createVersionObject(major, minor, patch)
    };
});

const validSampleOneTaskContents = createSampleTaskContents(majorStr, minorStr, patchStr);
const validSampleOneNumericVersionTaskContents = createSampleTaskContents(major, minor, patch);
const validSampleOneNumericBumpedVersionTaskContents = createSampleTaskContents(major, minor, patch + 1);
const invalidSampleOneTaskContents = createSampleTaskContents('abc', minorStr, patchStr);
const filePath = './src/foo.js';

const buildTaskFile = ((fileContents) => {
    return {
        contents: JSON.stringify(fileContents),
        isNull: () => false,
        isStream: () => false,
        path: filePath
    };
});

const initialVersion = major + '.' + minor + '.' + patch;
const bumpedVersion = major + '.' + minor + '.' + (patch + 1);

const initialVersionMessage = 'Bumped ' + chalk.blue(initialVersion);
const newVersionMessage = ' to ' + chalk.magenta(bumpedVersion);
const bumpTypeMessage = ' with type: ' + chalk.blue(defaultReleaseType);
const logMessage = initialVersionMessage + newVersionMessage + bumpTypeMessage;

const streamDataEventName = 'data';
const streamErrorEventName = 'error';

module.exports = {
    pluginName: 'gulp-vsts-bump',
    patchReleaseType: patchReleaseType,
    minorReleaseType: minorReleaseType,
    majorReleaseType: majorReleaseType,
    defaultReleaseType: defaultReleaseType,
    majorVersion: major,
    minorVersion: minor,
    patchVersion: patch,
    majorVersionStr: majorStr,
    minorVersionStr: minorStr,
    patchVersionStr: patchStr,
    initialVersion: initialVersion,
    bumpedVersion: bumpedVersion,
    filePath: filePath,
    validSampleOneTaskFile: buildTaskFile(validSampleOneTaskContents),
    invalidSampleOneTaskFile: buildTaskFile(invalidSampleOneTaskContents),
    bumpedTaskFile: buildTaskFile(validSampleOneNumericBumpedVersionTaskContents),
    createSampleTaskContents: createSampleTaskContents,
    createVersionObject: createVersionObject,
    initialVersionObject: createVersionObject(majorStr, minorStr, patchStr),
    bumpedPatchVersionStringObject: createVersionObject(majorStr, minorStr, (patch + 1).toString()),
    bumpedMinorVersionStringObject: createVersionObject(majorStr, (minor + 1).toString(), zeroStr),
    bumpedMajorVersionStringObject: createVersionObject((major + 1).toString(), zeroStr, zeroStr),
    bumpedPatchVersionNumberObject: createVersionObject(major, minor, (patch + 1)),
    bumpedMinorVersionNumberObject: createVersionObject(major, (minor + 1), 0),
    bumpedMajorVersionNumberObject: createVersionObject((major + 1), 0, 0),
    validSampleOneTaskContents: validSampleOneTaskContents,
    validSampleOneNumericVersionTaskContents: validSampleOneNumericVersionTaskContents,
    invalidSampleOneTaskContents: invalidSampleOneTaskContents,
    expectedLogMessage: logMessage,
    streamDataEventName: streamDataEventName,
    streamErrorEventName: streamErrorEventName,
    defaultJsonIndent: defaultJsonIndent,
    stringVersionPropertyType: stringVersionPropertyType,
    numberVersionPropertyType: numberVersionPropertyType,
    defaultVersionPropertyType: defaultVersionPropertyType,
    defaultOptions: defaultOptions,
    validSampleOneNumericBumpedVersionTaskContents: validSampleOneNumericBumpedVersionTaskContents
};