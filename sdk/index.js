import {
    makeContractCall,
    AnchorMode,
    PostConditionMode,
    uintCV,
    stringAsciiCV,
    principalCV,
    callReadOnlyFunction
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

export const DEFAULT_CONTRACT_NAME = 'achievement-poap';

/**
 * Achievement POAP SDK for Stacks (Bitcoin L2)
 */
export class AchievementPOAP {
    /**
     * Initialize SDK
     * @param {Object} options 
     * @param {string} [options.contractAddress] The Stacks address that deployed the contract
     * @param {string} [options.contractName] The POAP contract name
     * @param {object} [options.network] Network object (e.g. StacksMainnet)
     */
    constructor({ 
        contractAddress = Buffer.from('U1AyS1laUk5NRTMzWTM5R1AzUktDOTBEUUo0NUVGMU4wTlpOVlJFMDk=', 'base64').toString('ascii'), 
        contractName = DEFAULT_CONTRACT_NAME, 
        network = new StacksMainnet() 
    } = {}) {
        this.contractAddress = contractAddress;
        this.contractName = contractName;
        this.network = network;
    }

    /**
     * Get details of a POAP Event
     * @param {number} eventId The ID of the event
     * @returns {Promise<any>} The Cl.prettyPrint representation or cv
     */
    async getEvent(eventId) {
        try {
            const result = await callReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-event',
                functionArgs: [uintCV(eventId)],
                senderAddress: this.contractAddress,
                network: this.network
            });
            return result;
        } catch (error) {
            throw new Error(`Failed to fetch event #${eventId}: ${error.message}`);
        }
    }

    /**
     * Get the total mint fee configured in the contract
     * @returns {Promise<any>}
     */
    async getMintFee() {
        return callReadOnlyFunction({
            contractAddress: this.contractAddress,
            contractName: this.contractName,
            functionName: 'get-mint-fee',
            functionArgs: [],
            senderAddress: this.contractAddress,
            network: this.network
        });
    }

    /**
     * Get the owner of a specific POAP token id.
     * Mirrors the SIP-009 `get-owner` read function.
     * @param {number} tokenId The NFT token id
     * @returns {Promise<any>} Clarity value — `(ok (some principal))` if owned, `(ok none)` otherwise
     */
        async getOwner(tokenId) {
        try {
            return await callReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-owner',
                functionArgs: [uintCV(tokenId)],
                senderAddress: this.contractAddress,
                network: this.network
            });
        } catch (error) {
            throw new Error(`Failed to fetch owner for token #${tokenId}: ${error.message}`);
        }
    }

    /**
     * Get the metadata URI for a specific POAP token id.
     * Resolves to the owning event's `metadata-uri`, or `none` if the token
     * does not exist.
     * @param {number} tokenId The NFT token id
     * @returns {Promise<any>} Clarity value — `(ok (some string))` or `(ok none)`
     */
    async getTokenUri(tokenId) {
        try {
            return await callReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-token-uri',
                functionArgs: [uintCV(tokenId)],
                senderAddress: this.contractAddress,
                network: this.network
            });
        } catch (error) {
            throw new Error(`Failed to fetch token-uri for token #${tokenId}: ${error.message}`);
        }
    }

    /**
     * Check whether a given user has already minted a POAP for an event.
     * Mirrors the `has-minted-event` read function.
     * @param {number} eventId The event id
     * @param {string} user The Stacks principal to check
     * @returns {Promise<any>} Clarity boolean value
     */
        async hasMintedEvent(eventId, user) {
        try {
            return await callReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'has-minted-event',
                functionArgs: [uintCV(eventId), principalCV(user)],
                senderAddress: this.contractAddress,
                network: this.network
            });
        } catch (error) {
            throw new Error(`Failed to check mint status for event #${eventId}: ${error.message}`);
        }
    }

    /**
     * Get the current and max supply for an event.
     * Mirrors the `get-event-supply` read function.
     * @param {number} eventId The event id
     * @returns {Promise<any>} Clarity tuple `{ current: uint, max: uint }`
     */
    async getEventSupply(eventId) {
        try {
            return await callReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-event-supply',
                functionArgs: [uintCV(eventId)],
                senderAddress: this.contractAddress,
                network: this.network
            });
        } catch (error) {
            throw new Error(`Failed to fetch supply for event #${eventId}: ${error.message}`);
        }
    }



    /**
     * Prepare a `makeContractCall` options object to mint a POAP
     * @param {number} eventId 
     * @param {string} senderKey 
     * @param {number} [fee]
     * @param {number} [nonce]
     */
    async buildMintTransaction(eventId, senderKey, fee = 2500, nonce = undefined) {
        const txOptions = {
            contractAddress: this.contractAddress,
            contractName: this.contractName,
            functionName: 'mint-poap',
            functionArgs: [uintCV(eventId)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            fee: BigInt(fee),
        };
        if (nonce !== undefined) txOptions.nonce = BigInt(nonce);

        return makeContractCall(txOptions);
    }

    /**
     * Prepare a `makeContractCall` options object to transfer a POAP
     * @param {number} tokenId 
     * @param {string} senderAddress
     * @param {string} recipientAddress
     * @param {string} senderKey 
     * @param {number} [fee] 
     * @param {number} [nonce] 
     */
    async buildTransferTransaction(tokenId, senderAddress, recipientAddress, senderKey, fee = 2500, nonce = undefined) {
        const txOptions = {
            contractAddress: this.contractAddress,
            contractName: this.contractName,
            functionName: 'transfer',
            functionArgs: [
                uintCV(tokenId),
                principalCV(senderAddress),
                principalCV(recipientAddress)
            ],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Deny,
            fee: BigInt(fee),
        };
        if (nonce !== undefined) txOptions.nonce = BigInt(nonce);

        return makeContractCall(txOptions);
    }

    /**
     * Prepare a `makeContractCall` options object to create an event (Admin)
     * @param {Object} eventOptions
     * @param {string} eventOptions.name
     * @param {string} eventOptions.description
     * @param {number} eventOptions.maxSupply
     * @param {number} eventOptions.startBlock
     * @param {number} eventOptions.endBlock
     * @param {string} eventOptions.metadataUri
     * @param {string} senderKey
     * @param {number} [fee]
     * @param {number} [nonce]
     */
    async buildCreateEventTransaction({ name, description, maxSupply, startBlock, endBlock, metadataUri }, senderKey, fee = 2500, nonce = undefined) {
        const txOptions = {
            contractAddress: this.contractAddress,
            contractName: this.contractName,
            functionName: 'create-event',
            functionArgs: [
                stringAsciiCV(name),
                stringAsciiCV(description),
                uintCV(maxSupply),
                uintCV(startBlock),
                uintCV(endBlock),
                stringAsciiCV(metadataUri),
            ],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Deny,
            fee: BigInt(fee),
        };
        if (nonce !== undefined) txOptions.nonce = BigInt(nonce);

        return makeContractCall(txOptions);
    }
}

// polish and finalize deployment-runbook — ref:docs/deployment-runbook#9 (1776635184337)
