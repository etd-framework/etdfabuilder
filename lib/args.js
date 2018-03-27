'use strict'
const chalk = require('chalk')

const logo = `         
                          ________________ 
                         / ____/_  __/ __ \\
                        / __/   / / / / / /
                       / /___  / / / /_/ / 
                      /_____/ /_/ /_____/  

`

const cli = require('../package.json').version
const version = chalk.bold.red(`         
                          ________________ 
                         / ____/_  __/ __ \\
                        / __/   / / / / / /
                       / /___  / / / /_/ / 
                      /_____/ /_/ /_____/  
                      
                             v${cli}

`)

module.exports = require('yargs')
  .usage(
    `${chalk.bold.red(logo)}
Usage:
  $0 -o|--output output.js`
  )
  .option('o', {
    alias: 'output',
    desc: 'Output file',
    type: 'string',
    demandOption: true
  })
  .version(version)
  .alias('h', 'help')
  .example('$0 -o js/output.js')
  .argv
