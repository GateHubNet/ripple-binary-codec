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
exports.UInt8 = void 0;
var uint_1 = require("./uint");
var buffer_1 = require("buffer/");
/**
 * Derived UInt class for serializing/deserializing 8 bit UInt
 */
var UInt8 = /** @class */ (function (_super) {
    __extends(UInt8, _super);
    function UInt8(bytes) {
        return _super.call(this, bytes !== null && bytes !== void 0 ? bytes : UInt8.defaultUInt8.bytes) || this;
    }
    UInt8.fromParser = function (parser) {
        return new UInt8(parser.read(UInt8.width));
    };
    /**
     * Construct a UInt8 object from a number
     *
     * @param val UInt8 object or number
     */
    UInt8.from = function (val) {
        if (val instanceof UInt8) {
            return val;
        }
        if (typeof val === "number") {
            var buf = buffer_1.Buffer.alloc(UInt8.width);
            buf.writeUInt8(val, 0);
            return new UInt8(buf);
        }
        throw new Error("Cannot construct UInt8 from given value");
    };
    /**
     * get the value of a UInt8 object
     *
     * @returns the number represented by this.bytes
     */
    UInt8.prototype.valueOf = function () {
        return this.bytes.readUInt8(0);
    };
    UInt8.width = 8 / 8; // 1
    UInt8.defaultUInt8 = new UInt8(buffer_1.Buffer.alloc(UInt8.width));
    return UInt8;
}(uint_1.UInt));
exports.UInt8 = UInt8;
//# sourceMappingURL=uint-8.js.map