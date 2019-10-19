# azp-bump
Library/CLI for bumping Azure Pipelines (formerly known as VSTS) Task Manifest files.

[![npm Version Badge][npm-version-badge]][npm-package-url]
[![npm Downloads Badge][npm-downloads-badge]][npm-package-url]
[![License Badge][license-badge]][license-url]  

[![CircleCI Badge][circleci-badge]][circleci-url]
[![AppVeyor Badge][appveyor-badge]][appveyor-url]
[![Test Results Badge][tests-badge]][sonar-tests-url]
[![Codecov Badge][codecov-badge]][codecov-url]
[![Sonar Quality Gate Badge][sonar-quality-gate-badge]][sonar-url]

## About
While versions are typically tracked as a string (i.e. `version: "1.2.3"`) in most places/tools, Azure Pipelines Tasks store the version of the task in the manifest file as an object. To make things more complicated, the version properties can be strings and/or numbers. For example:  
```json
{ 
  ...
  "version": {
    "Major": 1,
    "Minor": "3",
    "Patch": 0 
  },
  ...
}
```
Incrementing the versions of Azure Pipelines tasks is a critical part of the task lifecycle, but the object format of the task version makes it very difficult to bump using existing/common bumping tools.  

This utility provides both a CLI and API that make bumping Azure Pipelines Task versions simple! Checkout the [vsts-bump gulp plugin][gulp-vsts-bump-url] if you need to bump Azure Pipelines tasks from a gulp workflow.

## Install
Install the package with npm (you may want to install it as dev dependency or globally,  depending on your needs):  
```sh
npm i azp-bump
```

## Usage
Basic usage for the CLI follows the pattern `azp-bump <fileGlobs> [options..]` For example:  
```sh
azpd-bump tasks/**/task.json
```
See the [Arguments section][cli-arguments-section] and the [Options section][cli-options-section] for more detailed info. Make sure you **always** use forward slashes (`/`), even on Windows.

Basic usage for the core API function:
```js
// JavaScript
const azpBump = require('azp-bump');
// Or for TypeScript
import azpBump = require('azp-bump');

azpBump.bumpTaskManifestFiles([ 'tasks/**/task.json'])
    .then(bumpResult => console.log(bumpResult)
    .catch(err => console.error(err));
```

## CLI
The CLI executable is called `azp-bump` and can be invoked after it has been installed. 

Note that you can run `azp-bump -h` or `azp-bump --help` to get inline help information.

### Version
To get the version of `azp-bump` simply run `azp-bump -v` or `azp-bump --version`

### Setup
We typically recommend installing `azp-bump` as a dev dependency in your repos/packages where you need to bump your Azure Pipelines Tasks, and then adding an npm script to your `package.json` file. For example:

```json
{
  "scripts": [
    "tasks:bump": "azp-bump tasks/**/task.json"
  ]
}
```
### CLI Arguments
The only required argument is at least one file path or [file glob][glob-primer-url] that points to the task manifest file(s) you want to bump. Note that you can pass more than one file path/glob if needed. Make sure you **always** use forward slashes (`/`), even on Windows.

Some examples:

```sh
azp-bump src/**/task.json
azp-bump src/**/task.json tasks/**/task.json
```

### CLI Options
There are several options supported by the CLI that allow you to control certain bump settings. Any combination of the options can be used, but none are required.  

* `-t`, `--type` - Controls the bump type used. 

    * Allowed values: `major`,  `minor`, or `patch`.
    * Default value is `patch`. 
    * If the option is not supplied, or is supplied with an invalid value, then the default will be used.  

    Example usage:
    ```sh
    azp-bump -t minor tasks/**/task.json
    azp-bump --type major tasks/**/task.json
    ```  
* `-i`, `--indent` - Controls the type of spacing indent used when updating the task manifests.  

    * Allowed values: the numbers `1-10` (inclusive), or `t`, `tab`, `\t`.
    * Default value is `2`. 
    * Specifying the option with a number will result in using that number of space characters. Specifying one of the tab related strings will result in a tab character being used for spacing. If the option is not supplied, or is supplied with an invalid value, then the default will be used.  

    Example usage:
    ```sh
    azp-bump -i 4 tasks/**/task.json
    azp-bump -i tab tasks/**/task.json
    azp-bump --indent 8 tasks/**/task.json
    ```

* `-q`, `--quiet` - Add this flag to perform the bump quietly (suppress log output).  

    Example usage:
    ```sh
    azp-bump -q tasks/**/task.json
    azp-bump --quiet tasks/**/task.json
    ```

