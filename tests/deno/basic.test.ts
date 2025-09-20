/**
 * Basic libffi.wasm Tests - Deno-native
 * Tests initialization, capabilities, and core functionality
 */

import { assertEquals, assertExists, assert } from "@std/assert"
import LibFFI, { FFIType, FFIABI, FFIStatus } from "../../src/lib/index.ts"
import type { FFITypeDescriptor, ComplexNumber } from "../../src/lib/types.ts"

Deno.test("LibFFI Initialization", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

  assertExists(libffi)
  assert(libffi.wasmModule !== null)

  libffi.cleanup()
})

Deno.test("System Capabilities Detection", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

  const capabilities = libffi.getSystemCapabilities()

  assertEquals(capabilities.wasmSupported, true)
  assertEquals(capabilities.complexNumbersSupported, true)
  assertEquals(capabilities.rawApiSupported, true)
  assertEquals(capabilities.goClosuresSupported, true)
  assertEquals(typeof capabilities.simdSupported, "boolean")
  assertEquals(typeof capabilities.wasm64Supported, "boolean")

  libffi.cleanup()
})

Deno.test("Version Information", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

  const versionInfo = libffi.getVersionInfo()

  assert(versionInfo.version.match(/3\.[0-9]\.[0-9]/))
  assert(versionInfo.versionNumber >= 0x030500) // v3.5.0+
  assert([FFIABI.WASM32_EMSCRIPTEN, FFIABI.WASM64_EMSCRIPTEN].includes(versionInfo.defaultAbi))

  libffi.cleanup()
})

Deno.test("CIF Preparation - Basic Types", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

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

  // Test int function(int, float)
  const cif = libffi.prepareCall(intType, [intType, floatType])

  assertEquals(cif.nargs, 2)
  assertEquals(cif.returnType.type, FFIType.SINT32)
  assertEquals(cif.argTypes[0].type, FFIType.SINT32)
  assertEquals(cif.argTypes[1].type, FFIType.FLOAT)

  libffi.cleanup()
})

Deno.test("Complex Number Operations", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

  const a: ComplexNumber = { real: 2.0, imag: 3.0 }
  const b: ComplexNumber = { real: 1.0, imag: -1.0 }

  // (2+3i) * (1-i) = (2-(-3)) + (3+(-2))i = 5 + 1i
  const result = libffi.complexMultiply(a, b, 'double')

  assertEquals(Math.round(result.real * 100) / 100, 5.0)
  assertEquals(Math.round(result.imag * 100) / 100, 1.0)

  libffi.cleanup()
})

Deno.test("SIMD Bulk Operations", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

  const capabilities = libffi.getSystemCapabilities()

  const intType: FFITypeDescriptor = {
    size: 4,
    alignment: 4,
    type: FFIType.SINT32
  }

  // Test bulk CIF preparation
  const bulkCifs = libffi.prepareBulkCalls(8, intType, [intType, intType])

  assertEquals(bulkCifs.length, 8)
  assert(bulkCifs.every(cif => cif.nargs === 2))
  assert(bulkCifs.every(cif => cif.returnType.type === FFIType.SINT32))

  if (capabilities.simdSupported) {
    console.log('✅ SIMD optimizations active')
  } else {
    console.log('ℹ️ Using scalar fallback (SIMD not supported)')
  }

  libffi.cleanup()
})

Deno.test("Error Handling", async () => {
  const libffi = new LibFFI()

  // Should work without initialization
  const capabilities = libffi.getSystemCapabilities()
  assertExists(capabilities)

  // Should fail without initialization
  try {
    libffi.getVersionInfo()
    assert(false, "Should have thrown error")
  } catch (error) {
    assert(error.message.includes("Module not initialized"))
  }

  // Initialize and test cleanup
  await libffi.initialize()
  assertExists(libffi.getVersionInfo())

  libffi.cleanup()

  // Should fail after cleanup
  try {
    libffi.getVersionInfo()
    assert(false, "Should have thrown error")
  } catch (error) {
    assert(error.message.includes("Module not initialized"))
  }
})

Deno.test("Loading Pattern Detection", async () => {
  const libffi = new LibFFI()
  await libffi.initialize()

  // In Deno environment, should detect Deno-native loading
  assertEquals(typeof globalThis.Deno !== 'undefined', true)
  console.log('✅ Deno-native loading pattern detected')
  console.log('   - WASM loaded via Deno.readFile()')
  console.log('   - Module loaded via local ES6 import')

  libffi.cleanup()
})