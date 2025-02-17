"use strict";
var assert = require("assert");
var coretypes_1 = require("./coretypes");
var ledger_hashes_1 = require("./ledger-hashes");
var signingData = coretypes_1.binary.signingData, signingClaimData = coretypes_1.binary.signingClaimData, multiSigningData = coretypes_1.binary.multiSigningData, binaryToJSON = coretypes_1.binary.binaryToJSON, serializeObject = coretypes_1.binary.serializeObject;
/**
 * Decode a transaction
 *
 * @param binary hex-string of the encoded transaction
 * @returns the JSON representation of the transaction
 */
function decode(binary) {
    assert(typeof binary === "string", "binary must be a hex string");
    return binaryToJSON(binary);
}
/**
 * Encode a transaction
 *
 * @param json The JSON representation of a transaction
 * @returns A hex-string of the encoded transaction
 */
function encode(json) {
    assert(typeof json === "object");
    return serializeObject(json)
        .toString("hex")
        .toUpperCase();
}
/**
 * Encode a transaction and prepare for signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForSigning(json) {
    assert(typeof json === "object");
    return signingData(json)
        .toString("hex")
        .toUpperCase();
}
/**
 * Encode a transaction and prepare for signing with a claim
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForSigningClaim(json) {
    assert(typeof json === "object");
    return signingClaimData(json)
        .toString("hex")
        .toUpperCase();
}
/**
 * Encode a transaction and prepare for multi-signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForMultisigning(json, signer) {
    assert(typeof json === "object");
    assert.equal(json["SigningPubKey"], "");
    return multiSigningData(json, signer)
        .toString("hex")
        .toUpperCase();
}
/**
 * Encode a quality value
 *
 * @param value string representation of a number
 * @returns a hex-string representing the quality
 */
function encodeQuality(value) {
    assert(typeof value === "string");
    return coretypes_1.quality.encode(value).toString("hex").toUpperCase();
}
/**
 * Decode a quality value
 *
 * @param value hex-string of a quality
 * @returns a string representing the quality
 */
function decodeQuality(value) {
    assert(typeof value === "string");
    return coretypes_1.quality.decode(value).toString();
}
module.exports = {
    decode: decode,
    encode: encode,
    encodeForSigning: encodeForSigning,
    encodeForSigningClaim: encodeForSigningClaim,
    encodeForMultisigning: encodeForMultisigning,
    encodeQuality: encodeQuality,
    decodeQuality: decodeQuality,
    decodeLedgerData: ledger_hashes_1.decodeLedgerData,
};
//# sourceMappingURL=index.js.map