const getConfig = () => {
  let config = {};
  try {
    config = require(`${process.cwd()}/src/config.json`);
  } catch (e) {}
  return config;
}

module.exports = {
  getConfig,
}