import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  stringAsciiCV,
  callReadOnlyFunction,
  cvToJSON,
  TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { config } from 'dotenv';

config();

const network = new StacksMainnet();

export async function getWalletFromMnemonic(mnemonic) {
  const { generateWallet, getStxAddress } = await import('@stacks/wallet-sdk');
  
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: '',
  });

  const account = wallet.accounts[0];
  const address = getStxAddress({
    account,
    transactionVersion: TransactionVersion.Mainnet,
  });

  return { account, address, privateKey: account.stxPrivateKey };
}

export async function createEvent(
  mnemonic,
  contractAddress,
  name,
  description,
  maxSupply,
  startBlock,
  endBlock,
  metadataUri
) {
  const { account } = await getWalletFromMnemonic(mnemonic);

  const txOptions = {
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'create-event',
    functionArgs: [
      stringAsciiCV(name),
      stringAsciiCV(description),
      uintCV(maxSupply),
      uintCV(startBlock),
      uintCV(endBlock),
      stringAsciiCV(metadataUri),
    ],
    senderKey: account.stxPrivateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    fee: 50000n,
  };

  const transaction = await makeContractCall(txOptions);
  const response = await broadcastTransaction(transaction, network);

  return response;
}

export async function mintPoap(mnemonic, contractAddress, eventId) {
  const { account, address } = await getWalletFromMnemonic(mnemonic);

  const txOptions = {
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'mint-poap',
    functionArgs: [uintCV(eventId)],
    senderKey: account.stxPrivateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 30000n,
  };

  const transaction = await makeContractCall(txOptions);
  const response = await broadcastTransaction(transaction, network);

  return { response, address };
}

export async function getEvent(contractAddress, eventId) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'get-event',
    functionArgs: [uintCV(eventId)],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}

export async function getMintFee(contractAddress) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'get-mint-fee',
    functionArgs: [],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}

export async function hasMintedEvent(contractAddress, eventId, userAddress) {
  const { principalCV } = await import('@stacks/transactions');
  
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'has-minted-event',
    functionArgs: [uintCV(eventId), principalCV(userAddress)],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}

export async function getEventSupply(contractAddress, eventId) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'get-event-supply',
    functionArgs: [uintCV(eventId)],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}

export async function getUserTokens(contractAddress, userAddress) {
  const { principalCV } = await import('@stacks/transactions');
  
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'achievement-poap',
    functionName: 'get-user-tokens',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}
