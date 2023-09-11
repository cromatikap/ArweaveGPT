import Arweave from 'arweave';
import { arGql } from 'ar-gql';
import { format } from './format';

const arweave = Arweave.init({
  host: 'arweave.net', // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: 'https', // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  logging: false,
});
const argql = arGql()

const queryString = (walletAddr: string) => `
{
  transactions(
    first: 3
    owners: ["${walletAddr}"]
  ) {
    edges {
      node {
        id
        owner { address }
        block { 
          timestamp
          height
        }
        tags { name value }
      }
    }
  }
}
`;

export async function getTxs(walletAddr: string) {
  console.log('walletAddr', walletAddr)
  try {
    console.log('txs queries...')
    const txs = (await argql.run(queryString(walletAddr))).data.transactions.edges;
    if (txs.length === 0)
      throw new Error('This wallet has no transactions.');

    console.log('Formatting data...')
    const response = txs.map((tx: any) => `Transaction ${tx.node.id}

Tags:
${tx.node.tags.map((tag: any) => `${tag.name}: ${tag.value}`).join('\n')}

`).join('');

    return response;
  }
  catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
}