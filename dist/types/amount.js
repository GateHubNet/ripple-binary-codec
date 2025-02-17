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
exports.Amount = void 0;
var decimal_js_1 = require("decimal.js");
var binary_parser_1 = require("../serdes/binary-parser");
var account_id_1 = require("./account-id");
var currency_1 = require("./currency");
var serialized_type_1 = require("./serialized-type");
var bigInt = require("big-integer");
var buffer_1 = require("buffer/");
/**
 * Constants for validating amounts
 */
var MIN_IOU_EXPONENT = -96;
var MAX_IOU_EXPONENT = 80;
var MAX_IOU_PRECISION = 16;
var MAX_DROPS = new decimal_js_1.Decimal("1e17");
var MIN_XRP = new decimal_js_1.Decimal("1e-6");
var mask = bigInt(0x00000000ffffffff);
/**
 * decimal.js configuration for Amount IOUs
 */
decimal_js_1.Decimal.config({
    toExpPos: MAX_IOU_EXPONENT + MAX_IOU_PRECISION,
    toExpNeg: MIN_IOU_EXPONENT - MAX_IOU_PRECISION,
});
/**
 * Type guard for AmountObject
 */
function isAmountObject(arg) {
    var keys = Object.keys(arg).sort();
    return (keys.length === 3 &&
        keys[0] === "currency" &&
        keys[1] === "issuer" &&
        keys[2] === "value");
}
/**
 * Class for serializing/Deserializing Amounts
 */
