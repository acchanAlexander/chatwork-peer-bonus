'use strict'

const fs = require('fs');
const lib = require('../lib.js');

const bonus = {
  main: async (bonusMessages) => {
    if (!fs.existsSync('./report.json')) {
      fs.writeFileSync('./report.json', JSON.stringify([]));
    }

    for (const message of bonusMessages) {
      const accountId = lib.getAccountId(message.body);
      const thanksMessage = lib.getThanksMessage(message.body); 
      const name = lib.getName(message.body);

      lib.registBonus(accountId, thanksMessage, name);
      await lib.postMessage(name + ' get 1 point!!');
    }
  }
}

module.exports = bonus;
