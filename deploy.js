import {
  makeContractDeploy,
  AnchorMode,
  PostConditionMode,
  TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const network = new StacksMainnet();

async function broadcastTx(transaction) {
  const serializedTx = transaction.serialize();
  
  const response = await fetch('https://api.mainnet.hiro.so/v2/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: serializedTx,
  });
  
  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`Broadcast failed (${response.status}): ${responseText}`);
  }
  
  // Response is just the txid as a string with quotes
  const txid = responseText.replace(/"/g, '');
  return { txid };
}

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
  
  // Check balance first
  const balResponse = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${senderAddress}/balances`);
  const balances = await balResponse.json();
  const stxBalance = parseInt(balances.stx?.balance || 0) / 1000000;
  console.log('Current STX Balance:', stxBalance, 'STX');
  
  if (stxBalance < 0.15) {
    throw new Error(`Insufficient balance. Need at least 0.15 STX for deployment, have ${stxBalance} STX`);
  }

  const contractCode = readFileSync('./contracts/achievement-poap.clar', 'utf8')
    .replace(/^\uFEFF/, '') // Remove BOM
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n');

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
  
  try {
    const broadcastResponse = await broadcastTx(transaction);

    console.log('Contract deployed successfully!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('Contract address:', `${senderAddress}.achievement-poap`);
    console.log('\nView on Explorer:');
    console.log(`https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=mainnet`);

    return broadcastResponse;
  } catch (error) {
    console.error('Broadcast error:', error.message);
    throw error;
  }
}

deployContract().catch(console.error);
