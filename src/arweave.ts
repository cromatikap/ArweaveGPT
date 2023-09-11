import { arGql } from 'ar-gql';

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