# jira-weekly-report

jira-weekly-report is a program to generate the weekly report from jira.

## Install

```bash
$ npm i jira-weekly-report -g
```

you can run **`jwr -v`** to see if install successfully!

## Quick Start

1. config your jira email and [personnal access token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) first

```bash
$ jwr config -e <your email> -t <your token>
```

2. config your jira host(if you work at shopee, can skip this step)

```bash
$ jwr config -h <your jira host>
```

3. (Optional)you can config name to change the report title name

```bash
$ jwr config -n <your name>
```

After above steps, you can run **`jwr config`** to see your config.

If config correct, just run **`jwr`** to generate the report.

Then you can see a report.html file in your Desktop.

Open it you can see the report!