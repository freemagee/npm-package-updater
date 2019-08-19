# NPM Package Updater

A quick way to automatically update dependencies in a package.json file, thanks in large part to [https://npms.io/](https://npms.io/) for a great public api.

[Use NPM Package Updater](https://freemagee.github.io/npm-package-updater/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#issues)
- [TODO](#todo)

## Installation

This is quite a simple project. There is currently no build step.

Bear in mind that this is a blunt tool and will update all dependencies/devDependencies.

## Usage

Paste the complete contents of your package.json where instructed. The JSON will be parsed and the sections containing `dependencies` and `devDependencies` will have their NPM package versions updated if they are behind. Copy/paste the result back into your own package.json file and run `npm install` or `yarn install` to update the packages in your local project.

## TODO

- [ ] Copy to clipboard output
- [ ] Toggle carats to tilde characters (and vice versa) via checkbox?
