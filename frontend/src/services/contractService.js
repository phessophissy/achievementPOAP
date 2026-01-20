import {
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  Pc,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MINT_FEE, NETWORK_TYPE, STACKS_API_URL } from '../config/constants';

const getNetwork = () => NETWORK_TYPE === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

const hexToString = (hex) => {
  if (!hex || !hex.startsWith('0x')) return hex || '';
  let str = '';
  for (let i = 2; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

export const fetchEvents = async () => {
  try {
    const events = [];
    for (let i = 1; i <= 100; i++) {
      try {
        const event = await fetchEvent(i);
        if (event) events.push(event);
        else break;
      } catch (e) { break; }
    }
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchEvent = async (eventId) => {
  try {
    const url = STACKS_API_URL + '/v2/contracts/call-read/' + CONTRACT_ADDRESS + '/' + CONTRACT_NAME + '/get-event';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: CONTRACT_ADDRESS, arguments: [uintCV(eventId).toString()] }),
    });
    const data = await response.json();
    if (data.okay && data.result) {
      const json = cvToJSON(data.result);
      if (json.value) {
        const e = json.value.value;
        return {
          id: eventId,
          name: hexToString(e.name?.value) || '',
          description: hexToString(e.description?.value) || '',
          imageUri: hexToString(e['image-uri']?.value) || '',
          organizer: e.organizer?.value || '',
          maxMints: parseInt(e['max-mints']?.value) || 0,
          currentMints: parseInt(e['current-mints']?.value) || 0,
          startTime: parseInt(e['start-time']?.value) || 0,
          endTime: parseInt(e['end-time']?.value) || 0,
          active: e.active?.value || false,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const fetchEventStats = async (eventId) => ({ mintCount: 0 });
export const checkHasMinted = async (eventId, userAddress) => false;

export const mintPOAP = async (eventId, userAddress, openContractCall) => {
  const network = getNetwork();
  const postConditions = [
    Pc.principal(userAddress).willSendEq(MINT_FEE).ustx(),
  ];
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'mint-poap',
      functionArgs: [uintCV(eventId)],
      postConditions,
      onFinish: resolve,
      onCancel: () => reject(new Error('Cancelled')),
    });
  });
};

export const createEvent = async (eventData, openContractCall) => {
  const network = getNetwork();
  const { name, description, imageUri, maxMints, startTime, endTime } = eventData;
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-event',
      functionArgs: [
        stringAsciiCV(name.substring(0, 50)),
        stringUtf8CV(description.substring(0, 500)),
        stringAsciiCV(imageUri.substring(0, 256)),
        uintCV(maxMints),
        uintCV(Math.floor(startTime / 1000)),
        uintCV(Math.floor(endTime / 1000)),
      ],
      onFinish: resolve,
      onCancel: () => reject(new Error('Cancelled')),
    });
  });
};

export const fetchUserPOAPs = async (userAddress) => [];
export const fetchPOAP = async (tokenId) => null;
export const getTotalSupply = async () => 0;
export const transferPOAP = async (tokenId, recipient, openContractCall) => {};

export default {
  fetchEvents,
  fetchEvent,
  fetchEventStats,
  checkHasMinted,
  mintPOAP,
  createEvent,
  fetchUserPOAPs,
  fetchPOAP,
  getTotalSupply,
  transferPOAP,
};
