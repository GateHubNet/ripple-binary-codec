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
exports.Blob = void 0;
var serialized_type_1 = require("./serialized-type");
var buffer_1 = require("buffer/");
/**
 * Variable length encoded type
 */
var Blob = /** @class */ (function (_super) {
    __extends(Blob, _super);
    function Blob(bytes) {
        return _super.call(this, bytes) || this;
    }
    /**
     * Defines how to read a Blob from a BinaryParser
     *
     * @param parser The binary parser to read the Blob from
     * @param hint The length of the blob, computed by readVariableLengthLength() and passed in
     * @returns A Blob object
     */
    Blob.fromParser = function (parser, hint) {
        return new Blob(parser.read(hint));
    };
    /**
     * Create a Blob object from a hex-string
     *
     * @param value existing Blob object or a hex-string
     * @returns A Blob object
     */
    Blob.from = function (value) {
        if (value instanceof Blob) {
            return value;
        }
        if (typeof value === "string") {
            return new Blob(buffer_1.Buffer.from(value, "hex"));
        }
        throw new Error("Cannot construct Blob from value given");
    };
    return Blob;
}(serialized_type_1.SerializedType));
exports.Blob = Blob;
//# sourceMappingURL=blob.js.map