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

module.exports = {
  pkg,
  getConfig,
  getConfigPath,
  getReportFilePath,
}