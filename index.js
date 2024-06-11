"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
// Create a new bot instance
const bot = new grammy_1.Bot('7004030153:AAEGPJAiA9PUASKXn7rQ2qtVY1uSytK9o-U');
// Use session middleware
bot.use((0, grammy_1.session)({
    initial: () => ({
        state: 'idle',
        amount: 0,
        isFirstInteraction: true,
    }),
}));
// Handle the /start command
bot.command('start', (ctx) => {
    const keyboard = new grammy_1.InlineKeyboard()
        .text('Deposit', 'deposit')
        .text('Withdraw', 'withdraw')
        .row()
        .text('Summary of Trade', 'summary');
    let message = 'Hello there! welcome to Enigma.\nPlease select an option:';
    if (ctx.session.isFirstInteraction) {
        // Send the picture only on the first interaction
        ctx.replyWithPhoto('https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?cs=srgb&dl=pexels-anniroenkae-2156881.jpg&fm=jpg', {
            caption: message,
            reply_markup: keyboard,
        });
        ctx.session.isFirstInteraction = false;
    }
    else {
        ctx.reply(message, {
            reply_markup: keyboard,
        });
    }
});
// Handle the deposit button
bot.callbackQuery('deposit', (ctx) => {
    ctx.session.state = 'deposit';
    ctx.reply('Please enter the deposit amount:');
});
// Handle the withdraw button
bot.callbackQuery('withdraw', (ctx) => {
    ctx.session.state = 'withdraw';
    ctx.reply('Please enter the withdrawal amount:');
});
// Handle the summary button
bot.callbackQuery('summary', (ctx) => {
    ctx.reply(`Trade summary:\nAmount: ${ctx.session.amount}`);
});
// Handle the user's input based on the current state
bot.on('message', (ctx) => {
    var _a;
    const sanitizedText = (_a = ctx.msg.text) === null || _a === void 0 ? void 0 : _a.replace(/,/g, '');
    const amount = parseInt(sanitizedText || '0', 10);
    if (ctx.session.state === 'deposit') {
        if (amount > 0) {
            ctx.session.amount += amount;
            ctx.reply(`Deposit of ${amount} successful. Total balance: ${ctx.session.amount}`);
        }
        else {
            ctx.reply('Invalid deposit amount. Please enter a valid number.');
        }
        ctx.session.state = 'idle';
    }
    else if (ctx.session.state === 'withdraw') {
        if (amount > 0 && amount <= ctx.session.amount) {
            ctx.session.amount -= amount;
            ctx.reply(`Withdrawal of ${amount} successful. Remaining balance: ${ctx.session.amount}`);
        }
        else {
            ctx.reply(`Invalid withdrawal amount. Please enter a valid number within your balance.\nYour balance is ${ctx.session.amount}`);
        }
        ctx.session.state = 'idle';
    }
});
// Start the bot
bot.start();
