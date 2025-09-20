/**
 * libffi.wasm Performance Benchmarks - Deno-native
 * Tests SIMD optimizations and core performance
 */

import LibFFI, { FFIType } from "../src/lib/index.ts"
import type { FFITypeDescriptor, ComplexNumber } from "../src/lib/types.ts"

let libffi: LibFFI

// Setup before benchmarks
await (async () => {
  libffi = new LibFFI({
    simdOptimizations: true,
    cachingEnabled: true
  })
  await libffi.initialize()
})()

const intType: FFITypeDescriptor = {
  size: 4,
  alignment: 4,
  type: FFIType.SINT32
}

// Benchmark CIF preparation throughput
Deno.bench("CIF Preparation - Single", () => {
  libffi.prepareCall(intType, [intType, intType])
})

Deno.bench("CIF Preparation - Bulk (x100)", () => {
  libffi.prepareBulkCalls(100, intType, [intType, intType])
})

// Benchmark complex number operations
Deno.bench("Complex Number Multiplication - Float", () => {
  const a: ComplexNumber = { real: 1.5, imag: 2.5 }
  const b: ComplexNumber = { real: 3.0, imag: -1.0 }
  libffi.complexMultiply(a, b, 'float')
})

Deno.bench("Complex Number Multiplication - Double", () => {
  const a: ComplexNumber = { real: 1.5, imag: 2.5 }
  const b: ComplexNumber = { real: 3.0, imag: -1.0 }
  libffi.complexMultiply(a, b, 'double')
})

// Benchmark memory operations
Deno.bench("SIMD Memory Clear - 1KB", () => {
  const size = 1024
  const ptr = libffi.wasmModule!._malloc(size)
  try {
    libffi.clearMemoryBulk(ptr, size)
  } finally {
    libffi.wasmModule!._free(ptr)
  }
})

Deno.bench("SIMD Memory Clear - 64KB", () => {
  const size = 65536
  const ptr = libffi.wasmModule!._malloc(size)
  try {
    libffi.clearMemoryBulk(ptr, size)
  } finally {
    libffi.wasmModule!._free(ptr)
  }
})

// System capability checks
Deno.bench("System Capabilities Check", () => {
  libffi.getSystemCapabilities()
})

Deno.bench("Version Information Query", () => {
  libffi.getVersionInfo()
})

// Cleanup after benchmarks
globalThis.addEventListener("unload", () => {
  libffi?.cleanup()
})