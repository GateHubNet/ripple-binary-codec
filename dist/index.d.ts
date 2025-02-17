import { decodeLedgerData } from "./ledger-hashes";
import { JsonObject } from "./types/serialized-type";
/**
 * Decode a transaction
 *
 * @param binary hex-string of the encoded transaction
 * @returns the JSON representation of the transaction
 */
declare function decode(binary: string): JsonObject;
/**
 * Encode a transaction
 *
 * @param json The JSON representation of a transaction
 * @returns A hex-string of the encoded transaction
 */
declare function encode(json: object): string;
/**
 * Encode a transaction and prepare for signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
declare function encodeForSigning(json: object): string;
/**
 * Encode a transaction and prepare for signing with a claim
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
declare function encodeForSigningClaim(json: object): string;
/**
 * Encode a transaction and prepare for multi-signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
declare function encodeForMultisigning(json: object, signer: string): string;
/**
 * Encode a quality value
 *
 * @param value string representation of a number
 * @returns a hex-string representing the quality
 */
declare function encodeQuality(value: string): string;
/**
 * Decode a quality value
 *
 * @param value hex-string of a quality
 * @returns a string representing the quality
 */
declare function decodeQuality(value: string): string;
declare const _default: {
    decode: typeof decode;
    encode: typeof encode;
    encodeForSigning: typeof encodeForSigning;
    encodeForSigningClaim: typeof encodeForSigningClaim;
    encodeForMultisigning: typeof encodeForMultisigning;
    encodeQuality: typeof encodeQuality;
    decodeQuality: typeof decodeQuality;
    decodeLedgerData: typeof decodeLedgerData;
};
export = _default;
