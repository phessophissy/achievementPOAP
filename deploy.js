import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const network = new StacksMainnet();

async function deployContract() {
  const mnemonic = process.env.DEPLOYER_MNEMONIC;
  
  if (!mnemonic) {
    throw new Error('DEPLOYER_MNEMONIC not set in .env file');
  }

  const { generateWallet, getStxAddress } = await import('@stacks/wallet-sdk');
  
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: '',
  });

  const account = wallet.accounts[0];
  const senderAddress = getStxAddress({
    account,
    transactionVersion: TransactionVersion.Mainnet,
  });

  console.log('Deploying from address:', senderAddress);

  const contractCode = readFileSync('./contracts/achievement-poap.clar', 'utf8');

  const txOptions = {
    contractName: 'achievement-poap',
    codeBody: contractCode,
    senderKey: account.stxPrivateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    fee: 100000n, // 0.1 STX fee for mainnet
  };

  console.log('Creating deployment transaction...');
  const transaction = await makeContractDeploy(txOptions);

  console.log('Broadcasting to Stacks Mainnet...');
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if ('error' in broadcastResponse) {
    console.error('Deployment failed:', broadcastResponse.error);
    throw new Error(broadcastResponse.error);
  }

  console.log('Contract deployed successfully!');
  console.log('Transaction ID:', broadcastResponse.txid);
  console.log('Contract address:', `${senderAddress}.achievement-poap`);
  console.log('\nView on Explorer:');
  console.log(`https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=mainnet`);

  return broadcastResponse;
}

deployContract().catch(console.error);
