"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeLedgerData = exports.ledgerHash = exports.transactionTreeHash = exports.accountStateHash = void 0;
var assert = require("assert");
var shamap_1 = require("./shamap");
var hash_prefixes_1 = require("./hash-prefixes");
var hashes_1 = require("./hashes");
var binary_1 = require("./binary");
var hash_256_1 = require("./types/hash-256");
var st_object_1 = require("./types/st-object");
var uint_64_1 = require("./types/uint-64");
var uint_32_1 = require("./types/uint-32");
var uint_8_1 = require("./types/uint-8");
var binary_parser_1 = require("./serdes/binary-parser");
var bigInt = require("big-integer");
/**
 * Computes the hash of a list of objects
 *
 * @param itemizer Converts an item into a format that can be added to SHAMap
 * @param itemsJson Array of items to add to a SHAMap
 * @returns the hash of the SHAMap
 */
function computeHash(itemizer, itemsJson) {
    var map = new shamap_1.ShaMap();
    itemsJson.forEach(function (item) { return map.addItem.apply(map, itemizer(item)); });
    return map.hash();
}
/**
 * Convert a transaction into an index and an item
 *
 * @param json transaction with metadata
 * @returns a tuple of index and item to be added to SHAMap
 */
function transactionItemizer(json) {
    assert(json.hash);
    var index = hash_256_1.Hash256.from(json.hash);
    var item = {
        hashPrefix: function () {
            return hash_prefixes_1.HashPrefix.transaction;
        },
        toBytesSink: function (sink) {
            var serializer = new binary_1.BinarySerializer(sink);
            serializer.writeLengthEncoded(st_object_1.STObject.from(json));
            serializer.writeLengthEncoded(st_object_1.STObject.from(json.metaData));
        },
    };
    return [index, item, undefined];
}
/**
 * Convert an entry to a pair Hash256 and ShaMapNode
 *
 * @param json JSON describing a ledger entry item
 * @returns a tuple of index and item to be added to SHAMap
 */
function entryItemizer(json) {
    var index = hash_256_1.Hash256.from(json.index);
    var bytes = binary_1.serializeObject(json);
    var item = {
        hashPrefix: function () {
            return hash_prefixes_1.HashPrefix.accountStateEntry;
        },
        toBytesSink: function (sink) {
            sink.put(bytes);
        },
    };
    return [index, item, undefined];
}
/**
 * Function computing the hash of a transaction tree
 *
 * @param param An array of transaction objects to hash
 * @returns A Hash256 object
 */
function transactionTreeHash(param) {
    var itemizer = transactionItemizer;
    return computeHash(itemizer, param);
}
exports.transactionTreeHash = transactionTreeHash;
/**
 * Function computing the hash of accountState
 *
 * @param param A list of accountStates hash
 * @returns A Hash256 object
 */
function accountStateHash(param) {
    var itemizer = entryItemizer;
    return computeHash(itemizer, param);
}
exports.accountStateHash = accountStateHash;
/**
 * Serialize and hash a ledger header
 *
 * @param header a ledger header
 * @returns the hash of header
 */
function ledgerHash(header) {
    var hash = new hashes_1.Sha512Half();
    hash.put(hash_prefixes_1.HashPrefix.ledgerHeader);
    assert(header.parent_close_time !== undefined);
    assert(header.close_flags !== undefined);
    uint_32_1.UInt32.from(header.ledger_index).toBytesSink(hash);
    uint_64_1.UInt64.from(bigInt(String(header.total_coins))).toBytesSink(hash);
    hash_256_1.Hash256.from(header.parent_hash).toBytesSink(hash);
    hash_256_1.Hash256.from(header.transaction_hash).toBytesSink(hash);
    hash_256_1.Hash256.from(header.account_hash).toBytesSink(hash);
    uint_32_1.UInt32.from(header.parent_close_time).toBytesSink(hash);
    uint_32_1.UInt32.from(header.close_time).toBytesSink(hash);
    uint_8_1.UInt8.from(header.close_time_resolution).toBytesSink(hash);
    uint_8_1.UInt8.from(header.close_flags).toBytesSink(hash);
    return hash.finish();
}
exports.ledgerHash = ledgerHash;
/**
 * Decodes a serialized ledger header
 *
 * @param binary A serialized ledger header
 * @returns A JSON object describing a ledger header
 */
function decodeLedgerData(binary) {
    assert(typeof binary === "string", "binary must be a hex string");
    var parser = new binary_parser_1.BinaryParser(binary);
    return {
        ledger_index: parser.readUInt32(),
        total_coins: parser.readType(uint_64_1.UInt64).valueOf().toString(),
        parent_hash: parser.readType(hash_256_1.Hash256).toHex(),
        transaction_hash: parser.readType(hash_256_1.Hash256).toHex(),
        account_hash: parser.readType(hash_256_1.Hash256).toHex(),
        parent_close_time: parser.readUInt32(),
        close_time: parser.readUInt32(),
        close_time_resolution: parser.readUInt8(),
        close_flags: parser.readUInt8(),
    };
}
exports.decodeLedgerData = decodeLedgerData;
//# sourceMappingURL=ledger-hashes.js.map