* `-p`, `--version-property-type` - Controls which property type to use for the version properties in the task manifests.  

    * Allowed values: `string` or `number`. 
    * Default value is `number`. 
    * Specifying the option `string` will result in the `Major`, `Minor`, and `Patch` values being set to strings in the updated task manifest files. For example: 
    ```json
    { 
        "version": {
            "Major": "1",
            "Minor": "2",
            "Patch": "3" 
        },
    }
    ``` 
    Specifying `number` will result in those values being set to numbers. For example:
    ```json
    { 
        "version": {
            "Major": 1,
            "Minor": 2,
            "Patch": 3 
        },
    }
    ``` 
    If the option is not supplied, or is supplied with an invalid value, then the default will be used.  

    Example usage:
    ```sh
    azp-bump -p string tasks/**/task.json
    azp-bump --version-property-type string tasks/**/task.json
    ```

## API
The `azp-bump` API provides functions for bumping task manifest files (similar to the CLI), as well as for bumping Azure Pipelines Task Objects. `azp-bump` ships with its corresponding TypeScript declaration file so the API can be easily consumed from both JavaScript and TypeScript codebases.

API Functions:
- [bumpTaskManifestFiles][bump-task-manifest-files-function-section]
- [bumpTask][bump-task-function-section]
- [bumpTasks][bump-tasks-function-section]

### bumpTaskManifestFiles
This is the main function of the API that performs the same action as the CLI: this will bump the version of the specified task manifest files. 

```js
// JavaScript
const azpBump = require('azp-bump');
// Or for TypeScript
import azpBump = require('azp-bump');

azpBump.bumpTaskManifestFiles([ 'tasks/**/task.json'])
    .then(bumpResult => console.log(bumpResult)
    .catch(err => console.error(err));
```

#### azpBump.bumpTaskManifestFiles(fileGlobs, [opts])

* `fileGlobs` `{Array<string>}` An array of file globs that match the Azure Pipelines Task Manifest files. Make sure you **always** use forward slashes (`/`), even on Windows.
* `opts` `{Object}` The configuration options (more details below)
* returns: `{Promise<Object>}` (more details below)

##### opts Properties
The `opts` parameter has properties very similar to the [CLI options][cli-options-section]. All properties are optional, and for any property not specified, or specified with an invalid value, the default will be used.

* `opts.type` `{string}` Specifies the bump type to use
    * Allowed values: `major`, `minor`, or `patch`
    * Default value: `patch`
* `opts.quiet` `{boolean}` When enabled, log output will be suppressed and the bump will be performed quietly
    * Default value: `false`
* `opts.indent` `{string|number}` Specifies the amount of spacing indent to use in the updated task manifest files. Specifying a number will result in that amount of space characters being used, specifying a tab will result in a tab character being used.
    * Allowed values: `1-10` (inclusive) for spaces OR `tab`, `t`, `\t` for a tab.
    * Default value: `2`
* `opts.versionPropertyType` `{string}` Specifies which type the version property values will be emitted as after the bump
    * Allowed values: `number` or `string`
    * Default value: `number`
    * Examples: 
        Specifying `string` will result in the version property values being strings:
        ```json
        { 
          "version": {
            "Major": "1",
            "Minor": "2",
            "Patch": "3" 
          },
        }
        ``` 
        Specifying `number` will result in those values being set to numbers:
        ```json
        { 
          "version": {
            "Major": 1,
            "Minor": 2,
            "Patch": 3 
          },
        }
        ``` 

Example usage with `opts`:
```js
// JavaScript
const azpBump = require('azp-bump');
// Or for TypeScript
import azpBump = require('azp-bump');

azpBump.bumpTaskManifestFiles(['tasks/**/task.json'], { type: 'minor', indent: 't' })
    .then(bumpResult => console.log(bumpResult)
    .catch(err => console.error(err));
```

For more info on opts, check the corresponding [jsdoc][opts-jsdoc-url] and [typedef][opts-typedef-url] content.

##### return 
The `bumpTaskManifestFiles` function returns a Promise that upon successful completion will resolve with an object that contains information about the bump result. That bump result object has the below properties:

* `bumpType` `{string}` The type of bump that was performed
* `bumpedFiles` `{Object[]}` An array of objects with information about each task manifest file that was bumped. Each object in the `bumpedFiles` array contains these properties:
    * `filePath` `{string}` The path of the task manifest file that was bumped.
    * `initialVersion` `{string}` The version initially contained in the task manifest file *before* the bump was performed.
    * `bumpedVersion` `{string}` The updated version that now resides in the task manifest file *after* the bump was performed 

For more info on opts, check the corresponding [jsdoc][bumpresult-jsdoc-url] and [typedef][bumpresult-typedef-url] content.

### bumpTask
The `bumpTask` function is also provided for when you want to bump an object representation of a Azure Pipelines Task Manifest file (for example if you are parsing the manifest files elsewhere). Note that the [bumpTasks][bump-tasks-function-section] function performs the same action but allows you to pass an array of tasks instead.

```js
// JavaScript
const azpBump = require('azp-bump');
// Or for TypeScript
import azpBump = require('azp-bump');

const azpBump = getTaskFromSomewhere(...);
azpBump.bumpTask(azpTask);
```

