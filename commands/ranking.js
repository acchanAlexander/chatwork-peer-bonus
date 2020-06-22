'use strict'

const fs = require('fs');
const lib = require('../lib.js');

const ranking = {
  main: async () => {
    if (!fs.existsSync('./report.json')) {
      await lib.postMessage('no data');
    }

    const report = JSON.parse(fs.readFileSync('./report.json'));
    const sortedGetterReport = lib.getSortedGetterReport(report);
    const sortedGetterReportMessage = lib.getSortedGetterReportMessage(sortedGetterReport);
    const sortedSenderReport = lib.getSortedSenderReport(report);
    const sortedSenderReportMessage = lib.getSortedSenderReportMessage(sortedSenderReport);

    let rankingMessage = '[ GET RANKING ]\n';
    rankingMessage += sortedGetterReportMessage;
    rankingMessage += '\n[ SEND RANKING ]\n';
    rankingMessage += sortedSenderReportMessage;

    lib.postMessage(rankingMessage);
  }
}

module.exports = ranking;
