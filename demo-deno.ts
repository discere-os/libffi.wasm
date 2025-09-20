/**
 * libffi.wasm Demo - Deno-native demonstration
 * Shows both local development and CDN runtime loading patterns
 */

import LibFFI, { FFIType, FFIABI } from './src/lib/index.ts'

async function main() {
  console.log('🚀 libffi.wasm v3.5.2 Demo')
  console.log('==========================')

  // Initialize with automatic loading detection
  const libffi = new LibFFI({
    // CDN URLs for web runtime (not used in Deno)
    cdnUrl: 'https://wasm.discere.cloud/libffi@latest/',
    simdOptimizations: true,
    cachingEnabled: true
  })

  try {
    console.log('\n📦 Initializing libffi...')
    await libffi.initialize()
    console.log('✅ libffi initialized successfully')

    // Show system capabilities
    console.log('\n🔍 System Capabilities:')
    const capabilities = libffi.getSystemCapabilities()
    console.log(`  WASM Support: ${capabilities.wasmSupported}`)
    console.log(`  SIMD Support: ${capabilities.simdSupported}`)
    console.log(`  Complex Numbers: ${capabilities.complexNumbersSupported}`)
    console.log(`  Raw API: ${capabilities.rawApiSupported}`)
    console.log(`  Go Closures: ${capabilities.goClosuresSupported}`)
    console.log(`  WASM64 Support: ${capabilities.wasm64Supported}`)

    // Show version information
    console.log('\n📋 Version Information:')
    const versionInfo = libffi.getVersionInfo()
    console.log(`  Version: ${versionInfo.version}`)
    console.log(`  Version Number: 0x${versionInfo.versionNumber.toString(16)}`)
    console.log(`  Default ABI: ${versionInfo.defaultAbi === FFIABI.WASM32_EMSCRIPTEN ? 'WASM32' : 'WASM64'}`)

    // Demonstrate CIF preparation
    console.log('\n⚙️ Function Call Interface Preparation:')

    // Simple int add(int a, int b) function signature
    const intType = {
      size: 4,
      alignment: 4,
      type: FFIType.SINT32
    }

    const cif = libffi.prepareCall(intType, [intType, intType])
    console.log(`  CIF prepared for int add(int, int)`)
    console.log(`  ABI: ${cif.abi}`)
    console.log(`  Args: ${cif.nargs}`)
    console.log(`  Return type: ${cif.returnType.type} (size: ${cif.returnType.size})`)

    // Demonstrate complex number operations
    console.log('\n🔢 Complex Number Operations:')
    const a = { real: 3.0, imag: 4.0 }
    const b = { real: 1.0, imag: 2.0 }

    const result = libffi.complexMultiply(a, b, 'double')
    console.log(`  (3+4i) × (1+2i) = ${result.real}${result.imag >= 0 ? '+' : ''}${result.imag}i`)

    // Demonstrate SIMD memory operations
    console.log('\n🚀 SIMD Memory Operations:')
    if (capabilities.simdSupported) {
      console.log('  SIMD bulk operations available')

      // Demonstrate bulk CIF preparation
      const bulkCifs = libffi.prepareBulkCalls(8, intType, [intType, intType])
      console.log(`  Prepared ${bulkCifs.length} CIFs using SIMD optimization`)
    } else {
      console.log('  SIMD not supported, using scalar fallback')
    }

    // Show loading pattern used
    console.log('\n🔧 Loading Information:')
    if (typeof globalThis.Deno !== 'undefined') {
      console.log('  Environment: Deno (development)')
      console.log('  Loading: Local WASM files via Deno.readFile()')
      console.log('  Module: ES6 import from local build')
    } else {
      console.log('  Environment: Browser (production)')
      console.log('  Loading: CDN fetch() for WASM binary')
      console.log('  Module: ES6 import from CDN')
    }

    console.log('\n✨ Demo completed successfully!')

  } catch (error) {
    console.error('❌ Demo failed:', error)
    process.exit(1)
  } finally {
    libffi.cleanup()
    console.log('\n🧹 Cleanup completed')
  }
}

// Run the demo
if (import.meta.main) {
  await main()
}