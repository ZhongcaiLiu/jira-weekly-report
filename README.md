# jira-weekly-report

jira-weekly-report is a program for those who work at shopee to generate the weekly report from jira.

## Install

```bash
$ npm i jira-weekly-report -g
```

you can run **`jwr -v`** to see if install successfully!

## Usage

1. config your jira email and [personal access token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) first

```bash
$ jwr config -e <your email> -t <your token>
```

2. you can config name to change the report title name(optional)

```bash
$ jwr config -n <your name>
```

After above steps, you can run **`jwr config`** to see your config.

If config correct, just run **`jwr`** to generate the report file in your Desktop.

Then the program will auto open the report file in your default browser.

Now you can see the report!