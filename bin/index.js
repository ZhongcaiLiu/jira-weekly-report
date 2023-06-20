#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');

program.version(version);

program
  .requiredOption('-u, --user <user>', 'user email of jira')
  .requiredOption('-t, --token <token>', 'personal access token of jira')
  .action(cmd => {
    require('../src/index')(cmd);
  })

// 处理参数须放在最后面
program.parse(process.argv);
