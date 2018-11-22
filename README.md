# NPM Package Updater

A quick way to automatically update dependencies in a package.json file, thanks in large part to [https://npms.io/](https://npms.io/) for a great public api.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#issues)

## Installation

This is quite a simple project. There is currently no build step. It is available to use here:

[NPM Package Updater](https://freemagee.github.io/npm-package-updater/)

Bear in mind that this is a blunt tool and will update all packages.

## Usage

Paste the complete contents of your package.json where instructed. The JSON will be parsed and the sections containing `dependencies` and `devDependencies` will have their NPM package versions updated if they are behind. Copy/paste the result back into your own package.json file and run `npm install` or `yarn install` to update the packages in your local project.

## Issues

Any packages that start with an `@` symbol are skipped at the moment.