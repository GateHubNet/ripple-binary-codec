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
exports.UInt = void 0;
var serialized_type_1 = require("./serialized-type");
/**
 * Compare numbers and bigInts n1 and n2
 *
 * @param n1 First object to compare
 * @param n2 Second object to compare
 * @returns -1, 0, or 1, depending on how the two objects compare
 */
function compare(n1, n2) {
    return n1 < n2 ? -1 : n1 == n2 ? 0 : 1;
}
/**
 * Base class for serializing and deserializing unsigned integers.
 */
var UInt = /** @class */ (function (_super) {
    __extends(UInt, _super);
    function UInt(bytes) {
        return _super.call(this, bytes) || this;
    }
    /**
     * Overload of compareTo for Comparable
     *
     * @param other other UInt to compare this to
     * @returns -1, 0, or 1 depending on how the objects relate to each other
     */
    UInt.prototype.compareTo = function (other) {
        return compare(this.valueOf(), other.valueOf());
    };
    /**
     * Convert a UInt object to JSON
     *
     * @returns number or string represented by this.bytes
     */
    UInt.prototype.toJSON = function () {
        var val = this.valueOf();
        return typeof val === "number" ? val : val.toString();
    };
    return UInt;
}(serialized_type_1.Comparable));
exports.UInt = UInt;
//# sourceMappingURL=uint.js.map