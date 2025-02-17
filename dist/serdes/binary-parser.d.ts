import { FieldInstance } from "../enums";
import { SerializedType } from "../types/serialized-type";
import { Buffer } from "buffer/";
/**
 * BinaryParser is used to compute fields and values from a HexString
 */
declare class BinaryParser {
    private bytes;
    /**
     * Initialize bytes to a hex string
     *
     * @param hexBytes a hex string
     */
    constructor(hexBytes: string);
    /**
     * Peek the first byte of the BinaryParser
     *
     * @returns The first byte of the BinaryParser
     */
    peek(): number;
    /**
     * Consume the first n bytes of the BinaryParser
     *
     * @param n the number of bytes to skip
     */
    skip(n: number): void;
    /**
     * read the first n bytes from the BinaryParser
     *
     * @param n The number of bytes to read
     * @return The bytes
     */
    read(n: number): Buffer;
    /**
     * Read an integer of given size
     *
     * @param n The number of bytes to read
     * @return The number represented by those bytes
     */
    readUIntN(n: number): number;
    readUInt8(): number;
    readUInt16(): number;
    readUInt32(): number;
    size(): number;
    end(customEnd?: number): boolean;
    /**
     * Reads variable length encoded bytes
     *
     * @return The variable length bytes
     */
    readVariableLength(): Buffer;
    /**
     * Reads the length of the variable length encoded bytes
     *
     * @return The length of the variable length encoded bytes
     */
    readVariableLengthLength(): number;
    /**
     * Reads the field ordinal from the BinaryParser
     *
     * @return Field ordinal
     */
    readFieldOrdinal(): number;
    /**
     * Read the field from the BinaryParser
     *
     * @return The field represented by the bytes at the head of the BinaryParser
     */
    readField(): FieldInstance;
    /**
     * Read a given type from the BinaryParser
     *
     * @param type The type that you want to read from the BinaryParser
     * @return The instance of that type read from the BinaryParser
     */
    readType(type: typeof SerializedType): SerializedType;
    /**
     * Get the type associated with a given field
     *
     * @param field The field that you wan to get the type of
     * @return The type associated with the given field
     */
    typeForField(field: FieldInstance): typeof SerializedType;
    /**
     * Read value of the type specified by field from the BinaryParser
     *
     * @param field The field that you want to get the associated value for
     * @return The value associated with the given field
     */
    readFieldValue(field: FieldInstance): SerializedType;
    /**
     * Get the next field and value from the BinaryParser
     *
     * @return The field and value
     */
    readFieldAndValue(): [FieldInstance, SerializedType];
}
export { BinaryParser };
