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
exports.Hash128 = void 0;
var hash_1 = require("./hash");
var buffer_1 = require("buffer/");
/**
 * Hash with a width of 128 bits
 */
var Hash128 = /** @class */ (function (_super) {
    __extends(Hash128, _super);
    function Hash128(bytes) {
        return _super.call(this, bytes !== null && bytes !== void 0 ? bytes : Hash128.ZERO_128.bytes) || this;
    }
    Hash128.width = 16;
    Hash128.ZERO_128 = new Hash128(buffer_1.Buffer.alloc(Hash128.width));
    return Hash128;
}(hash_1.Hash));
exports.Hash128 = Hash128;
//# sourceMappingURL=hash-128.js.map