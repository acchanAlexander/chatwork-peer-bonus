'use strict'

const fs = require('fs');
const axios = require('axios');

const chatworkToken = process.env.CHATWORK_TOKEN;
const roomId = process.env.CHATWORK_PEER_BONUS_ROOM_ID;

const lib = {
  getMessages: async () => {
    try {
      const params = {
        method: 'get',
        url: 'https://api.chatwork.com/v2/rooms/' + roomId + '/messages',
        headers: {'X-ChatWorkToken': chatworkToken},
      }

      const responce = await axios(params);

      return responce.data;
    } catch (err) {
      throw err;
    }
  },

  postMessage: async (message) => {
    try {
      const params = {
        method: 'post',
        url: 'https://api.chatwork.com/v2/rooms/' + roomId + '/messages',
        headers: {'X-ChatWorkToken': chatworkToken},
        data: 'body=' + message
      }

      return await axios(params);
    } catch (err) {
      throw (err);
    }
  },

  getBonusMessages: (messages) => {
    return messages.filter(message => 
      message.body.slice(0, 5) === 'bonus'
    );
  },

  // message: e.g. 'bonus[To:1234567]fooさん\nありがとう'
  getAccountId: (message) => {
    // '1234567]fooさん\nありがとう' の形にする
    const prefixAccountId = message.split(':')[1];

    // アカウント ID の部分だけ抜き出す
    return prefixAccountId.split(']')[0];
  },

  // message: e.g. 'bonus[To:1234567]fooさん\nありがとう'
  getThanksMessage: (message) => {
    return message.split('\n')[1];
  },

  // message: e.g. 'bonus[To:1234567]fooさん\nありがとう'
  getName: (message) => {
    const prefixName = message.split(']')[1];

    return prefixName.split('\n')[0];
  },

  registBonus: (accountId, thanksMessage, name) => {
    let report = JSON.parse(fs.readFileSync('./report.json'));
    let isExistedInReport = false;

    report.forEach((individual, index) => {
      if (String(individual.acocunt_id) === accountId) {
        report[index].get_messages.push(thanksMessage);
        isExistedInReport = true;
        return;
      }
    });

    // first insert
    if (!isExistedInReport) {
      report.push({
        acocunt_id: Number(accountId),
        get_messages: [thanksMessage],
        name: name,
      });
    }

    fs.writeFileSync('./report.json', JSON.stringify(report, null , "\t"));
  },

  getStatusMessages: (messages) => {
    return messages.filter(message => 
      message.body.slice(0, 6) === 'status'
    );
  },

  getStatusResultMessage: (individual) => {
    let message = individual.name + ' has ' + individual.get_messages.length + ' points!!';

    console.log(individual.get_messages);

    individual.get_messages.forEach((rowMessage) => {
      message += '\n' + rowMessage;
    });

    return message;
  },

  getRankingMessages: (messages) => {
    return messages.filter(message =>
      message.body === 'ranking'
    );
  },

  getSortedReport: (report) => {
    // 昇順に sort
    const sortedReport = report.sort((a, b) => {
      return a.get_messages.length - b.get_messages.length;
    });

    return sortedReport.reverse();
  },

  getSortedReportMessage: (sortedReport) => {
    let message = '';

    for (const individual of sortedReport) {
      message += individual.name + ' has ' + individual.get_messages.length + 'points!!\n';
    }

    return message;
  },
}

module.exports = lib;
