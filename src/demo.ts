/**
 * libffi.wasm v3.5.2 demonstration
 * Shows WASM-native features and official libffi compatibility
 */

import LibFFI, { FFIType, FFIABI } from './lib/index.js'
import type { FFITypeDescriptor } from './lib/types.js'

async function main() {
  console.log('🚀 libffi.wasm v3.5.2 Demo')
  console.log('==========================')

  const libffi = new LibFFI({
    cdnUrl: 'https://cdn.discere.cloud/npm/@discere-os/libffi.wasm/',
    cachingEnabled: true,
    simdOptimizations: true
  })
  
  try {
    // Initialize with CDN loading
    console.log('Initializing libffi.wasm with CDN support...')
    await libffi.initialize()
    
    // Show enhanced capabilities
    const capabilities = libffi.getSystemCapabilities()
    console.log('\n📊 Enhanced System Capabilities:')
    console.log(`- WebAssembly: ${capabilities.wasmSupported ? '✅' : '❌'}`)
    console.log(`- WASM64: ${capabilities.wasm64Supported ? '✅' : '❌'}`)
    console.log(`- SIMD: ${capabilities.simdSupported ? '✅' : '❌'}`)
    console.log(`- BigInt: ${capabilities.bigintSupported ? '✅' : '❌'}`)
    console.log(`- Go Closures: ${capabilities.goClosuresSupported ? '✅' : '❌'}`)
    console.log(`- Complex Numbers: ${capabilities.complexNumbersSupported ? '✅' : '❌'}`)
    console.log(`- Raw API: ${capabilities.rawApiSupported ? '✅' : '❌'}`)
    
    // Show version info from official API
    const versionInfo = libffi.getVersionInfo()
    console.log(`\n📦 Official libffi Information:`)
    console.log(`- Version: ${versionInfo.version}`)
    console.log(`- Version Number: 0x${versionInfo.versionNumber.toString(16)}`)
    console.log(`- Default ABI: ${versionInfo.defaultAbi === FFIABI.WASM64_EMSCRIPTEN ? 'WASM64' : 'WASM32'}_EMSCRIPTEN`)
    
    // Demonstrate call interface preparation
    console.log('\n🔧 Call Interface Examples:')
    
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
    
    // Standard call interface
    const addCIF = libffi.prepareCall(intType, [intType, intType])
    console.log(`- Integer addition CIF: ${addCIF.nargs} args, ABI ${addCIF.abi}`)
    
    // Variadic call interface
    const printfCIF = libffi.prepareCall(intType, [
      { size: capabilities.wasm64Supported ? 8 : 4, alignment: capabilities.wasm64Supported ? 8 : 4, type: FFIType.POINTER }
    ], { variadic: true })
    console.log(`- Printf CIF: ${printfCIF.nfixedargs} fixed args, variadic: true`)
    
    // Complex number demonstration
    if (capabilities.complexNumbersSupported) {
      console.log('\n🔢 Complex Number Operations:')
      
      const a = { real: 3.0, imag: 4.0 }
      const b = { real: 1.0, imag: 2.0 }
      
      const result = libffi.complexMultiply(a, b, 'double')
      console.log(`- (3+4i) × (1+2i) = ${result.real}${result.imag >= 0 ? '+' : ''}${result.imag}i`)
    }
    
    // SIMD bulk operations demonstration
    if (capabilities.simdSupported) {
      console.log('\n⚡ SIMD Bulk Operations:')
      
      const bulkCifs = libffi.prepareBulkCalls(8, intType, [intType, intType])
      console.log(`- Prepared ${bulkCifs.length} CIFs with SIMD acceleration`)
      
      // Memory operation demonstration
      const wasmModule = libffi.wasmModule
      if (wasmModule) {
        const testPtr = wasmModule._malloc(64)
        libffi.clearMemoryBulk(testPtr, 64)
        console.log('- 64-byte memory cleared with SIMD')
        wasmModule._free(testPtr)
      }
    }
    
    console.log('\n✅ Demo completed successfully!')
    console.log('\n💡 WASM-Native Features:')
    console.log('- TypeScript-first API with full type safety')
    console.log('- CDN loading with fallback support')
    console.log('- Official libffi v3.5.2 compatibility')
    console.log('- WASM32/WASM64 automatic detection')
    console.log('- Performance optimizations where beneficial')
    console.log('\n🔗 Documentation: https://github.com/discere-os/libffi.wasm')
    
  } catch (error) {
    console.error('❌ Demo failed:', error)
    process.exit(1)
  } finally {
    libffi.cleanup()
  }
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export default main