import { SerializedType } from "../types/serialized-type";
import { Buffer } from "buffer/";
declare class Bytes {
    readonly name: string;
    readonly ordinal: number;
    readonly ordinalWidth: number;
    readonly bytes: Uint8Array;
    constructor(name: string, ordinal: number, ordinalWidth: number);
    toJSON(): string;
    toBytesSink(sink: any): void;
    toBytes(): Uint8Array;
}
declare class BytesLookup {
    readonly ordinalWidth: number;
    constructor(types: Record<string, number>, ordinalWidth: number);
    from(value: Bytes | string): Bytes;
    fromParser(parser: any): Bytes;
}
interface FieldInfo {
    nth: number;
    isVLEncoded: boolean;
    isSerialized: boolean;
    isSigningField: boolean;
    type: string;
}
interface FieldInstance {
    readonly nth: number;
    readonly isVariableLengthEncoded: boolean;
    readonly isSerialized: boolean;
    readonly isSigningField: boolean;
    readonly type: Bytes;
    readonly ordinal: number;
    readonly name: string;
    readonly header: Buffer;
    readonly associatedType: typeof SerializedType;
}
declare class FieldLookup {
    constructor(fields: Array<[string, FieldInfo]>);
    fromString(value: string): FieldInstance;
}
declare const Type: BytesLookup;
declare const LedgerEntryType: BytesLookup;
declare const TransactionType: BytesLookup;
declare const TransactionResult: BytesLookup;
declare const Field: FieldLookup;
export { Field, FieldInstance, Type, LedgerEntryType, TransactionResult, TransactionType, };
