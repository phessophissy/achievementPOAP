/**
 * API service for external data fetching
 * This service can be used to fetch data from external APIs
 * like IPFS, metadata services, or analytics providers
 */

const API_TIMEOUT = 10000; // 10 seconds

/**
 * Fetch with timeout wrapper
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, options = {}, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Fetch IPFS content
 * @param {string} ipfsHash - IPFS hash or URL
 * @returns {Promise<Object>}
 */
export const fetchIPFSContent = async (ipfsHash) => {
  // Convert IPFS hash to gateway URL
  let url = ipfsHash;
  if (ipfsHash.startsWith('ipfs://')) {
    url = ipfsHash.replace('ipfs://', 'https://ipfs.io/ipfs/');
  } else if (!ipfsHash.startsWith('http')) {
    url = `https://ipfs.io/ipfs/${ipfsHash}`;
  }

  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching IPFS content:', error);
    throw error;
  }
};

/**
 * Fetch image as base64
 * @param {string} imageUrl - Image URL
 * @returns {Promise<string>}
 */
export const fetchImageAsBase64 = async (imageUrl) => {
  try {
    const response = await fetchWithTimeout(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

/**
 * Fetch STX price in USD
 * @returns {Promise<number>}
 */
export const fetchSTXPrice = async () => {
  try {
    const response = await fetchWithTimeout(
      'https://api.coingecko.com/api/v3/simple/price?ids=stacks&vs_currencies=usd'
    );
    const data = await response.json();
    return data.stacks?.usd || 0;
  } catch (error) {
    console.error('Error fetching STX price:', error);
    return 0;
  }
};

/**
 * Fetch address balance from Stacks API
 * @param {string} address - Stacks address
 * @returns {Promise<Object>}
 */
export const fetchAddressBalance = async (address) => {
  const baseUrl = 'https://stacks-node-api.mainnet.stacks.co';
  
  try {
    const response = await fetchWithTimeout(
      `${baseUrl}/extended/v1/address/${address}/balances`
    );
    const data = await response.json();
    return {
      stx: parseInt(data.stx?.balance || 0) / 1_000_000,
      locked: parseInt(data.stx?.locked || 0) / 1_000_000,
    };
  } catch (error) {
    console.error('Error fetching address balance:', error);
    return { stx: 0, locked: 0 };
  }
};

/**
 * Fetch transaction status
 * @param {string} txId - Transaction ID
 * @returns {Promise<Object>}
 */
export const fetchTransactionStatus = async (txId) => {
  const baseUrl = 'https://stacks-node-api.mainnet.stacks.co';
  
  try {
    const response = await fetchWithTimeout(
      `${baseUrl}/extended/v1/tx/${txId}`
    );
    const data = await response.json();
    return {
      status: data.tx_status,
      type: data.tx_type,
      blockHeight: data.block_height,
      burnBlockTime: data.burn_block_time,
    };
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return null;
  }
};

/**
 * Fetch NFT metadata
 * @param {string} contractId - Contract ID (address.name)
 * @param {number} tokenId - Token ID
 * @returns {Promise<Object>}
 */
export const fetchNFTMetadata = async (contractId, tokenId) => {
  const baseUrl = 'https://stacks-node-api.mainnet.stacks.co';
  
  try {
    const response = await fetchWithTimeout(
      `${baseUrl}/metadata/v1/nft/${contractId}/${tokenId}`
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
};

export default {
  fetchIPFSContent,
  fetchImageAsBase64,
  fetchSTXPrice,
  fetchAddressBalance,
  fetchTransactionStatus,
  fetchNFTMetadata,
};
