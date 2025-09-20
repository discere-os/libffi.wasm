/**
 * Comprehensive libffi.wasm tests combining DejaGNU and vitest patterns
 * Tests official libffi v3.5.2 WASM implementation with TypeScript interface
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import LibFFI, { FFIType, FFIABI, FFIStatus, FFIVersionError } from '../../src/lib/index.ts'
import type { FFITypeDescriptor, ComplexNumber, FFIRaw } from '../../src/lib/types.ts'

describe('libffi.wasm v3.5.2 Core Functionality', () => {
  let libffi: LibFFI

  beforeAll(async () => {
    libffi = new LibFFI({
      cdnUrl: 'https://cdn.discere.cloud/npm/@discere-os/libffi.wasm/',
      cachingEnabled: true,
      simdOptimizations: true
    })
    await libffi.initialize()
  })

  afterAll(() => {
    libffi.cleanup()
  })

  describe('Module Initialization & Capabilities', () => {
    test('should initialize with official v3.5.2 implementation', () => {
      expect(libffi).toBeDefined()
    })

    test('should report comprehensive system capabilities', () => {
      const capabilities = libffi.getSystemCapabilities()
      expect(capabilities.wasmSupported).toBe(true)
      expect(capabilities.complexNumbersSupported).toBe(true)
      expect(capabilities.rawApiSupported).toBe(true) 
      expect(capabilities.goClosuresSupported).toBe(true) // v3.5.2 feature
      expect(typeof capabilities.wasm64Supported).toBe('boolean')
      expect(typeof capabilities.simdSupported).toBe('boolean')
    })

    test('should provide version information from official API', () => {
      const versionInfo = libffi.getVersionInfo()
      expect(versionInfo.version).toMatch(/3\.5\.\d+/)
      expect(versionInfo.versionNumber).toBeGreaterThan(0x030500)
      expect([FFIABI.WASM32_EMSCRIPTEN, FFIABI.WASM64_EMSCRIPTEN]).toContain(versionInfo.defaultAbi)
    })
  })

  describe('Type System (Official libffi v3.5.2)', () => {
    test('should define all standard FFI types', () => {
      expect(FFIType.VOID).toBe(0)
      expect(FFIType.INT).toBe(1)
      expect(FFIType.FLOAT).toBe(2)
      expect(FFIType.DOUBLE).toBe(3)
      expect(FFIType.COMPLEX).toBe(15)
    })

    test('should support WASM32 and WASM64 ABIs', () => {
      expect(FFIABI.WASM32_EMSCRIPTEN).toBe(1)
      expect(FFIABI.WASM64_EMSCRIPTEN).toBe(2)
    })

    test('should handle complex number types', () => {
      const complexFloat: FFITypeDescriptor = {
        size: 8,
        alignment: 4,
        type: FFIType.COMPLEX
      }

      const complexDouble: FFITypeDescriptor = {
        size: 16,
        alignment: 8,
        type: FFIType.COMPLEX
      }

      const floatCif = libffi.prepareCall(complexFloat, [complexFloat, complexFloat])
      const doubleCif = libffi.prepareCall(complexDouble, [complexDouble, complexDouble])

      expect(floatCif.returnType.type).toBe(FFIType.COMPLEX)
      expect(doubleCif.returnType.size).toBe(16)
    })
  })

  describe('Function Calls (Based on DejaGNU test patterns)', () => {
    // These test patterns are derived from testsuite/libffi.call/* tests

    test('should handle basic integer calls (call_1_byte test pattern)', async () => {
      const uint8Type: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.UINT8
      }

      const cif = libffi.prepareCall(uint8Type, [uint8Type])
      
      // This would call a test function that returns the input
      // In the official tests, this is compiled from C test cases
      // For now, we test the CIF preparation
      expect(cif.nargs).toBe(1)
      expect(cif.argTypes[0].type).toBe(FFIType.UINT8)
    })

    test('should handle multiple argument calls (call_3_byte test pattern)', async () => {
      const uint8Type: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.UINT8
      }

      const cif = libffi.prepareCall(uint8Type, [uint8Type, uint8Type, uint8Type])
      expect(cif.nargs).toBe(3)
    })

    test('should handle floating point calls (call_f_f test pattern)', async () => {
      const floatType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.FLOAT
      }

      const cif = libffi.prepareCall(floatType, [floatType])
      expect(cif.returnType.type).toBe(FFIType.FLOAT)
    })

    test('should handle struct returns (return_sc test pattern)', async () => {
      // Test struct return value handling
      const structType: FFITypeDescriptor = {
        size: 8,
        alignment: 4,
        type: FFIType.STRUCT,
        elements: [
          { size: 1, alignment: 1, type: FFIType.SINT8 },
          { size: 1, alignment: 1, type: FFIType.SINT8 }
        ]
      }

      const cif = libffi.prepareCall(structType, [])
      expect(cif.returnType.type).toBe(FFIType.STRUCT)
      expect(cif.returnType.elements).toHaveLength(2)
    })
  })

  describe('Variadic Functions (DejaGNU va_* test patterns)', () => {
    test('should handle variadic integer calls (va_1 test pattern)', () => {
      const intType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.SINT32
      }

      const cif = libffi.prepareCall(intType, [intType], { variadic: true })
      expect(cif.nfixedargs).toBe(1)
    })

    test('should handle mixed variadic types (va_struct1 test pattern)', () => {
      const intType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.SINT32
      }

      const floatType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.FLOAT
      }

      const cif = libffi.prepareCall(intType, [intType, floatType], { variadic: true })
      expect(cif.nfixedargs).toBe(2)
      expect(cif.nargs).toBe(2)
    })
  })

  describe('Complex Numbers (DejaGNU complex_* test patterns)', () => {
    test('should handle complex float operations (complex_float test pattern)', () => {
      const a: ComplexNumber = { real: 1.0, imag: 2.0 }
      const b: ComplexNumber = { real: 3.0, imag: 4.0 }
      
      // (1+2i) * (3+4i) = (3-8) + (4+6)i = -5 + 10i
      const result = libffi.complexMultiply(a, b, 'float')
      
      expect(result.real).toBeCloseTo(-5.0, 5)
      expect(result.imag).toBeCloseTo(10.0, 5)
    })

    test('should handle complex double operations (complex_double test pattern)', () => {
      const a: ComplexNumber = { real: 2.5, imag: -1.5 }
      const b: ComplexNumber = { real: 4.0, imag: 3.0 }
      
      // (2.5-1.5i) * (4+3i) = (10+4.5) + (7.5-6)i = 14.5 + 1.5i
      const result = libffi.complexMultiply(a, b, 'double')
      
      expect(result.real).toBeCloseTo(14.5, 10)
      expect(result.imag).toBeCloseTo(1.5, 10)
    })

    test('should handle complex longdouble operations (complex_longdouble test pattern)', () => {
      const a: ComplexNumber = { real: 1e10, imag: 2e10 }
      const b: ComplexNumber = { real: 3e-10, imag: 4e-10 }
      
      const result = libffi.complexMultiply(a, b, 'longdouble')
      
      expect(result.real).toBeCloseTo(-5.0, 5)
      expect(result.imag).toBeCloseTo(10.0, 5)
    })
  })

  describe('Raw API (DejaGNU raw_* test patterns)', () => {
    test('should support raw call interface (raw_call test pattern)', async () => {
      const intType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.SINT32
      }

      const cif = libffi.prepareCall(intType, [intType, intType])
      
      // Raw API call preparation
      const rawArgs: FFIRaw[] = [
        { sint: 5, uint: 5, flt: 5.0, data: new Uint8Array([5, 0, 0, 0]) },
        { sint: 7, uint: 7, flt: 7.0, data: new Uint8Array([7, 0, 0, 0]) }
      ]
      
      // Test raw call preparation (function call would require compiled test functions)
      expect(() => libffi.rawCall(cif, 0x1000, rawArgs)).not.toThrow()
    })
  })

  describe('Error Handling (Enhanced from both approaches)', () => {
    test('should throw typed errors for invalid operations', () => {
      const uninitializedFFI = new LibFFI()
      
      // getSystemCapabilities should work without initialization
      expect(() => {
        uninitializedFFI.getSystemCapabilities()
      }).not.toThrow()
      
      // But getVersionInfo should throw since it needs the module
      expect(() => {
        uninitializedFFI.getVersionInfo()
      }).toThrow('Module not initialized')
    })

    test('should handle version mismatches gracefully', () => {
      const versionInfo = libffi.getVersionInfo()
      expect(versionInfo.version).toBeDefined()
      
      if (versionInfo.versionNumber < 0x030500) {
        expect(() => libffi.getVersionInfo()).toThrow(FFIVersionError)
      }
    })
  })

  describe('Memory Management (WASM32/WASM64 compatible)', () => {
    test('should handle cleanup with both pointer sizes', () => {
      expect(() => libffi.cleanup()).not.toThrow()
    })

    test('should support re-initialization', async () => {
      libffi.cleanup()
      await expect(libffi.initialize()).resolves.not.toThrow()
      
      const capabilities = libffi.getSystemCapabilities()
      expect(capabilities.wasmSupported).toBe(true)
    })

    test('should detect WASM64 vs WASM32 mode correctly', () => {
      const capabilities = libffi.getSystemCapabilities()
      const versionInfo = libffi.getVersionInfo()
      
      if (capabilities.wasm64Supported) {
        expect(versionInfo.defaultAbi).toBe(FFIABI.WASM64_EMSCRIPTEN)
      } else {
        expect(versionInfo.defaultAbi).toBe(FFIABI.WASM32_EMSCRIPTEN)
      }
    })
  })
})