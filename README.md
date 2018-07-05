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
    version: {
        Major: 1,
        Minor: "3",
        Patch: 0 
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
Basic usage for the CLI:  
```sh
vsts-bump tasks/**/task.json
```

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
### Arguments
- `file globs`

The only required argument is a file path or [glob][glob-primer-url] that points to the task manifest file(s) you want to bump. For example: `vsts-bump src/**/task.json`. You can pass more than one file path/glob if needed:

```sh
vsts-bump src/**/task.json task/**/task.json
```

### Options
* `-t`, `--type`
    Use this to specify the bump type to use. Options are: `major`,  `minor`, or `patch`. The default value is `patch` If the option is not supplied, or is supplied with an invalid value then the default will be used.  
    Example usage:
    ```sh
    vsts-bump -t minor tasks/**/task.json
    ```

## API

## Contributing

## License

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