import { getChatResponse } from '../openai';
import { getTxs } from '../arweave';

export const commandRegistry: Record<string, (prompt: string, first_name: string) => Promise<string>> = {
  'start': async () => `
Type
/activity <Arweave wallet address>
`,
  'activity': getChatResponse,
  'debug': async (walletAddr: string) => {
    try {
      return await getTxs(walletAddr)
    } catch (error: any) {
      console.log(error.message);
      return '❌ ' + error.message;
    }
  },
  'about': async () => `
Author: cromatikap
`,
};