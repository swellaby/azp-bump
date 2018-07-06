# vsts-bump
Library/CLI for bumping VSTS Task files. (Functional but still in Beta/Preview)

[![npm Version Badge][npm-version-badge]][npm-package-url]
[![npm Downloads Badge][npm-downloads-badge]][npm-package-url]
[![License Badge][license-badge]][license-url]  

[![CircleCI Badge][circleci-badge]][circleci-url]
[![AppVeyor Badge][appveyor-badge]][appveyor-url]
[![Test Results Badge][tests-badge]][appveyor-url]
[![Codecov Badge][codecov-badge]][codecov-url]
[![Sonar Quality Gate Badge][sonar-quality-gate-badge]][sonar-url]

## About
While versions are typically tracked as a string (i.e. `version: "1.2.3"`) in most places/tools, VSTS Tasks store the version of the task in the manifest file as an object. To make things more complicated, the version properties can be strings and/or numbers. For example:  
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
Incrementing the versions of VSTS tasks is a critical part of the task lifecycle, but the object format of the task version makes it very difficult to bump using existing/common bumping tools.  

This utility makes bumping your VSTS tasks super simple via both a CLI and API.

## Install
Install the package with npm (you may want to install it as dev dependency or globally depending):  
```sh
npm i vsts-bump
```

## Usage
Basic usage for the CLI follows the pattern `vsts-bump <fileGlobs> [options..]`. For example:  
```sh
vsts-bump tasks/**/task.json
```
See the [Arguments section][cli-arguments-section] and the [Options section][cli-options-section] for more detailed info.

Basic usage for the core API function:
```js
// JavaScript
const vstsBump = require('vsts-bump');
// Or for TypeScript
import vstsBump = require('vsts-bump');

vstsBump.bumpTaskManifestFiles([ 'tasks/**/task.json']);
```

## CLI
The CLI executable is called `vsts-bump` and can be invoked after it has been installed. 

Note that you can run `vsts-bump -h` or `vsts-bump --help` to get inline help information.

### Version
To get the version of `vsts-bump` simply run `vsts-bump -v` or `vsts-bump --version`

### Setup
We typically recommand installing `vsts-bump` as a dev dependency in your repos/packages where you need to bump your VSTS Tasks, and then adding an npm script to your `package.json` file. For example:

```json
{
    "scripts": [
        "tasks:bump": "vsts-bump tasks/**/task.json"
    ]
}
```
### CLI Arguments
The only required argument is at least one file path or [file glob][glob-primer-url] that points to the task manifest file(s) you want to bump. Note that you can pass more than one file path/glob if needed. Some examples:

```sh
vsts-bump src/**/task.json
vsts-bump src/**/task.json task/**/task.json
```

### CLI Options
There are several options supported by the CLI that allow you to control certain bump settings. All of the options can be used together if desired, none of the options are required.  

* `-t`, `--type` - Controls the bump type used. 

    Options are: `major`,  `minor`, or `patch`. The default value is `patch`. If the option is not supplied, or is supplied with an invalid value, then the default will be used.  

    Example usage:
    ```sh
    vsts-bump -t minor tasks/**/task.json
    vsts-bump --type major tasks/**/task.json
    ```  
* `-i`, `--indent` - Controls the type of spacing indent used when updating the task manifests.  

    Options are: the numbers `1-10` (inclusive), or `t`, `tab`, `\t`. The default value is `2`. Specifying the option with a number will result in using that number of space characters. Specifying one of the tab related strings will result in a tab character being used for spacing. If the option is not supplied, or is supplied with an invalid value, then the default will be used.  

    Example usage:
    ```sh
    vsts-bump -i 4 tasks/**/task.json
    vsts-bump -i tab tasks/**/task.json
    vsts-bump --indent 8 tasks/**/task.json
    ```

* `-q`, `--quiet` - Add this flag to perform the bump quietly (suppress log output).  

    Example usage:
    ```sh
    vsts-bump -q tasks/**/task.json
    vsts-bump --quiet tasks/**/task.json
    ```

* `-p`, `--version-property-type` - Controls which property type to use for the version properties in the task manifests.  

    Options are: `string` or `number`. The default value is `number`. Specifying the option `string` will result in the `Major`, `Minor`, and `Patch` values being set to strings in the updated task manifest files. For example: 
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
    vsts-bump -p string tasks/**/task.json
    vsts-bump --version-property-type string tasks/**/task.json
    ```

## API
The `vsts-bump` API provides functions for bumping task manifest files (similar to the CLI), as well as for bumping VSTS Task Objects. `vsts-bump` ships with its corresponding TypeScript declaration file so the API can be easily consumed from both JavaScript and TypeScript codebases.

API Functions:
- [bumpTaskManifestFiles][bump-task-manifest-files-function-section]
- [bumpTask][bump-task-function-section]
- [bumpTasks][bump-tasks-function-section]

### bumpTaskManifestFiles
This is the main function of the API that performs the same action as the CLI: this will bump the version of the specified task manifest files. 

#### bumpTaskManifestFiles Options

### bumpTask

### bumpTasks

## Contributing
All contributions are welcome!  

Need to open an issue? Click the below links to create one:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

See the [Guidelines][contrib-dev-url] for more info about building and developing.

## License
MIT - see license details [here][license-url] 

[npm-version-badge]: https://img.shields.io/npm/v/vsts-bump.svg
[npm-downloads-badge]: https://img.shields.io/npm/dt/vsts-bump.svg
[npm-package-url]: https://www.npmjs.com/package/vsts-bump
[license-url]: ./LICENSE
[license-badge]: https://img.shields.io/github/license/swellaby/vsts-bump.svg
[tests-badge]: https://img.shields.io/appveyor/tests/swellaby/vsts-bump.svg?label=unit%20tests
[appveyor-url]: https://ci.appveyor.com/project/swellaby/vsts-bump
[appveyor-badge]: https://img.shields.io/appveyor/ci/swellaby/vsts-bump.svg?label=windows%20build
[circleci-url]: https://circleci.com/gh/swellaby/vsts-bump
[circleci-badge]: https://img.shields.io/circleci/project/github/swellaby/vsts-bump.svg?label=linux%20build
[codecov-badge]: https://img.shields.io/codecov/c/github/swellaby/vsts-bump.svg
[codecov-url]: https://codecov.io/gh/swellaby/vsts-bump
[sonar-quality-gate-badge]: https://sonarcloud.io/api/project_badges/measure?project=swellaby%3Avsts-bump&metric=alert_status
[sonar-url]: https://sonarcloud.io/dashboard?id=swellaby%3Avsts-bump
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