#### azpBump.bumpTask(task, [bumpType])
* `task` `{Object}` The Azure Pipelines Task Object. 
    * Must contain a `version` property that is an object with properties `Major`, `Minor`, and `Patch`. For example:
    ```js
    const task = {
        version: {
            Major: 0,
            Minor: 1,
            Patch: 2
        }
    };
    azpBump.bumpTask(task)
    ```
* `bumpType` `{string}` The type of bump to use.
    * Allowed values: `major`, `minor`, `patch`
    * Default Value: `patch`
* throws: Will throw an error when the provided task is invalid

See the corresponding [jsdoc][vststask-jsdoc-url] and [typedef][vststask-typedef-url] sections for more info.

### bumpTasks
This function is **exactly** the same as the [bumpTask][bump-task-function-section] function except that it takes an array of task objects so that it can be used to bump multiple tasks. 

Parameters:
* `tasks` `{Object[]}` The Azure Pipelines Task Objects. 
* `bumpType` `{string}` The type of bump to use.
    * Allowed values: `major`, `minor`, `patch`
    * Default Value: `patch`
* throws: Will throw an error if any of the provided tasks are invalid

## Contributing
All contributions are welcome!  

Need to open an issue? Click the below links to create one:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

See the [Guidelines][contrib-dev-url] for more info about building and developing.

## License
MIT - see license details [here][license-url] 

[Back to Top][top-url]

[npm-version-badge]: https://img.shields.io/npm/v/azp-bump.svg
[npm-downloads-badge]: https://img.shields.io/npm/dt/azp-bump.svg
[npm-package-url]: https://www.npmjs.com/package/azp-bump
[license-url]: ./LICENSE
[license-badge]: https://img.shields.io/github/license/swellaby/azp-bump.svg
[tests-badge]: https://img.shields.io/appveyor/tests/swellaby/vsts-bump/master.svg?label=unit%20tests
[appveyor-url]: https://ci.appveyor.com/project/swellaby/vsts-bump
[appveyor-badge]: https://img.shields.io/appveyor/ci/swellaby/vsts-bump/master.svg?label=windows%20build
[circleci-url]: https://circleci.com/gh/swellaby/vsts-bump
[circleci-badge]: https://img.shields.io/circleci/project/github/swellaby/vsts-bump/master.svg?label=linux%20build
[codecov-badge]: https://img.shields.io/codecov/c/github/swellaby/vsts-bump/master.svg
[codecov-url]: https://codecov.io/gh/swellaby/vsts-bump
[sonar-quality-gate-badge]: https://sonarcloud.io/api/project_badges/measure?project=swellaby%3Avsts-bump&metric=alert_status
[sonar-url]: https://sonarcloud.io/dashboard?id=swellaby%3Avsts-bump
[sonar-tests-url]: https://sonarcloud.io/component_measures?id=swellaby%3Avsts-bump&metric=tests
[gulp-vsts-bump-url]: https://www.npmjs.com/package/gulp-vsts-bump
[glob-primer-url]: https://github.com/isaacs/node-glob#glob-primer
[cli-arguments-section]: #cli-arguments
[cli-options-section]: #cli-options
[bump-task-manifest-files-function-section]: #bumptaskmanifestfiles
[bump-task-function-section]: #bumptask
[bump-tasks-function-section]: #bumptasks
[create-bug-url]: https://github.com/swellaby/vsts-bump/issues/new?template=BUG_TEMPLATE.md&labels=bug,unreviewed&title=Bug:%20
[create-question-url]: https://github.com/swellaby/vsts-bump/issues/new?template=QUESTION_TEMPLATE.md&labels=question,unreviewed&title=Q:%20
[create-enhancement-url]: https://github.com/swellaby/vsts-bump/issues/new?template=ENHANCEMENT_TEMPLATE.md&labels=enhancement,unreviewed&title=E:%20
[contrib-dev-url]: ./.github/CONTRIBUTING.md#developing
[opts-jsdoc-url]: https://github.com/swellaby/vsts-bump/blob/master/lib/index.js#L8
[opts-typedef-url]: https://github.com/swellaby/vsts-bump/blob/master/lib/index.d.ts#L10
[bumpresult-jsdoc-url]: https://github.com/swellaby/vsts-bump/blob/master/lib/index.js#L42
[bumpresult-typedef-url]: https://github.com/swellaby/vsts-bump/blob/master/lib/index.d.ts#L82
[vststask-jsdoc-url]: https://github.com/swellaby/vsts-bump/blob/master/lib/index.js#L31
[vststask-typedef-url]: https://github.com/swellaby/vsts-bump/blob/master/lib/index.d.ts#L105
[top-url]: #azp-bump
[gulp-vsts-bump-url]: https://www.npmjs.com/package/gulp-vsts-bump
