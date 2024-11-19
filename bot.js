const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot token
const token = process.env.TELEGRAM_BOT_TOKEN; // Environment variable for token
const bot = new TelegramBot(token, { polling: true });

// API URL for activating the package
const API_URL = 'https://pakcyberexpert.serv00.net/Zararking/tg.php?num=';

// Channel usernames (replace with actual channels)
const CHANNEL_1 = '@Code_With_Musa';
const CHANNEL_2 = '@Musa_x2';

// Start command: Ask user to join channels
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Welcome! To activate your package, please join the following channels:');
  bot.sendMessage(chatId, `1. Join ${CHANNEL_1}`);
  bot.sendMessage(chatId, `2. Join ${CHANNEL_2}`);
  bot.sendMessage(chatId, 'After joining both channels, send your Jazz number to activate the package.');
});

// Handle user messages to check for Jazz number
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Check if the message is a valid Jazz number (11 digits)
  if (/^\d{11}$/.test(userMessage)) {
    const userNumber = userMessage;

    // API call to activate the package
    axios.get(`${API_URL}${userNumber}`)
      .then(response => {
        if (response.data.includes('activated')) {
          bot.sendMessage(chatId, `Package activated successfully for number: ${userNumber}.`);
        } else if (response.data.includes('already activated')) {
          bot.sendMessage(chatId, `Package is already activated for number: ${userNumber}.`);
        } else {
          bot.sendMessage(chatId, 'Failed to activate the package. Please try again later.');
        }
      })
      .catch(error => {
        bot.sendMessage(chatId, 'There was an error activating the package. Please try again later.');
        console.log(error);
      });
  } else {
    bot.sendMessage(chatId, 'Please enter a valid Jazz number (11 digits).');
  }
});

// Validate user channel joins before proceeding
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.new_chat_member.id;

  bot.getChatMember(chatId, userId).then((member) => {
    if (member.status === 'member' || member.status === 'administrator') {
      bot.sendMessage(chatId, 'You have joined the channels, now send your Jazz number to activate the package.');
    } else {
      bot.sendMessage(chatId, 'You must join both channels before proceeding.');
    }
  });
});