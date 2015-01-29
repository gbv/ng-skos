# Development guidelines

First, **clone** the repository from <https://github.com/gbv/ng-skos>.

Second, install Node.js unless it is already installed. Node.js includes `npm`
to install additional packages. Locally **install all required packages**
listed in `package.json` (for global installation call `npm` via `sudo -H`):

    npm install -g grunt-cli
    npm install

Testing is configured in `karma.conf.js` and **unit tests** are located in
directory `test` written with [Jasmine](http://pivotal.github.io/jasmine/). 

To execute of all unit tests call:

    grunt test

For contious testing (tests are re-run on changes), call:

    grunt watch

As configured in `.travis.yml` the tests are automatically 
[executed at travis-ci](https://travis-ci.org/gbv/ng-skos)
when pushed to GitHub.

To build the **documentation**, written using
[ngdoc](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation),
call

    grunt docs

## Release

The version number consists of three numeric parts:

* Bug fixes and other minor changes: Patch release, increment the last number
* New features which don't break existing features: Minor release, increment the middle number
* Changes which break backwards compatibility: Major release, increment the first number

A suffix can be added for developer releases.

Major and minor release 0.0 may change features also in patch releases.

Only release after successful tests!

    npm publish

