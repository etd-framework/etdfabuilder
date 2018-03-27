#!/usr/bin/env node

var chalk = require('chalk')
var argv  = require('../lib/args')
var pkg   = require('../package.json')

var etdfabuilder = require('../')

function error (msg) {
    process.stderr.write(pkg.name + ': ' + msg + '\n')
    process.exit(1)
}

try {
    etdfabuilder(argv.output)
} catch (e) {
    if (e.name === 'EtdFaBuilderError') {
        error(e.message)
    } else {
        throw e
    }
}