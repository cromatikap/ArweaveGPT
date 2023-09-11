import { commandRegistry } from './commandRegistry';

export const commandHandler = async (ctx: any) => {
  const matches = ctx.message.text.match(/^\/([a-z]+)(@[\w_]+)?\s*([\s\S]*)/i);
  if (!matches) {
    console.error(`${ctx.message.text}`);
    console.error("/!\ command mismatch, ignore it");
    return;
  }
  const [cmd, prompt, first_name, username] = [matches[1], matches[3], ctx.message.from.first_name, ctx.message.from.username];

  const replyFunc = commandRegistry[cmd];
  if (replyFunc) {
    const reply = `@${username}\n${await replyFunc(prompt, first_name)}`;
    console.log(` -> [${cmd}] ${prompt}`);
    console.log(` <- ${reply}`);
    if (cmd === 'sam') {
      ctx.reply(reply);
    } else {
      ctx.replyWithMarkdownV2(reply);
    }
  } else {
    console.error(`Unknown command: ${cmd}`);
  }
};