/**
 * TypeScript definitions for libffi.wasm v3.5.2
 * Professional WASM-native interface for Foreign Function Interface
 *
 * Based on libffi v3.5.2 official WASM32/WASM64 implementation
 */

// FFI Type Enumeration (from official libffi)
export enum FFIType {
  VOID = 0,
  INT = 1,
  FLOAT = 2,
  DOUBLE = 3,
  LONGDOUBLE = 4,
  UINT8 = 5,
  SINT8 = 6,
  UINT16 = 7,
  SINT16 = 8,
  UINT32 = 9,
  SINT32 = 10,
  UINT64 = 11,
  SINT64 = 12,
  STRUCT = 13,
  POINTER = 14,
  COMPLEX = 15
}

// ABI Types (platform-specific)
export enum FFIABI {
  DEFAULT_ABI = 1,
  WASM32_EMSCRIPTEN = 1,
  WASM64_EMSCRIPTEN = 2,
  FIRST_ABI = 1,
  LAST_ABI = 2
}

// Status Codes
export enum FFIStatus {
  OK = 0,
  BAD_TYPEDEF = 1,
  BAD_ABI = 2
}

// Official libffi WASM module interface (based on v3.5.2)
export interface LibFFIModule {
  // Memory management
  _malloc(size: number): number
  _free(ptr: number): void
  
  // Core FFI functions (official API)
  _ffi_prep_cif(
    cif: number,
    abi: number,
    nargs: number,
    rtype: number,
    atypes: number
  ): number
  
  _ffi_call(
    cif: number,
    fn: number,
    rvalue: number,
    avalue: number
  ): void
  
  _ffi_prep_cif_var(
    cif: number,
    abi: number,
    nfixedargs: number,
    ntotalargs: number,
    rtype: number,
    atypes: number
  ): number

  // Raw API (official libffi)
  _ffi_raw_call(cif: number, fn: number, rvalue: number, avalue: number): void
  _ffi_ptrarray_to_raw(cif: number, args: number, raw: number): void
  _ffi_raw_to_ptrarray(cif: number, raw: number, args: number): void
  _ffi_raw_size(cif: number): number

  // Closure API (official libffi)
  _ffi_closure_alloc(size: number, code: number): number
  _ffi_closure_free(closure: number): void
  _ffi_prep_closure_loc(
    closure: number,
    cif: number,
    fun: number,
    userData: number,
    codeloc: number
  ): number

  // Go closures (official libffi v3.5.2)
  _ffi_prep_go_closure(goClosure: number, cif: number, fun: number): number
  _ffi_call_go(cif: number, fn: number, rvalue: number, avalue: number, closure: number): void

  // Version info (new in v3.5.0)
  _ffi_get_version(): number
  _ffi_get_version_number(): number
  _ffi_get_default_abi(): number
  _ffi_get_closure_size(): number

  // Type descriptors (complete set from official libffi)
  _ffi_type_void: number
  _ffi_type_uint8: number
  _ffi_type_sint8: number
  _ffi_type_uint16: number
  _ffi_type_sint16: number
  _ffi_type_uint32: number
  _ffi_type_sint32: number
  _ffi_type_uint64: number
  _ffi_type_sint64: number
  _ffi_type_float: number
  _ffi_type_double: number
  _ffi_type_longdouble: number
  _ffi_type_pointer: number
  _ffi_type_complex_float: number
  _ffi_type_complex_double: number
  _ffi_type_complex_longdouble: number

  // Enhanced SIMD bulk operations (layered on official v3.5.2)
  _ffi_prep_bulk_cifs_simd(
    cifs: number,
    count: number,
    abi: number,
    rtype: number,
    atypes: number,
    nargs: number
  ): number
  _ffi_memclear_simd(ptr: number, size: number): void
  _ffi_bulk_copy_simd(dest: number, src: number, size: number): void

  // Emscripten runtime methods
  ccall: (ident: string, returnType: string, argTypes: string[], args: unknown[]) => unknown
  cwrap: (ident: string, returnType: string, argTypes: string[]) => Function
  addFunction: (func: Function, signature: string) => number
  removeFunction: (funcPtr: number) => void
  wasmTable: WebAssembly.Table
  UTF8ToString: (ptr: number, maxLength?: number) => string
  stringToUTF8: (str: string, outPtr: number, maxBytesToWrite?: number) => void
  
  // Memory access (WASM32 vs WASM64 compatible)
  HEAPU8: Uint8Array
  HEAP8: Int8Array
  HEAPU16: Uint16Array
  HEAP16: Int16Array
  HEAPU32: Uint32Array
  HEAP32: Int32Array
  HEAPF32: Float32Array
  HEAPF64: Float64Array
  HEAPU64?: BigUint64Array // Available in WASM64
  
  // BigInt utilities (WASM64)
  bigintToI53Checked?: (value: bigint) => number
}

// Type descriptor structure (official libffi layout)
export interface FFITypeDescriptor {
  size: number
  alignment: number
  type: FFIType
  elements?: FFITypeDescriptor[]
}

// Call Interface structure (official libffi CIF)
export interface FFICallInterface {
  abi: FFIABI
  nargs: number
  argTypes: FFITypeDescriptor[]
  returnType: FFITypeDescriptor
  nfixedargs?: number
  flags?: number
}

// Raw union structure (official libffi ffi_raw)
export interface FFIRaw {
  sint: number
  uint: number
  flt: number
  data: Uint8Array
}

// Complex number structure
export interface ComplexNumber {
  real: number
  imag: number
}

// Closure callback type (official libffi)
export type FFIClosureCallback = (
  args: unknown[],
  returnType: FFITypeDescriptor
) => unknown

// Go closure callback (official libffi v3.5.2)
export type FFIGoClosureCallback = (
  args: unknown[],
  returnType: FFITypeDescriptor,
  userData: unknown
) => unknown

// Function call options
export interface CallOptions {
  abi?: FFIABI
  variadic?: boolean
  wasm64?: boolean
}

// WASM-native capabilities
export interface SystemCapabilities {
  wasmSupported: boolean
  wasm64Supported: boolean
  simdSupported: boolean
  bigintSupported: boolean
  closuresSupported: boolean
  goClosuresSupported: boolean
  complexNumbersSupported: boolean
  rawApiSupported: boolean
}

// Dynamic loading configuration
export interface LoadingOptions {
  cdnUrl?: string
  fallbackUrls?: string[]
  preloadModules?: boolean
  cachingEnabled?: boolean
  simdOptimizations?: boolean
}

// Error classes (enhanced from our older attempt)
export class FFIError extends Error {
  constructor(message: string, public readonly code?: FFIStatus) {
    super(message)
    this.name = 'FFIError'
  }
}

export class FFITypeError extends FFIError {
  constructor(message: string) {
    super(message, FFIStatus.BAD_TYPEDEF)
    this.name = 'FFITypeError'
  }
}

export class FFIABIError extends FFIError {
  constructor(message: string) {
    super(message, FFIStatus.BAD_ABI)
    this.name = 'FFIABIError'
  }
}

export class FFIVersionError extends FFIError {
  constructor(message: string) {
    super(message)
    this.name = 'FFIVersionError'
  }
}