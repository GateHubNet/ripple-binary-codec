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
exports.Hash = void 0;
var serialized_type_1 = require("./serialized-type");
var buffer_1 = require("buffer/");
/**
 * Base class defining how to encode and decode hashes
 */
var Hash = /** @class */ (function (_super) {
    __extends(Hash, _super);
    function Hash(bytes) {
        var _this = _super.call(this, bytes) || this;
        if (_this.bytes.byteLength !== _this.constructor.width) {
            throw new Error("Invalid Hash length " + _this.bytes.byteLength);
        }
        return _this;
    }
    /**
     * Construct a Hash object from an existing Hash object or a hex-string
     *
     * @param value A hash object or hex-string of a hash
     */
    Hash.from = function (value) {
        if (value instanceof this) {
            return value;
        }
        if (typeof value === "string") {
            return new this(buffer_1.Buffer.from(value, "hex"));
        }
        throw new Error("Cannot construct Hash from given value");
    };
    /**
     * Read a Hash object from a BinaryParser
     *
     * @param parser BinaryParser to read the hash from
     * @param hint length of the bytes to read, optional
     */
    Hash.fromParser = function (parser, hint) {
        return new this(parser.read(hint !== null && hint !== void 0 ? hint : this.width));
    };
    /**
     * Overloaded operator for comparing two hash objects
     *
     * @param other The Hash to compare this to
     */
    Hash.prototype.compareTo = function (other) {
        return this.bytes.compare(this.constructor.from(other).bytes);
    };
    /**
     * @returns the hex-string representation of this Hash
     */
    Hash.prototype.toString = function () {
        return this.toHex();
    };
    /**
     * Returns four bits at the specified depth within a hash
     *
     * @param depth The depth of the four bits
     * @returns The number represented by the four bits
     */
    Hash.prototype.nibblet = function (depth) {
        var byteIx = depth > 0 ? (depth / 2) | 0 : 0;
        var b = this.bytes[byteIx];
        if (depth % 2 === 0) {
            b = (b & 0xf0) >>> 4;
        }
        else {
            b = b & 0x0f;
        }
        return b;
    };
    return Hash;
}(serialized_type_1.Comparable));
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map