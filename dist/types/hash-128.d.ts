import { Hash } from "./hash";
import { Buffer } from "buffer/";
/**
 * Hash with a width of 128 bits
 */
declare class Hash128 extends Hash {
    static readonly width = 16;
    static readonly ZERO_128: Hash128;
    constructor(bytes: Buffer);
}
export { Hash128 };
