// Karma configuration
// Generated on Fri Jul 22 2016 08:55:04 GMT+0200 (CEST)

const webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'app/**/*.spec.js'
    ],
    preprocessors: {
      'app/**/*.js': ['webpack']
    },

    webpack: webpackConfig,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  });
};
