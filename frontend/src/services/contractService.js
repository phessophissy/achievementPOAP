import {
  makeContractCall,
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  bufferCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MINT_FEE, NETWORK_TYPE } from '../config/constants';

// Network setup
const getNetwork = () => {
  return NETWORK_TYPE === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
};

// Convert hex to string
const hexToString = (hex) => {
  if (!hex || !hex.startsWith('0x')) return '';
  let str = '';
  for (let i = 2; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

// Parse CV response
const parseCV = (cv) => {
  if (!cv) return null;
  const json = cvToJSON(cv);
  return json.value;
};

/**
 * Fetch all events from the contract
 * @returns {Promise<Array>} Array of events
 */
export const fetchEvents = async () => {
  const network = getNetwork();
  
  try {
    // Get event count
    const countResult = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-event-count',
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const eventCount = parseInt(parseCV(countResult));
    const events = [];
    
    // Fetch each event
    for (let i = 1; i <= eventCount; i++) {
      const event = await fetchEvent(i);
      if (event) {
        events.push(event);
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 * @param {number} eventId - The event ID
 * @returns {Promise<Object|null>} Event details or null
 */
export const fetchEvent = async (eventId) => {
  const network = getNetwork();
  
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-event',
      functionArgs: [uintCV(eventId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const json = cvToJSON(result);
    
    if (json.value) {
      const eventData = json.value.value;
      return {
        id: eventId,
        name: hexToString(eventData.name?.value) || eventData.name?.value || '',
        description: hexToString(eventData.description?.value) || eventData.description?.value || '',
        imageUri: hexToString(eventData['image-uri']?.value) || eventData['image-uri']?.value || '',
        organizer: eventData.organizer?.value || '',
        maxMints: parseInt(eventData['max-mints']?.value) || 0,
        currentMints: parseInt(eventData['current-mints']?.value) || 0,
        startTime: parseInt(eventData['start-time']?.value) || 0,
        endTime: parseInt(eventData['end-time']?.value) || 0,
        active: eventData.active?.value || false,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Fetch event mint statistics
 * @param {number} eventId - The event ID
 * @returns {Promise<Object>} Mint statistics
 */
export const fetchEventStats = async (eventId) => {
  const network = getNetwork();
  
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-mint-count',
      functionArgs: [uintCV(eventId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    return {
      mintCount: parseInt(parseCV(result)) || 0,
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return { mintCount: 0 };
  }
};

/**
 * Check if a user has already minted a POAP for an event
 * @param {number} eventId - The event ID
 * @param {string} userAddress - The user's wallet address
 * @returns {Promise<boolean>} Whether the user has minted
 */
export const checkHasMinted = async (eventId, userAddress) => {
  const network = getNetwork();
  
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'has-minted',
      functionArgs: [uintCV(eventId), standardPrincipalCV(userAddress)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    return parseCV(result) === true;
  } catch (error) {
    console.error('Error checking minted status:', error);
    return false;
  }
};

/**
 * Mint a POAP for an event
 * @param {number} eventId - The event ID
 * @param {string} userAddress - The user's wallet address
 * @param {Function} openContractCall - The stacks connect openContractCall function
 * @returns {Promise<Object>} Transaction result
 */
export const mintPOAP = async (eventId, userAddress, openContractCall) => {
  const network = getNetwork();
  
  // Create post condition for the minting fee
  const postConditions = [
    makeStandardSTXPostCondition(
      userAddress,
      FungibleConditionCode.Equal,
      MINT_FEE
    ),
  ];
  
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'mint-poap',
      functionArgs: [uintCV(eventId)],
      postConditions,
      onFinish: (data) => {
        console.log('Mint transaction submitted:', data);
        resolve(data);
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled by user'));
      },
    });
  });
};

/**
 * Create a new event
 * @param {Object} eventData - The event data
 * @param {Function} openContractCall - The stacks connect openContractCall function
 * @returns {Promise<Object>} Transaction result
 */
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
        uintCV(Math.floor(startTime / 1000)), // Convert to seconds
        uintCV(Math.floor(endTime / 1000)),   // Convert to seconds
      ],
      onFinish: (data) => {
        console.log('Create event transaction submitted:', data);
        resolve(data);
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled by user'));
      },
    });
  });
};

/**
 * Fetch POAPs owned by a user
 * @param {string} userAddress - The user's wallet address
 * @returns {Promise<Array>} Array of POAPs
 */
export const fetchUserPOAPs = async (userAddress) => {
  const network = getNetwork();
  
  try {
    // Get all events first
    const events = await fetchEvents();
    const userPOAPs = [];
    
    // Check which events the user has minted
    for (const event of events) {
      const hasMinted = await checkHasMinted(event.id, userAddress);
      if (hasMinted) {
        userPOAPs.push({
          ...event,
          mintedBy: userAddress,
        });
      }
    }
    
    return userPOAPs;
  } catch (error) {
    console.error('Error fetching user POAPs:', error);
    throw error;
  }
};

/**
 * Fetch POAP by token ID
 * @param {number} tokenId - The token ID
 * @returns {Promise<Object|null>} POAP details or null
 */
export const fetchPOAP = async (tokenId) => {
  const network = getNetwork();
  
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-poap',
      functionArgs: [uintCV(tokenId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const json = cvToJSON(result);
    
    if (json.value) {
      const poapData = json.value.value;
      const eventId = parseInt(poapData['event-id']?.value) || 0;
      
      // Fetch associated event
      const event = await fetchEvent(eventId);
      
      return {
        tokenId,
        eventId,
        owner: poapData.owner?.value || '',
        mintedAt: parseInt(poapData['minted-at']?.value) || 0,
        event,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching POAP:', error);
    throw error;
  }
};

/**
 * Get the total supply of POAPs
 * @returns {Promise<number>} Total POAP count
 */
export const getTotalSupply = async () => {
  const network = getNetwork();
  
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-last-token-id',
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    return parseInt(parseCV(result)) || 0;
  } catch (error) {
    console.error('Error fetching total supply:', error);
    return 0;
  }
};

/**
 * Transfer a POAP to another address
 * @param {number} tokenId - The token ID
 * @param {string} recipient - The recipient address
 * @param {Function} openContractCall - The stacks connect openContractCall function
 * @returns {Promise<Object>} Transaction result
 */
export const transferPOAP = async (tokenId, recipient, openContractCall) => {
  const network = getNetwork();
  
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'transfer',
      functionArgs: [
        uintCV(tokenId),
        standardPrincipalCV(recipient),
      ],
      onFinish: (data) => {
        console.log('Transfer transaction submitted:', data);
        resolve(data);
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled by user'));
      },
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
