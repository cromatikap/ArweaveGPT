import { getChatResponse } from '../openai';
import { getTxs } from '../arweave';
import { format } from '../format';

export const commandRegistry: Record<string, (prompt: string, first_name: string) => Promise<string>> = {
  'activity': getChatResponse,
  'debug': async (walletAddr: string) => {
    try {
      return format(await getTxs(walletAddr))
    } catch (error: any) {
      console.log(error.message);
      return '❌ ' + format(error.message);
    }
  },
  'about': async () => `
Author: cromatikap
`,
};