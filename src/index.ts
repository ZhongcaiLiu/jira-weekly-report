import { Version2Client } from 'jira.js';
import fs from 'fs';
import dayjs from 'dayjs';

const host = 'https://jira.shopee.io';
const user = 'zhongcai.liu@shopee.com';
const PAT = 'MTY3NDY5OTgxOTQ5Ojcs/fahI6lxq0fI1adyW+pAkTUa';
 
const client = new Version2Client({
  host,
  authentication: {
    personalAccessToken: PAT,
  },
});

const lastWeekStartDate = () => dayjs().add(-7, 'days').day(1).format('YYYY-MM-DD');
const lastWeekEndDate = () => dayjs().add(-7, 'days').day(5).format('YYYY-MM-DD');
const thisWeekStartDate = () => dayjs().day(1).format('YYYY-MM-DD');
const thisWeekEndDate = () => dayjs().day(5).format('YYYY-MM-DD');

async function getTaskContent (startDate: string, endDate: string) {
  const issue = await client.issueSearch.searchForIssuesUsingJql({ jql: `issuetype = Sub-task AND "Dev Start Date" >= ${startDate} AND "Dev Start Date" <= ${endDate} AND assignee in ("${user}") ORDER BY cf[11516] ASC, assignee, due ASC` });
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
  }, [] as any[])

  const content = data?.map(d => (`
    <li>
      <a href="${host}/browse/${d.key}" target="_blank">[${d.key}]</a>
      ${d.summary}
      <ul>${d.subTask.map((s: { key: any; summary: any; }) => (
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
  const lastWeek = await getTaskContent(lastWeekStartDate(), lastWeekEndDate());
  const thisWeek = await getTaskContent(thisWeekStartDate(), thisWeekEndDate());

  const userName = user.split('@')[0].split('.').map(u => u.replace(u[0], u[0].toUpperCase())).join(' ');
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

  fs.writeFile('/Users/zhongcai.liu/Desktop/report.html', html, (err: any) => {
    if (err) throw err;
    console.log('The html file has been saved!');
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