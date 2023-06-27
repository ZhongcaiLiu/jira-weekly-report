const os = require('os');

const pkg = require('../package.json');
const getHomePath = () => os.homedir();
const getConfigPath = () => `${getHomePath()}/.config/jwrconfig.json`;
const getDesktopPath = () => `${getHomePath()}/Desktop`;
const getReportFilePath = () => `${getDesktopPath()}/report.html`;

const getConfig = () => {
  let config = {};
  try {
    config = require(getConfigPath());
  } catch (e) {}
  return config;
}

const computedData = (issue) => 
  issue.issues?.reduce((total, cur) => {
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

module.exports = {
  pkg,
  getConfig,
  getConfigPath,
  getReportFilePath,
  computedData,
}