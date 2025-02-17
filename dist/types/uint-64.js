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
exports.UInt64 = void 0;
var uint_1 = require("./uint");
var bigInt = require("big-integer");
var big_integer_1 = require("big-integer");
var buffer_1 = require("buffer/");
var HEX_REGEX = /^[A-F0-9]{16}$/;
var mask = bigInt(0x00000000ffffffff);
/**
 * Derived UInt class for serializing/deserializing 64 bit UInt
 */
var UInt64 = /** @class */ (function (_super) {
    __extends(UInt64, _super);
    function UInt64(bytes) {
        return _super.call(this, bytes !== null && bytes !== void 0 ? bytes : UInt64.defaultUInt64.bytes) || this;
    }
    UInt64.fromParser = function (parser) {
        return new UInt64(parser.read(UInt64.width));
    };
    /**
     * Construct a UInt64 object
     *
     * @param val A UInt64, hex-string, bigInt, or number
     * @returns A UInt64 object
     */
    UInt64.from = function (val) {
        if (val instanceof UInt64) {
            return val;
        }
        var buf = buffer_1.Buffer.alloc(UInt64.width);
        if (typeof val === "number") {
            if (val < 0) {
                throw new Error("value must be an unsigned integer");
            }
            var number = bigInt(val);
            var intBuf = [buffer_1.Buffer.alloc(4), buffer_1.Buffer.alloc(4)];
            intBuf[0].writeUInt32BE(Number(number.shiftRight(32)), 0);
            intBuf[1].writeUInt32BE(Number(number.and(mask)), 0);
            return new UInt64(buffer_1.Buffer.concat(intBuf));
        }
        if (typeof val === "string") {
            if (!HEX_REGEX.test(val)) {
                throw new Error(val + " is not a valid hex-string");
            }
            buf = buffer_1.Buffer.from(val, "hex");
            return new UInt64(buf);
        }
        if (big_integer_1.isInstance(val)) {
            var intBuf = [buffer_1.Buffer.alloc(4), buffer_1.Buffer.alloc(4)];
            intBuf[0].writeUInt32BE(Number(val.shiftRight(bigInt(32))), 0);
            intBuf[1].writeUInt32BE(Number(val.and(mask)), 0);
            return new UInt64(buffer_1.Buffer.concat(intBuf));
        }
        throw new Error("Cannot construct UInt64 from given value");
    };
    /**
     * The JSON representation of a UInt64 object
     *
     * @returns a hex-string
     */
    UInt64.prototype.toJSON = function () {
        return this.bytes.toString("hex").toUpperCase();
    };
    /**
     * Get the value of the UInt64
     *
     * @returns the number represented buy this.bytes
     */
    UInt64.prototype.valueOf = function () {
        var msb = bigInt(this.bytes.slice(0, 4).readUInt32BE(0));
        var lsb = bigInt(this.bytes.slice(4).readUInt32BE(0));
        return msb.shiftLeft(bigInt(32)).or(lsb);
    };
    /**
     * Get the bytes representation of the UInt64 object
     *
     * @returns 8 bytes representing the UInt64
     */
    UInt64.prototype.toBytes = function () {
        return this.bytes;
    };
    UInt64.width = 64 / 8; // 8
    UInt64.defaultUInt64 = new UInt64(buffer_1.Buffer.alloc(UInt64.width));
    return UInt64;
}(uint_1.UInt));
exports.UInt64 = UInt64;
//# sourceMappingURL=uint-64.js.map