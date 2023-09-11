import { Telegraf } from 'telegraf';
import { commandRegistry } from './bot/commandRegistry';
import { commandHandler } from './bot/commandHandler';
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

Object.keys(commandRegistry).map((cmd) => {
  bot.command(cmd, commandHandler);
});

bot.launch();