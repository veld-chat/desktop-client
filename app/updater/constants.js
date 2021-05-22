const server = 'https://update.electronjs.org';

module.exports = {
  feedUrl: `${server}/OWNER/REPO/${process.platform}-${process.arch}/${app.getVersion()}`
};