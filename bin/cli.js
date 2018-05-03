#!/usr/bin/env node

const path = require('path')
const commander = require('commander')

const hexoPost = require('../lib')

commander
    .version('1.0.0', '-V, --version')
    .option('-c --config [config]', 'path to config file', String)
    .option('-o --output [output]', 'path to hexo directory', String)
    .option('-v --verbose [verbose]', 'path to hexo directory', Boolean)
    .parse(process.argv)

// console.log(commander)

if (commander.config && commander.output) {
    hexoPost.g(path.resolve(commander.config), path.resolve(process.cwd(), commander.output), {verbose: commander.verbose})
}
else if (commander.output) {
    hexoPost.g(path.resolve(process.cwd()), path.resolve(process.cwd(), commander.output), {verbose: commander.verbose})
}
else {
    commander.help()
    process.exit()
}
