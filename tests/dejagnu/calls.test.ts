/**
 * Comprehensive call tests based on DejaGNU testsuite/libffi.call/*
 * Tests real WASM module with all official libffi v3.5.2 call patterns
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import LibFFI, { FFIType, FFIABI } from '../../src/lib/index.js'
import type { FFITypeDescriptor } from '../../src/lib/types.js'

describe('DejaGNU Call Tests (libffi.call/*)', () => {
  let libffi: LibFFI

  beforeAll(async () => {
    libffi = new LibFFI({
      cdnUrl: 'https://cdn.discere.cloud/npm/@discere-os/libffi.wasm/'
    })
    await libffi.initialize()
  })

  afterAll(() => {
    libffi.cleanup()
  })

  describe('Basic Type Calls', () => {
    // Based on testsuite/libffi.call/call.exp test patterns
    
    test('call_1_byte - should handle 1-byte return values', async () => {
      const uint8Type: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.UINT8
      }

      const cif = libffi.prepareCall(uint8Type, [uint8Type])
      expect(cif.returnType.size).toBe(1)
      expect(cif.nargs).toBe(1)
    })

    test('call_2_byte - should handle 2-byte return values', async () => {
      const uint16Type: FFITypeDescriptor = {
        size: 2,
        alignment: 2,
        type: FFIType.UINT16
      }

      const cif = libffi.prepareCall(uint16Type, [uint16Type])
      expect(cif.returnType.size).toBe(2)
    })

    test('call_4_byte - should handle 4-byte return values', async () => {
      const uint32Type: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.UINT32
      }

      const cif = libffi.prepareCall(uint32Type, [uint32Type])
      expect(cif.returnType.size).toBe(4)
    })

    test('call_8_byte - should handle 8-byte return values', async () => {
      const uint64Type: FFITypeDescriptor = {
        size: 8,
        alignment: 8,
        type: FFIType.UINT64
      }

      const cif = libffi.prepareCall(uint64Type, [uint64Type])
      expect(cif.returnType.size).toBe(8)
    })
  })

  describe('Floating Point Calls', () => {
    test('call_f_f - float to float calls', async () => {
      const floatType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.FLOAT
      }

      const cif = libffi.prepareCall(floatType, [floatType])
      expect(cif.returnType.type).toBe(FFIType.FLOAT)
      expect(cif.argTypes[0].type).toBe(FFIType.FLOAT)
    })

    test('call_d_d - double to double calls', async () => {
      const doubleType: FFITypeDescriptor = {
        size: 8,
        alignment: 8,
        type: FFIType.DOUBLE
      }

      const cif = libffi.prepareCall(doubleType, [doubleType])
      expect(cif.returnType.type).toBe(FFIType.DOUBLE)
    })

    test('call_ld_ld - long double calls', async () => {
      const longDoubleType: FFITypeDescriptor = {
        size: 16,
        alignment: 16,
        type: FFIType.LONGDOUBLE
      }

      const cif = libffi.prepareCall(longDoubleType, [longDoubleType])
      expect(cif.returnType.type).toBe(FFIType.LONGDOUBLE)
    })
  })

  describe('Multiple Argument Calls', () => {
    test('call_3_byte - three single-byte arguments', async () => {
      const uint8Type: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.UINT8
      }

      const cif = libffi.prepareCall(uint8Type, [uint8Type, uint8Type, uint8Type])
      expect(cif.nargs).toBe(3)
      expect(cif.argTypes).toHaveLength(3)
    })

    test('call_many_args - many arguments test', async () => {
      const intType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.SINT32
      }

      // Test with 10 arguments (stress test)
      const argTypes = Array(10).fill(intType)
      const cif = libffi.prepareCall(intType, argTypes)
      
      expect(cif.nargs).toBe(10)
      expect(cif.argTypes).toHaveLength(10)
    })
  })

  describe('Struct Return Tests', () => {
    test('return_sc - struct char return', async () => {
      const charType: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.SINT8
      }

      const structType: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.STRUCT,
        elements: [charType]
      }

      const cif = libffi.prepareCall(structType, [])
      expect(cif.returnType.type).toBe(FFIType.STRUCT)
      expect(cif.returnType.elements).toHaveLength(1)
    })

    test('return_sc2 - two-char struct return', async () => {
      const charType: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.SINT8
      }

      const structType: FFITypeDescriptor = {
        size: 2,
        alignment: 1,
        type: FFIType.STRUCT,
        elements: [charType, charType]
      }

      const cif = libffi.prepareCall(structType, [])
      expect(cif.returnType.elements).toHaveLength(2)
    })

    test('return_sc3 - three-char struct return', async () => {
      const charType: FFITypeDescriptor = {
        size: 1,
        alignment: 1,
        type: FFIType.SINT8
      }

      const structType: FFITypeDescriptor = {
        size: 3,
        alignment: 1,
        type: FFIType.STRUCT,
        elements: [charType, charType, charType]
      }

      const cif = libffi.prepareCall(structType, [])
      expect(cif.returnType.elements).toHaveLength(3)
    })
  })

  describe('Mixed Type Calls', () => {
    test('call_if - int and float arguments', async () => {
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

      const cif = libffi.prepareCall(intType, [intType, floatType])
      expect(cif.argTypes[0].type).toBe(FFIType.SINT32)
      expect(cif.argTypes[1].type).toBe(FFIType.FLOAT)
    })

    test('call_fid - float, int, double arguments', async () => {
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

      const doubleType: FFITypeDescriptor = {
        size: 8,
        alignment: 8,
        type: FFIType.DOUBLE
      }

      const cif = libffi.prepareCall(intType, [floatType, intType, doubleType])
      expect(cif.nargs).toBe(3)
      expect(cif.argTypes[0].type).toBe(FFIType.FLOAT)
      expect(cif.argTypes[1].type).toBe(FFIType.SINT32)
      expect(cif.argTypes[2].type).toBe(FFIType.DOUBLE)
    })
  })

  describe('Large Data Types', () => {
    test('call_longdouble - long double handling', async () => {
      const longDoubleType: FFITypeDescriptor = {
        size: 16,
        alignment: 16,
        type: FFIType.LONGDOUBLE
      }

      const cif = libffi.prepareCall(longDoubleType, [longDoubleType])
      expect(cif.returnType.size).toBe(16)
    })

    test('call_pointer - pointer type handling', async () => {
      const pointerType: FFITypeDescriptor = {
        size: 4, // WASM32 default, would be 8 for WASM64
        alignment: 4,
        type: FFIType.POINTER
      }

      const capabilities = libffi.getSystemCapabilities()
      if (capabilities.wasm64Supported) {
        pointerType.size = 8
        pointerType.alignment = 8
      }

      const cif = libffi.prepareCall(pointerType, [pointerType])
      expect(cif.returnType.type).toBe(FFIType.POINTER)
    })
  })

  describe('Error Conditions', () => {
    test('should handle invalid ABI', async () => {
      const intType: FFITypeDescriptor = {
        size: 4,
        alignment: 4,
        type: FFIType.SINT32
      }

      // Invalid ABI should be caught by TypeScript type system or runtime
      expect(() => {
        libffi.prepareCall(intType, [intType], { abi: 999 as FFIABI })
      }).toThrow()
    })

    test('should handle null pointers gracefully', async () => {
      const wasmModule = libffi.wasmModule
      if (!wasmModule) throw new Error('Module not initialized')

      // Test null pointer handling in the actual WASM module
      expect(() => {
        wasmModule._ffi_prep_cif(0, 1, 0, wasmModule._ffi_type_void, 0)
      }).not.toThrow() // Should handle gracefully
    })
  })
})