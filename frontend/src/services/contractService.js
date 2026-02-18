import {
  cvToJSON,
  cvToHex,
  hexToCV,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
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

const toNumber = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value) => value === true || value === 'true';

/**
 * Call a read-only contract function
 * @param {string} functionName - The function name to call
 * @param {Array} args - Array of Clarity values as hex strings
 * @returns {Promise<any>} The parsed result
 */
const callReadOnly = async (functionName, args = []) => {
  const url = `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: CONTRACT_ADDRESS,
      arguments: args.map(arg => cvToHex(arg)),
    }),
  });

  if (!response.ok) {
    throw new Error(`Contract call failed (${response.status})`);
  }

  const data = await response.json();
  if (data.okay && data.result) {
    return cvToJSON(hexToCV(data.result));
  }
  throw new Error(data.cause || 'Contract call failed');
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
    const result = await callReadOnly('get-event', [uintCV(eventId)]);
    if (result && result.value) {
      const e = result.value;
      const maxSupply = toNumber(e['max-supply']?.value);
      const currentSupply = toNumber(e['current-supply']?.value);
      const startBlock = toNumber(e['start-block']?.value);
      const endBlock = toNumber(e['end-block']?.value);

      return {
        id: eventId,
        name: hexToString(e.name?.value) || e.name?.value || '',
        description: hexToString(e.description?.value) || e.description?.value || '',
        creator: e.creator?.value || '',
        maxSupply,
        currentSupply,
        startBlock,
        endBlock,
        maxMints: maxSupply,
        currentMints: currentSupply,
        startTime: startBlock,
        endTime: endBlock,
        metadataUri: hexToString(e['metadata-uri']?.value) || e['metadata-uri']?.value || '',
        imageUri: '',
        active: toBoolean(e.active?.value),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const fetchEventStats = async (eventId) => {
  try {
    const result = await callReadOnly('get-event-supply', [uintCV(eventId)]);
    if (result && result.value) {
      return {
        currentSupply: toNumber(result.value.current?.value),
        maxSupply: toNumber(result.value.max?.value),
      };
    }
    return { currentSupply: 0, maxSupply: 0 };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return { currentSupply: 0, maxSupply: 0 };
  }
};

export const checkHasMinted = async (eventId, userAddress) => {
  try {
    const result = await callReadOnly('has-minted-event', [
      uintCV(eventId),
      standardPrincipalCV(userAddress),
    ]);
    return result?.value === true || result?.value === 'true';
  } catch (error) {
    console.error('Error checking minted status:', error);
    return false;
  }
};

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
  const { name, description, maxSupply, startBlock, endBlock, metadataUri } = eventData;
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-event',
      functionArgs: [
        stringAsciiCV(name.substring(0, 64)),
        stringAsciiCV(description.substring(0, 256)),
        uintCV(maxSupply),
        uintCV(startBlock),
        uintCV(endBlock),
        stringAsciiCV(metadataUri.substring(0, 256)),
      ],
      onFinish: resolve,
      onCancel: () => reject(new Error('Cancelled')),
    });
  });
};

/**
 * Fetch all POAPs owned by a user
 * @param {string} userAddress - The user's Stacks address
 * @returns {Promise<Array>} Array of POAP objects with token and event data
 */
export const fetchUserPOAPs = async (userAddress) => {
  try {
    // Get the list of token IDs owned by the user
    const result = await callReadOnly('get-user-tokens', [
      standardPrincipalCV(userAddress),
    ]);
    
    if (!result || !result.value || !Array.isArray(result.value)) {
      return [];
    }
    
    const tokenIds = result.value
      .map((item) => toNumber(item.value, -1))
      .filter((id) => id > 0);
    
    // Fetch metadata for each token
    const poaps = await Promise.all(
      tokenIds.map(async (tokenId) => {
        try {
          const poap = await fetchPOAP(tokenId);
          return poap;
        } catch (e) {
          console.error('Error fetching POAP:', e);
          return null;
        }
      })
    );
    
    // Filter out any failed fetches
    return poaps.filter(p => p !== null);
  } catch (error) {
    console.error('Error fetching user POAPs:', error);
    return [];
  }
};

/**
 * Fetch a single POAP by token ID
 * @param {number} tokenId - The token ID
 * @returns {Promise<Object|null>} POAP object with token and event data
 */
export const fetchPOAP = async (tokenId) => {
  try {
    // Get token metadata
    const metadataResult = await callReadOnly('get-token-metadata', [uintCV(tokenId)]);
    
    if (!metadataResult || !metadataResult.value) {
      return null;
    }
    
    const metadata = metadataResult.value;
    const eventId = parseInt(metadata['event-id']?.value) || 0;
    const mintedAt = parseInt(metadata['minted-at']?.value) || 0;
    const minter = metadata.minter?.value || '';
    
    // Get the event details for this token
    const event = await fetchEvent(eventId);
    
    // Get the current owner
    const ownerResult = await callReadOnly('get-owner', [uintCV(tokenId)]);
    const owner = ownerResult?.value?.value || null;
    
    return {
      tokenId,
      eventId,
      mintedAt,
      minter,
      owner,
      eventName: event?.name || Event #,
      eventDescription: event?.description || '',
      metadataUri: event?.metadataUri || '',
      event,
    };
  } catch (error) {
    console.error('Error fetching POAP:', error);
    return null;
  }
};

/**
 * Get the total number of POAPs minted
 * @returns {Promise<number>} Total supply
 */
export const getTotalSupply = async () => {
  try {
    const result = await callReadOnly('get-last-token-id', []);
    if (result && result.value !== undefined) {
      return parseInt(result.value) || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching total supply:', error);
    return 0;
  }
};

/**
 * Transfer a POAP to another address
 * @param {number} tokenId - The token ID to transfer
 * @param {string} recipient - The recipient's Stacks address
 * @param {Function} openContractCall - The wallet's contract call function
 * @returns {Promise} Transaction result
 */
export const transferPOAP = async (tokenId, sender, recipient, openContractCall) => {
  const network = getNetwork();
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'transfer',
      functionArgs: [
        uintCV(tokenId),
        standardPrincipalCV(sender),
        standardPrincipalCV(recipient),
      ],
      onFinish: resolve,
      onCancel: () => reject(new Error('Cancelled')),
    });
  });
};

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
