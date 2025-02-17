"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathSet = void 0;
var account_id_1 = require("./account-id");
var currency_1 = require("./currency");
var binary_parser_1 = require("../serdes/binary-parser");
var serialized_type_1 = require("./serialized-type");
var buffer_1 = require("buffer/");
/**
 * Constants for separating Paths in a PathSet
 */
var PATHSET_END_BYTE = 0x00;
var PATH_SEPARATOR_BYTE = 0xff;
/**
 * Constant for masking types of a Hop
 */
var TYPE_ACCOUNT = 0x01;
var TYPE_CURRENCY = 0x10;
var TYPE_ISSUER = 0x20;
/**
 * TypeGuard for HopObject
 */
function isHopObject(arg) {
    return (arg.issuer !== undefined ||
        arg.account !== undefined ||
        arg.currency !== undefined);
}
/**
 * TypeGuard for PathSet
 */
function isPathSet(arg) {
    return ((Array.isArray(arg) && arg.length === 0) ||
        (Array.isArray(arg) && Array.isArray(arg[0]) && arg[0].length === 0) ||
        (Array.isArray(arg) && Array.isArray(arg[0]) && isHopObject(arg[0][0])));
}
/**
 * Serialize and Deserialize a Hop
 */
var Hop = /** @class */ (function (_super) {
    __extends(Hop, _super);
    function Hop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Create a Hop from a HopObject
     *
     * @param value Either a hop or HopObject to create a hop with
     * @returns a Hop
     */
    Hop.from = function (value) {
        if (value instanceof Hop) {
            return value;
        }
        var bytes = [buffer_1.Buffer.from([0])];
        if (value.account) {
            bytes.push(account_id_1.AccountID.from(value.account).toBytes());
            bytes[0][0] |= TYPE_ACCOUNT;
        }
        if (value.currency) {
            bytes.push(currency_1.Currency.from(value.currency).toBytes());
            bytes[0][0] |= TYPE_CURRENCY;
        }
        if (value.issuer) {
            bytes.push(account_id_1.AccountID.from(value.issuer).toBytes());
            bytes[0][0] |= TYPE_ISSUER;
        }
        return new Hop(buffer_1.Buffer.concat(bytes));
    };
    /**
     * Construct a Hop from a BinaryParser
     *
     * @param parser BinaryParser to read the Hop from
     * @returns a Hop
     */
    Hop.fromParser = function (parser) {
        var type = parser.readUInt8();
        var bytes = [buffer_1.Buffer.from([type])];
        if (type & TYPE_ACCOUNT) {
            bytes.push(parser.read(account_id_1.AccountID.width));
        }
        if (type & TYPE_CURRENCY) {
            bytes.push(parser.read(currency_1.Currency.width));
        }
        if (type & TYPE_ISSUER) {
            bytes.push(parser.read(account_id_1.AccountID.width));
        }
        return new Hop(buffer_1.Buffer.concat(bytes));
    };
    /**
     * Get the JSON interpretation of this hop
     *
     * @returns a HopObject, an JS object with optional account, issuer, and currency
     */
    Hop.prototype.toJSON = function () {
        var hopParser = new binary_parser_1.BinaryParser(this.bytes.toString("hex"));
        var type = hopParser.readUInt8();
        var result = {};
        if (type & TYPE_ACCOUNT) {
            result.account = account_id_1.AccountID.fromParser(hopParser).toJSON();
        }
        if (type & TYPE_CURRENCY) {
            result.currency = currency_1.Currency.fromParser(hopParser).toJSON();
        }
        if (type & TYPE_ISSUER) {
            result.issuer = account_id_1.AccountID.fromParser(hopParser).toJSON();
        }
        return result;
    };
    /**
     * get a number representing the type of this hop
     *
     * @returns a number to be bitwise and-ed with TYPE_ constants to describe the types in the hop
     */
    Hop.prototype.type = function () {
        return this.bytes[0];
    };
    return Hop;
}(serialized_type_1.SerializedType));
/**
 * Class for serializing/deserializing Paths
 */
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * construct a Path from an array of Hops
     *
     * @param value Path or array of HopObjects to construct a Path
     * @returns the Path
     */
    Path.from = function (value) {
        if (value instanceof Path) {
            return value;
        }
        var bytes = [];
        value.forEach(function (hop) {
            bytes.push(Hop.from(hop).toBytes());
        });
        return new Path(buffer_1.Buffer.concat(bytes));
    };
    /**
     * Read a Path from a BinaryParser
     *
     * @param parser BinaryParser to read Path from
     * @returns the Path represented by the bytes read from the BinaryParser
     */
    Path.fromParser = function (parser) {
        var bytes = [];
        while (!parser.end()) {
            bytes.push(Hop.fromParser(parser).toBytes());
            if (parser.peek() === PATHSET_END_BYTE ||
                parser.peek() === PATH_SEPARATOR_BYTE) {
                break;
            }
        }
        return new Path(buffer_1.Buffer.concat(bytes));
    };
    /**
     * Get the JSON representation of this Path
     *
     * @returns an Array of HopObject constructed from this.bytes
     */
    Path.prototype.toJSON = function () {
        var json = [];
        var pathParser = new binary_parser_1.BinaryParser(this.toString());
        while (!pathParser.end()) {
            json.push(Hop.fromParser(pathParser).toJSON());
        }
        return json;
    };
    return Path;
}(serialized_type_1.SerializedType));
/**
 * Deserialize and Serialize the PathSet type
 */
var PathSet = /** @class */ (function (_super) {
    __extends(PathSet, _super);
    function PathSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Construct a PathSet from an Array of Arrays representing paths
     *
     * @param value A PathSet or Array of Array of HopObjects
     * @returns the PathSet constructed from value
     */
    PathSet.from = function (value) {
        if (value instanceof PathSet) {
            return value;
        }
        if (isPathSet(value)) {
            var bytes_1 = [];
            value.forEach(function (path) {
                bytes_1.push(Path.from(path).toBytes());
                bytes_1.push(buffer_1.Buffer.from([PATH_SEPARATOR_BYTE]));
            });
            bytes_1[bytes_1.length - 1] = buffer_1.Buffer.from([PATHSET_END_BYTE]);
            return new PathSet(buffer_1.Buffer.concat(bytes_1));
        }
        throw new Error("Cannot construct PathSet from given value");
    };
    /**
     * Construct a PathSet from a BinaryParser
     *
     * @param parser A BinaryParser to read PathSet from
     * @returns the PathSet read from parser
     */
    PathSet.fromParser = function (parser) {
        var bytes = [];
        while (!parser.end()) {
            bytes.push(Path.fromParser(parser).toBytes());
            bytes.push(parser.read(1));
            if (bytes[bytes.length - 1][0] == PATHSET_END_BYTE) {
                break;
            }
        }
        return new PathSet(buffer_1.Buffer.concat(bytes));
    };
    /**
     * Get the JSON representation of this PathSet
     *
     * @returns an Array of Array of HopObjects, representing this PathSet
     */
    PathSet.prototype.toJSON = function () {
        var json = [];
        var pathParser = new binary_parser_1.BinaryParser(this.toString());
        while (!pathParser.end()) {
            json.push(Path.fromParser(pathParser).toJSON());
            pathParser.skip(1);
        }
        return json;
    };
    return PathSet;
}(serialized_type_1.SerializedType));
exports.PathSet = PathSet;
//# sourceMappingURL=path-set.js.map