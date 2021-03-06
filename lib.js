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
    const report = JSON.parse(fs.readFileSync('./report.json'));
    let isExistedInReport = false;
    let newReport = [];

    for (let individual of report) {
      if (String(individual.acocunt_id) === accountId) {
        // update
        individual.get_messages.push(thanksMessage);
        newReport.push(individual);
        isExistedInReport = true;
      } else {
        newReport.push(individual);
      }
    }

    // first insert
    if (!isExistedInReport) {
      newReport.push({
        acocunt_id: Number(accountId),
        get_messages: [thanksMessage],
        send_message_count: 0,
        name: name,
      });
    }

    fs.writeFileSync('./report.json', JSON.stringify(newReport, null , "\t"));
  },

  incrementSendCount: (senderAccountId, senderName) => {
    const report = JSON.parse(fs.readFileSync('./report.json'));
    let isExistedInReport = false;
    let newReport = [];

    for (let individual of report) {
      if (individual.acocunt_id === senderAccountId) {
        // update
        if (individual.hasOwnProperty('send_message_count')) {
          individual.send_message_count = individual.send_message_count + 1;
        } else {
          individual.send_message_count = 1;
        }

        newReport.push(individual);
        isExistedInReport = true;
      } else {
        newReport.push(individual);
      }
    }

    // first insert
    if (!isExistedInReport) {
      newReport.push({
        acocunt_id: senderAccountId,
        get_messages: [],
        send_message_count: 1,
        name: senderName,
      });
    }

    fs.writeFileSync('./report.json', JSON.stringify(newReport, null , "\t"));

  },

  getStatusMessages: (messages) => {
    return messages.filter(message => 
      message.body.slice(0, 6) === 'status'
    );
  },

  getStatusResultMessage: (individual) => {
    let message = individual.name + ' has ' + individual.get_messages.length + ' points!!';

    for (const rowMessage of individual.get_messages) {
      message += '\n' + rowMessage;
    }

    return message;
  },

  getRankingMessages: (messages) => {
    return messages.filter(message =>
      message.body === 'ranking'
    );
  },

  getSortedGetterReport: (report) => {
    // 昇順に sort
    const sortedReport = report.sort((a, b) => {
      return a.get_messages.length - b.get_messages.length;
    });

    return sortedReport.reverse();
  },

  getSortedSenderReport: (report) => {
    // 昇順に sort
    const sortedReport = report.sort((a, b) => {
      return a.send_message_count - b.send_message_count;
    });

    return sortedReport.reverse();
  },

  getSortedGetterReportMessage: (sortedGetterReport) => {
    let message = '';

    for (const individual of sortedGetterReport) {
      if (individual.get_messages.length !== 0) {
        message += individual.name + ' has ' + individual.get_messages.length + ' points!!\n';
      }
    }

    return message;
  },

  getSortedSenderReportMessage: (sortedSenderReport) => {
    let message = '';

    for (const individual of sortedSenderReport) {
      if (individual.send_message_count !== 0) {
        message += individual.name + ' send ' + individual.send_message_count + ' points!!\n';
      }
    }

    return message;
  },
}

module.exports = lib;
