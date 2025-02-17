"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quality = void 0;
var types_1 = require("./types");
var decimal_js_1 = require("decimal.js");
var bigInt = require("big-integer");
var buffer_1 = require("buffer/");
/**
 * class for encoding and decoding quality
 */
var quality = /** @class */ (function () {
    function quality() {
    }
    /**
     * Encode quality amount
     *
     * @param arg string representation of an amount
     * @returns Serialized quality
     */
    quality.encode = function (quality) {
        var decimal = new decimal_js_1.Decimal(quality);
        var exponent = decimal.e - 15;
        var qualityString = decimal.times("1e" + -exponent).abs().toString();
        var bytes = types_1.coreTypes.UInt64.from(bigInt(qualityString)).toBytes();
        bytes[0] = exponent + 100;
        return bytes;
    };
    /**
     * Decode quality amount
     *
     * @param arg hex-string denoting serialized quality
     * @returns deserialized quality
     */
    quality.decode = function (quality) {
        var bytes = buffer_1.Buffer.from(quality, "hex").slice(-8);
        var exponent = bytes[0] - 100;
        var mantissa = new decimal_js_1.Decimal("0x" + bytes.slice(1).toString("hex"));
        return mantissa.times("1e" + exponent);
    };
    return quality;
}());
exports.quality = quality;
//# sourceMappingURL=quality.js.map