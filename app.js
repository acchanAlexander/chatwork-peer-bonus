'use strict'

// process.on('unhandledRejection', console.dir);

const lib = require('./lib.js');
const bonus = require('./commands/bonus.js');
const status = require('./commands/status.js');
const ranking = require('./commands/ranking.js');

const main = async () => {
  try {
    const messages = await lib.getMessages();

    if (messages === '') {
      return;
    }

    const bonusMessages = lib.getBonusMessages(messages);

    if (bonusMessages.length !== 0) {
      bonus.main(bonusMessages);
    }

    const statusMessages = lib.getStatusMessages(messages);

    if (statusMessages.length !== 0) {
      status.main(statusMessages);
    }

    const rankingMessages = lib.getRankingMessages(messages);

    if (rankingMessages.length !== 0) {
      ranking.main();
    }
  } catch (err) {
    /*
    let obj = {};
    Error.captureStackTrace(obj);
    console.log(obj.stack);
    */

    console.log(err);
    await lib.postMessage('error occured');
  }
}

const CronJob = require('cron').CronJob;
const job = new CronJob('*/3 * * * * *', () => {
  main();
}, null, true);

job.start();
