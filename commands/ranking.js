'use strict'

const fs = require('fs');
const lib = require('../lib.js');

const ranking = {
  main: async () => {
    if (!fs.existsSync('./report.json')) {
      await lib.postMessage('no data');
    }

    const report = JSON.parse(fs.readFileSync('./report.json'));
    const sortedReport = lib.getSortedReport(report); 
    const sortedReportMessage = lib.getSortedReportMessage(sortedReport);

    lib.postMessage(sortedReportMessage);
  }
}

module.exports = ranking;