var Amount = /** @class */ (function (_super) {
    __extends(Amount, _super);
    function Amount(bytes) {
        return _super.call(this, bytes !== null && bytes !== void 0 ? bytes : Amount.defaultAmount.bytes) || this;
    }
    /**
     * Construct an amount from an IOU or string amount
     *
     * @param value An Amount, object representing an IOU, or a string
     *     representing an integer amount
     * @returns An Amount object
     */
    Amount.from = function (value) {
        if (value instanceof Amount) {
            return value;
        }
        var amount = buffer_1.Buffer.alloc(8);
        if (typeof value === "string") {
            Amount.assertXrpIsValid(value);
            var number = bigInt(value);
            var intBuf = [buffer_1.Buffer.alloc(4), buffer_1.Buffer.alloc(4)];
            intBuf[0].writeUInt32BE(Number(number.shiftRight(32)), 0);
            intBuf[1].writeUInt32BE(Number(number.and(mask)), 0);
            amount = buffer_1.Buffer.concat(intBuf);
            amount[0] |= 0x40;
            return new Amount(amount);
        }
        if (isAmountObject(value)) {
            var number = new decimal_js_1.Decimal(value.value);
            Amount.assertIouIsValid(number);
            if (number.isZero()) {
                amount[0] |= 0x80;
            }
            else {
                var integerNumberString = number
                    .times("1e" + -(number.e - 15))
                    .abs()
                    .toString();
                var num = bigInt(integerNumberString);
                var intBuf = [buffer_1.Buffer.alloc(4), buffer_1.Buffer.alloc(4)];
                intBuf[0].writeUInt32BE(Number(num.shiftRight(32)), 0);
                intBuf[1].writeUInt32BE(Number(num.and(mask)), 0);
                amount = buffer_1.Buffer.concat(intBuf);
                amount[0] |= 0x80;
                if (number.gt(new decimal_js_1.Decimal(0))) {
                    amount[0] |= 0x40;
                }
                var exponent = number.e - 15;
                var exponentByte = 97 + exponent;
                amount[0] |= exponentByte >>> 2;
                amount[1] |= (exponentByte & 0x03) << 6;
            }
            var currency = currency_1.Currency.from(value.currency).toBytes();
            var issuer = account_id_1.AccountID.from(value.issuer).toBytes();
            return new Amount(buffer_1.Buffer.concat([amount, currency, issuer]));
        }
        throw new Error("Invalid type to construct an Amount");
    };
    /**
     * Read an amount from a BinaryParser
     *
     * @param parser BinaryParser to read the Amount from
     * @returns An Amount object
     */
    Amount.fromParser = function (parser) {
        var isXRP = parser.peek() & 0x80;
        var numBytes = isXRP ? 48 : 8;
        return new Amount(parser.read(numBytes));
    };
    /**
     * Get the JSON representation of this Amount
     *
     * @returns the JSON interpretation of this.bytes
     */
    Amount.prototype.toJSON = function () {
        if (this.isNative()) {
            var bytes = this.bytes;
            var isPositive = bytes[0] & 0x40;
            var sign = isPositive ? "" : "-";
            bytes[0] &= 0x3f;
            var msb = bigInt(bytes.slice(0, 4).readUInt32BE(0));
            var lsb = bigInt(bytes.slice(4).readUInt32BE(0));
            var num = msb.shiftLeft(32).or(lsb);
            return "" + sign + num.toString();
        }
        else {
            var parser = new binary_parser_1.BinaryParser(this.toString());
            var mantissa = parser.read(8);
            var currency = currency_1.Currency.fromParser(parser);
            var issuer = account_id_1.AccountID.fromParser(parser);
            var b1 = mantissa[0];
            var b2 = mantissa[1];
            var isPositive = b1 & 0x40;
            var sign = isPositive ? "" : "-";
            var exponent = ((b1 & 0x3f) << 2) + ((b2 & 0xff) >> 6) - 97;
            mantissa[0] = 0;
            mantissa[1] &= 0x3f;
            var value = new decimal_js_1.Decimal(sign + "0x" + mantissa.toString("hex")).times("1e" + exponent);
            Amount.assertIouIsValid(value);
            return {
                value: value.toString(),
                currency: currency.toJSON(),
                issuer: issuer.toJSON(),
            };
        }
    };
    /**
     * Validate XRP amount
     *
     * @param amount String representing XRP amount
     * @returns void, but will throw if invalid amount
     */
    Amount.assertXrpIsValid = function (amount) {
        if (amount.indexOf(".") !== -1) {
            throw new Error(amount.toString() + " is an illegal amount");
        }
        var decimal = new decimal_js_1.Decimal(amount);
        if (!decimal.isZero()) {
            if (decimal.lt(MIN_XRP) || decimal.gt(MAX_DROPS)) {
                throw new Error(amount.toString() + " is an illegal amount");
            }
        }
    };
    /**
     * Validate IOU.value amount
     *
     * @param decimal Decimal.js object representing IOU.value
     * @returns void, but will throw if invalid amount
     */
    Amount.assertIouIsValid = function (decimal) {
        if (!decimal.isZero()) {
            var p = decimal.precision();
            var e = decimal.e - 15;
            if (p > MAX_IOU_PRECISION ||
                e > MAX_IOU_EXPONENT ||
                e < MIN_IOU_EXPONENT) {
                throw new Error("Decimal precision out of range");
            }
            this.verifyNoDecimal(decimal);
        }
    };
    /**
     * Ensure that the value after being multiplied by the exponent does not
     * contain a decimal.
     *
     * @param decimal a Decimal object
     * @returns a string of the object without a decimal
     */
    Amount.verifyNoDecimal = function (decimal) {
        var integerNumberString = decimal
            .times("1e" + -(decimal.e - 15))
            .abs()
            .toString();
        if (integerNumberString.indexOf(".") !== -1) {
            throw new Error("Decimal place found in integerNumberString");
        }
    };
    /**
     * Test if this amount is in units of Native Currency(XRP)
     *
     * @returns true if Native (XRP)
     */
    Amount.prototype.isNative = function () {
        return (this.bytes[0] & 0x80) === 0;
    };
    Amount.defaultAmount = new Amount(buffer_1.Buffer.from("4000000000000000", "hex"));
    return Amount;
}(serialized_type_1.SerializedType));
exports.Amount = Amount;
//# sourceMappingURL=amount.js.map