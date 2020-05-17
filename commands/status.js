'use strict'

const fs = require('fs');
const lib = require('../lib.js');

const status = {
  main: async (statusMessages) => {
    if (!fs.existsSync('./report.json')) {
      await lib.postMessage('no data');
    }

    const report = JSON.parse(fs.readFileSync('./report.json'));
    let isExistedInReport = false;

    for (const message of statusMessages) {
      const accountId = lib.getAccountId(message.body);

      for (const individual of report) {

        if (String(individual.acocunt_id) === accountId) {
          const statusMessage = lib.getStatusResultMessage(individual);
          await lib.postMessage(statusMessage);
          isExistedInReport = true;
          break;
        }
      }
    }

    if (!isExistedInReport) {
      await lib.postMessage('no data');
    }
  }
}

module.exports = status;
