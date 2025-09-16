/**
 * TypeScript definitions for libffi.wasm v3.5.2
 * Professional WASM-native interface for Foreign Function Interface
 *
 * Based on libffi v3.5.2 official WASM32/WASM64 implementation
 */
// FFI Type Enumeration (from official libffi)
export var FFIType;
(function (FFIType) {
    FFIType[FFIType["VOID"] = 0] = "VOID";
    FFIType[FFIType["INT"] = 1] = "INT";
    FFIType[FFIType["FLOAT"] = 2] = "FLOAT";
    FFIType[FFIType["DOUBLE"] = 3] = "DOUBLE";
    FFIType[FFIType["LONGDOUBLE"] = 4] = "LONGDOUBLE";
    FFIType[FFIType["UINT8"] = 5] = "UINT8";
    FFIType[FFIType["SINT8"] = 6] = "SINT8";
    FFIType[FFIType["UINT16"] = 7] = "UINT16";
    FFIType[FFIType["SINT16"] = 8] = "SINT16";
    FFIType[FFIType["UINT32"] = 9] = "UINT32";
    FFIType[FFIType["SINT32"] = 10] = "SINT32";
    FFIType[FFIType["UINT64"] = 11] = "UINT64";
    FFIType[FFIType["SINT64"] = 12] = "SINT64";
    FFIType[FFIType["STRUCT"] = 13] = "STRUCT";
    FFIType[FFIType["POINTER"] = 14] = "POINTER";
    FFIType[FFIType["COMPLEX"] = 15] = "COMPLEX";
})(FFIType || (FFIType = {}));
// ABI Types (platform-specific)
export var FFIABI;
(function (FFIABI) {
    FFIABI[FFIABI["DEFAULT_ABI"] = 1] = "DEFAULT_ABI";
    FFIABI[FFIABI["WASM32_EMSCRIPTEN"] = 1] = "WASM32_EMSCRIPTEN";
    FFIABI[FFIABI["WASM64_EMSCRIPTEN"] = 2] = "WASM64_EMSCRIPTEN";
    FFIABI[FFIABI["FIRST_ABI"] = 1] = "FIRST_ABI";
    FFIABI[FFIABI["LAST_ABI"] = 2] = "LAST_ABI";
})(FFIABI || (FFIABI = {}));
// Status Codes
export var FFIStatus;
(function (FFIStatus) {
    FFIStatus[FFIStatus["OK"] = 0] = "OK";
    FFIStatus[FFIStatus["BAD_TYPEDEF"] = 1] = "BAD_TYPEDEF";
    FFIStatus[FFIStatus["BAD_ABI"] = 2] = "BAD_ABI";
})(FFIStatus || (FFIStatus = {}));
// Error classes (enhanced from our older attempt)
export class FFIError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'FFIError';
    }
}
export class FFITypeError extends FFIError {
    constructor(message) {
        super(message, FFIStatus.BAD_TYPEDEF);
        this.name = 'FFITypeError';
    }
}
export class FFIABIError extends FFIError {
    constructor(message) {
        super(message, FFIStatus.BAD_ABI);
        this.name = 'FFIABIError';
    }
}
export class FFIVersionError extends FFIError {
    constructor(message) {
        super(message);
        this.name = 'FFIVersionError';
    }
}
