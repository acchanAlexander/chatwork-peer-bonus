'use strict'

const fs = require('fs');
const lib = require('../lib.js');

const bonus = {
  main: async (bonusMessages) => {
    if (!fs.existsSync('./report.json')) {
      fs.writeFileSync('./report.json', JSON.stringify([]));
    }

    for (const message of bonusMessages) {
      const getterAccountId = lib.getAccountId(message.body);
      const thanksMessage = lib.getThanksMessage(message.body); 
      const getterName = lib.getName(message.body);
      lib.registBonus(getterAccountId, thanksMessage, getterName);

      await lib.postMessage(getterName + ' get 1 point!!');

      const senderAccountId = message.account.account_id;
      const senderName = message.account.name;
      await lib.incrementSendCount(senderAccountId, senderName);
    }
  }
}

module.exports = bonus;
