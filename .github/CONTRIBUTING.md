# Contributing
All contributions are welcomed!

## Opening Issues
Click the below quick links to create a new issue:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

## Developing
All that is needed to work with this repo is [Node.js][nodejs-url] and your favorite editor or IDE, although we recommend [VS Code][vscode-url].

### Building
To build and/or work on this project:

Clone the repo, change into the directory where you cloned the directory, and then run the developer setup script
```sh     
git clone https://github.com/swellaby/vsts-bump.git
cd vsts-bump 
npm run dev:setup
```

### Submitting changes
Swellaby members should create a branch within the repository, make changes there, and then submit a PR. 

Outside contributors should fork the repository, make changes in the fork, and then submit a PR.

### git hooks
This repo utilizes the [husky][husky-url] module for the [git pre-commit hook][git-hook-url]. As such, when you run a `git commit`, the pre-commit hook will run a script to ensure the linter still passes, that all tests still pass, and that code coverage is still at 100%. If the script fails your commit will be rejected, and you will need to fix the issue(s) before attempting to commit again.  

You can optionally skip this hook by including the `-n` switch (i.e. `git commit -n -m "..."`) if you are only trying to commit non-code content, like a markdown or package.json file.

### Resetting workspace
You may occasionally want and/or need to reset your workspace, especially if you haven't updated your local workspace in a while. To do so, simply run the reset script. This will clean up all generated directories and content, and will also update your local dependencies.

```sh
npm run dev:reset
```

### Tests
We use [Mocha][mocha-url] and [Sinon][sinon-url] to test and validate, and the tests are written using [Mocha's TDD interface][mocha-tdd-url].  

There are suites of [unit tests][unit-test] that validate individual functions in complete isolation, and there are also [component tests][comp-test] that use validate multiple components of the module in conjunction. Additionally, there are functional tests in a separate repository [here][functional-tests] that validate end-to-end functionality of both the CLI and API.

The tests will be run as part of the npm `build` script and on a git commit, but there are npm scripts you can use to run the test suites directly. The test results will be displayed in the console.

Run the unit tests:
```sh
npm run test:unit
```  

Run the component tests:
```sh
npm run test:component
```

Run both unit and component tests:
```sh
npm run test:all
```

You must write corresponding unit and component tests for any code you add or modify, and all tests must pass before those changes can be merged back to the master branch.

### Code coverage
Code coverage is generated, and enforced using [Istanbuljs/nyc][nyc-url]. The unit test suite has 100% coverage of the application source code, and similarly the component test suite also has 100% coverage. Code coverage will not be allowed to dip below 100%.

The tests will be run as part of the npm `build` script and on a git commit, but there are also several coverage related `npm scripts` that you can run to generate and/or view the coverage details.  

Generate latest coverage for the unit tests:
```sh
npm run coverage
```  

Open the detailed HTML coverage report for the unit tests:
```sh
npm run coverage:open
```

Generate latest coverage for the component tests:
```sh
npm run coverage:component
```  

Open the detailed HTML coverage report for the component tests:
```sh
npm run coverage:component:open
```

### Linting
This repo uses [eslint][eslint-url] for linting the source code. eslint is automatically run when you run the npm `build` script and when you make a commit. The eslint configuration file can be found in the [config][config] directory.

You can run [eslint][eslint-url] at any time by executing the npm `lint` script:

```sh
npm run lint
```  

 [Back to Top][top]

[create-bug-url]: https://github.com/swellaby/vsts-bump/issues/new?template=BUG_TEMPLATE.md&labels=bug,unreviewed&title=Bug:%20
[create-question-url]: https://github.com/swellaby/vsts-bump/issues/new?template=QUESTION_TEMPLATE.md&labels=question,unreviewed&title=Q:%20
[create-enhancement-url]: https://github.com/swellaby/vsts-bump/issues/new?template=ENHANCEMENT_TEMPLATE.md&labels=enhancement,unreviewed
[nodejs-url]:https://nodejs.org/en/download/
[vscode-url]: https://code.visualstudio.com/
[husky-url]: https://www.npmjs.com/package/husky
[git-hook-url]: https://git-scm.com/docs/githooks#_pre_commit
[eslint-url]: https://eslint.org/
[mocha-url]: https://mochajs.org/
[mocha-tdd-url]: https://mochajs.org/#tdd
[sinon-url]: sinonjs.org/
[nyc-url]: https://istanbul.js.org/
[unit-test]: ../test/unit/
[comp-test]: ../test/component/
[top]: CONTRIBUTING.md#contributing
[functional-tests]: https://github.com/swellaby/vsts-bump-tests
