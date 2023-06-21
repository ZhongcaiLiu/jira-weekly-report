#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');
const fs = require('fs');
const { getConfig } = require('../src/utils');
const chalk = require('chalk');

program.version(version);
program.version(version, '-v, --vers', 'output the current version');

program
  .action(() => {
    const { email, token } = getConfig();
    if (!email || !token) {
      console.log(chalk.yellow('Please config the email and token first!'));
      return;
    }
    require('../src/index')();
  })

program.command('config')
  .option('-e, --email <email>', 'user email of jira')
  .option('-t, --token <token>', 'personal access token of jira')
  .option('-n, --name <name>', 'user name of jira')
  .option('-h, --host <host>', 'host of jira')
  .action(cmd => {
    const config = getConfig();
    if (!Object.keys(cmd).length) {
      console.log(config);
      return;
    }
    fs.writeFile(`${process.cwd()}/src/config.json`, JSON.stringify({ ...config, ...cmd }), err => {
      if (err) throw err;
      console.log(chalk.green('set config success!'))
    })
  })

// 处理参数须放在最后面
program.parse(process.argv);
