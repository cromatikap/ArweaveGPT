import axios, { AxiosError } from 'axios';
import { getTxs } from './arweave';
require('dotenv').config();

if(!process.env.OPENAI_INIT_PROMPT || !process.env.OPENAI_INIT_RESPONSE) {
  console.error("Error: process.env.OPENAI_INIT_PROMPT or process.env.OPENAI_INIT_RESPONSE is undefined.");
  process.exit();
}

interface ConversationHistory {
  role: string;
  content: string;
}

let conversationHistory: ConversationHistory[] = [{
  role: 'user',
  content: process.env.OPENAI_INIT_PROMPT
}, {
  role: 'assistant',
  content: process.env.OPENAI_INIT_RESPONSE
}];

async function query(content: string) {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  conversationHistory.push({ role: 'user', content });

  const response = await axios.post(
    API_URL,
    {
      model: 'gpt-3.5-turbo',
      messages: conversationHistory,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  const choices = response.data.choices;
  if (choices.length === 0) {
    throw new Error('ChatGPT API returned an empty choices array.');
  }
  conversationHistory.push({ role: 'assistant', content: choices[0].message.content });
  return choices[0].message.content;
}

export async function getChatResponse(walletAddr: string) {
  if(walletAddr.length === 0) {
    return "Please provide a wallet address. Example:\n /activity R0i6IiIzg5GVSnoUrzD0-deypA2vJlX2SCmD5zrDfPs";
  }
  try {
    const content = await getTxs(walletAddr);
    return await query(content);
  } catch (error: any) {
    console.log(error.message);
    if (error instanceof AxiosError) console.error(error.response?.data.error.message);
    return '❌ ' + error.message;
  }
}
