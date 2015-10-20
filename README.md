[![Build Status](https://travis-ci.org/AMPATH/ng-amrs.svg?branch=master)](https://travis-ci.org/AMPATH/ng-amrs)

# ng-amrs

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Build & development
1. Clone this respository.
2. npm install
3. bower install

All authentication is done through OpenMRS. To avoid cors issues, it's easiest to build the app and copy to your tomcat6 webapps directory. Otherwise, use a cors browser plugin to turn off cors when making requests.

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
