// eslint-disable-next-line filenames/match-regex, import/no-commonjs, @typescript-eslint/no-var-requires
process.env.CHROME_BIN = require('playwright').chromium.executablePath()

// eslint-disable-next-line import/no-commonjs
module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [{pattern: '../dist/index.js', type: 'module'}, 'test.js'],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
}
