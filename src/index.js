const { Version2Client } = require('jira.js');
const fs = require('fs');
const dayjs = require('dayjs');
const os = require('os');
const { getConfig } = require('./utils');
const chalk = require('chalk');

module.exports = function () {

  const { email, token, host = 'https://jira.shopee.io', name } = getConfig();
  const desktopDir = `${os.homedir()}/Desktop`;
   
  const client = new Version2Client({
    host,
    authentication: {
      personalAccessToken: token,
    },
  });
  
  const lastWeekStartDate = () => dayjs().add(-7, 'days').day(1).format('YYYY-MM-DD');
  const lastWeekEndDate = () => dayjs().add(-7, 'days').day(5).format('YYYY-MM-DD');
  const thisWeekStartDate = () => dayjs().day(1).format('YYYY-MM-DD');
  const thisWeekEndDate = () => dayjs().day(5).format('YYYY-MM-DD');
  
  async function getTaskContent (startDate, endDate) {
    const issue = await client.issueSearch.searchForIssuesUsingJql({ jql: `issuetype = Sub-task AND "Dev Start Date" >= ${startDate} AND "Dev Start Date" <= ${endDate} AND assignee in ("${email}") ORDER BY cf[11516] ASC, assignee, due ASC` });
    const data = issue.issues?.reduce((total, cur) => {
      const key = cur.fields.parent?.key;
      const summary = cur.fields.parent?.fields.summary;
      const item = total.find(t => t.key === key);
      const subTask = {
        key: cur.key,
        summary: cur.fields.summary
      }
      if (item) {
        item.subTask.push(subTask)
      } else {
        total.push({
          key,
          summary,
          subTask: [subTask]
        })
      }
      return total;
    }, [])
  
    const content = data?.map(d => (`
      <li>
        <a href="${host}/browse/${d.key}" target="_blank">[${d.key}]</a>
        ${d.summary}
        <ul>${d.subTask.map(s => (
          `<li>
            <a href="${host}/browse/${s.key}" target="_blank">[${s.key}]</a>
            ${s.summary}
          </li>`
        )).join('')}</ul>
      </li>
    `)).join('');
  
    return `<ul>${content}</ul>`;
  }
  
  const main = async () => {
    const [lastWeek, thisWeek] = await Promise.all([getTaskContent(lastWeekStartDate(), lastWeekEndDate()),
      getTaskContent(thisWeekStartDate(), thisWeekEndDate())]);
  
    const userName = name || email.split('@')[0].split('.').map(u => u.replace(u[0], u[0].toUpperCase())).join(' ');
    const dateRange = `${dayjs(lastWeekStartDate()).format('YYYYMMDD')}-${dayjs(lastWeekEndDate()).format('YYYYMMDD')}`;
    const title = `${userName} Weekly Report ${dateRange}`;
    const html = `<h2>${title}</h2>
      <b>My thoughts</b>
      <div>-</div>
      <b>Work this week</b>
      ${lastWeek}
      <b>Plan for next week</b>
      ${thisWeek}
    `;
  
    fs.writeFile(`${desktopDir}/report.html`, html, err => {
      if (err) throw err;
      console.log(chalk.green('The report file generate successfully!'));
    });
  }
  
  main();
  
  // This code sample uses the 'node-fetch' library:
  // https://www.npmjs.com/package/node-fetch
  // const fetch = require('node-fetch');
  
  // fetch(`${host}/rest/api/2/issue/SPML-24060`, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${pat}`,
  //     'Accept': 'application/json'
  //   }
  // })
  //   .then(response => {
  //     console.log(
  //       `Response: ${response.status} ${response.statusText}`
  //     );
  //     return response.text();
  //   })
  //   .then(text => console.log(text))
  //   .catch(err => console.error(err));
}