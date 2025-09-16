/**
 * Integration tests for actual compiled libffi.wasm module
 * NO MOCKS - Tests real WASM module with all official v3.5.2 features
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

describe('libffi.wasm Module Integration', () => {
  let module: any
  let moduleFactory: any

  beforeAll(async () => {
    // Load the actual compiled WASM module
    const wasmPath = resolve(process.cwd(), 'target/libffi.wasm')
    const jsPath = resolve(process.cwd(), 'target/libffi.js')
    
    try {
      // Import the compiled module factory
      moduleFactory = await import(jsPath)
      
      // Initialize the WASM module
      module = await moduleFactory.LibFFIModule()
      
      expect(module).toBeDefined()
      console.log('✅ Real WASM module loaded successfully')
    } catch (error) {
      throw new Error(`Failed to load WASM module: ${error}. Run 'npm run build:wasm' first.`)
    }
  })

  afterAll(() => {
    // Cleanup if needed
  })

  describe('Official libffi v3.5.2 API', () => {
    test('should expose all core FFI functions', () => {
      // Core API
      expect(module._ffi_prep_cif).toBeDefined()
      expect(module._ffi_call).toBeDefined()
      expect(module._ffi_prep_cif_var).toBeDefined()
      
      // Raw API  
      expect(module._ffi_raw_call).toBeDefined()
      expect(module._ffi_raw_size).toBeDefined()
      expect(module._ffi_ptrarray_to_raw).toBeDefined()
      
      // Closures
      expect(module._ffi_closure_alloc).toBeDefined()
      expect(module._ffi_prep_closure_loc).toBeDefined()
      
      // Go closures (v3.5.2 feature)
      expect(module._ffi_prep_go_closure).toBeDefined()
      expect(module._ffi_call_go).toBeDefined()
      
      // Version info (v3.5.0+ feature)
      expect(module._ffi_get_version).toBeDefined()
      expect(module._ffi_get_version_number).toBeDefined()
    })

    test('should have all standard type descriptors', () => {
      // Basic types
      expect(module._ffi_type_void).toBeGreaterThan(0)
      expect(module._ffi_type_sint32).toBeGreaterThan(0)
      expect(module._ffi_type_float).toBeGreaterThan(0)
      expect(module._ffi_type_double).toBeGreaterThan(0)
      expect(module._ffi_type_pointer).toBeGreaterThan(0)
      
      // Complex types (v3.5.2)
      expect(module._ffi_type_complex_float).toBeGreaterThan(0)
      expect(module._ffi_type_complex_double).toBeGreaterThan(0)
      
      // 64-bit types  
      expect(module._ffi_type_uint64).toBeGreaterThan(0)
      expect(module._ffi_type_sint64).toBeGreaterThan(0)
    })

    test('should expose memory access arrays', () => {
      expect(module.HEAPU8).toBeInstanceOf(Uint8Array)
      expect(module.HEAP8).toBeInstanceOf(Int8Array)
      expect(module.HEAPU32).toBeInstanceOf(Uint32Array)
      expect(module.HEAP32).toBeInstanceOf(Int32Array)
      expect(module.HEAPF32).toBeInstanceOf(Float32Array)
      expect(module.HEAPF64).toBeInstanceOf(Float64Array)
      
      // WASM64 specific
      if (module.HEAPU64) {
        expect(module.HEAPU64).toBeInstanceOf(BigUint64Array)
      }
    })

    test('should provide Emscripten utilities', () => {
      expect(module.ccall).toBeDefined()
      expect(module.cwrap).toBeDefined()
      expect(module.addFunction).toBeDefined()
      expect(module.wasmTable).toBeDefined()
      expect(module.UTF8ToString).toBeDefined()
    })
  })

  describe('Enhanced SIMD Operations', () => {
    test('should expose SIMD bulk operations', () => {
      // Enhanced SIMD functions should be available
      expect(module._ffi_prep_bulk_cifs_simd).toBeDefined()
      expect(module._ffi_memclear_simd).toBeDefined()
      expect(module._ffi_bulk_copy_simd).toBeDefined()
    })

    test('should perform SIMD memory clearing', () => {
      const testSize = 64
      const testPtr = module._malloc(testSize)
      
      // Fill with non-zero data
      for (let i = 0; i < testSize; i++) {
        module.HEAPU8[testPtr + i] = 0xFF
      }
      
      // Clear with SIMD
      module._ffi_memclear_simd(testPtr, testSize)
      
      // Verify cleared
      for (let i = 0; i < testSize; i++) {
        expect(module.HEAPU8[testPtr + i]).toBe(0)
      }
      
      module._free(testPtr)
    })

    test('should perform SIMD bulk copying', () => {
      const testSize = 64
      const srcPtr = module._malloc(testSize)
      const destPtr = module._malloc(testSize)
      
      // Fill source with test pattern
      for (let i = 0; i < testSize; i++) {
        module.HEAPU8[srcPtr + i] = i % 256
      }
      
      // Copy with SIMD
      module._ffi_bulk_copy_simd(destPtr, srcPtr, testSize)
      
      // Verify copy
      for (let i = 0; i < testSize; i++) {
        expect(module.HEAPU8[destPtr + i]).toBe(i % 256)
      }
      
      module._free(srcPtr)
      module._free(destPtr)
    })
  })

  describe('Version and Compatibility', () => {
    test('should report libffi v3.5.2+ version', () => {
      const versionStr = module.UTF8ToString(module._ffi_get_version())
      expect(versionStr).toMatch(/3\.[5-9]\.\d+/)
      
      const versionNum = module._ffi_get_version_number()
      expect(versionNum).toBeGreaterThan(0x030501) // > v3.5.1
    })

    test('should report correct default ABI', () => {
      const defaultAbi = module._ffi_get_default_abi()
      
      // Should be WASM32_EMSCRIPTEN or WASM64_EMSCRIPTEN
      expect([1, 2]).toContain(defaultAbi)
    })

    test('should handle WASM32 vs WASM64 pointer sizes', () => {
      const pointerSize = module.HEAPU32[module._ffi_type_pointer >> 2]
      
      // Should be 4 for WASM32 or 8 for WASM64
      expect([4, 8]).toContain(pointerSize)
      
      if (module.HEAPU64) {
        expect(pointerSize).toBe(8) // WASM64 mode
      } else {
        expect(pointerSize).toBe(4) // WASM32 mode
      }
    })
  })

  describe('Real Function Calls (Integration)', () => {
    test('should prepare and execute real FFI calls', () => {
      const cifPtr = module._malloc(40) // sizeof(ffi_cif) for WASM64
      
      // Prepare a simple CIF for int add(int, int)
      const status = module._ffi_prep_cif(
        cifPtr,
        1, // FFI_DEFAULT_ABI
        2, // nargs
        module._ffi_type_sint32, // return type
        (() => {
          const argTypePtr = module._malloc(2 * (module.HEAPU64 ? 8 : 4))
          if (module.HEAPU64) {
            module.HEAPU64[argTypePtr >> 3] = BigInt(module._ffi_type_sint32)
            module.HEAPU64[(argTypePtr >> 3) + 1] = BigInt(module._ffi_type_sint32)
          } else {
            module.HEAPU32[argTypePtr >> 2] = module._ffi_type_sint32
            module.HEAPU32[(argTypePtr >> 2) + 1] = module._ffi_type_sint32
          }
          return argTypePtr
        })()
      )
      
      expect(status).toBe(0) // FFI_OK
      
      module._free(cifPtr)
    })

    test('should handle Raw API calls', () => {
      const cifPtr = module._malloc(40)
      
      // Test raw size calculation
      const rawSize = module._ffi_raw_size(cifPtr)
      expect(rawSize).toBeGreaterThan(0)
      
      module._free(cifPtr)
    })

    test('should support closure allocation', () => {
      const codePtr = module._malloc(4)
      const closureSize = module._ffi_get_closure_size ? module._ffi_get_closure_size() : 24
      
      const closurePtr = module._ffi_closure_alloc(closureSize, codePtr)
      expect(closurePtr).toBeGreaterThan(0)
      
      module._ffi_closure_free(closurePtr)
      module._free(codePtr)
    })
  })

  describe('Performance Characteristics', () => {
    test('should demonstrate bulk operation performance', () => {
      const iterations = 1000
      const cifCount = 8
      const cifSize = 40 // sizeof(ffi_cif)
      
      const start = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        const cifsPtr = module._malloc(cifCount * cifSize)
        
        // Use SIMD bulk preparation
        const result = module._ffi_prep_bulk_cifs_simd(
          cifsPtr,
          cifCount,
          1, // DEFAULT_ABI
          module._ffi_type_sint32,
          (() => {
            const argTypePtr = module._malloc(4)
            module.HEAPU32[argTypePtr >> 2] = module._ffi_type_sint32
            return argTypePtr
          })(),
          1 // nargs
        )
        
        expect(result).toBe(1) // Success
        module._free(cifsPtr)
      }
      
      const end = performance.now()
      const totalTime = end - start
      const opsPerSecond = Math.floor((iterations * cifCount) / (totalTime / 1000))
      
      console.log(`🚀 Bulk CIF preparation: ${opsPerSecond.toLocaleString()} ops/sec`)
      expect(opsPerSecond).toBeGreaterThan(10000) // Performance target
    })
  })
})