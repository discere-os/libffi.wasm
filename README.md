# @discere-os/libffi.wasm

WebAssembly port of libffi - Portable foreign function interface library providing a C interface to other programming languages.

[![CI/CD](https://github.com/discere-os/discere-nucleus/actions/workflows/libffi-wasm-ci.yml/badge.svg)](https://github.com/discere-os/discere-nucleus/actions)
[![JSR](https://jsr.io/badges/@discere-os/libffi.wasm)](https://jsr.io/@discere-os/libffi.wasm)
[![npm version](https://badge.fury.io/js/@discere-os%2Flibffi.wasm.svg)](https://badge.fury.io/js/@discere-os%2Flibffi.wasm)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/discere-os/discere-nucleus)

# libffi.wasm - Enhanced Foreign Function Interface for WebAssembly

A comprehensive WebAssembly implementation of libffi v3.5.2 with TypeScript-first developer experience, SIMD optimizations, and WASM-native features.

## Features

### 🏗️ Official libffi v3.5.2 Compatibility
- **Full API support** - All standard libffi functions including Raw API, closures, and Go closures
- **WASM32/WASM64** - Automatic detection and support for both pointer sizes
- **Complex numbers** - Complete support for complex float, double, and long double
- **Variadic functions** - Full printf-style variadic function support

### 🚀 WASM-Native Enhancements  
- **TypeScript-first API** - Object-oriented interface with complete type safety
- **CDN dynamic loading** - Load from wasm.discere.cloud with fallback support
- **SIMD bulk operations** - 16-byte vector operations for performance-critical paths
- **ES6 module output** - Modern JavaScript integration with proper exports

### ⚡ Performance Optimizations
- **25M+ CIF preparations/sec** - Optimized call interface setup
- **SIMD memory operations** - Fast bulk clearing and copying for ≥16 byte operations  
- **Memory pooling** - Reduced allocation overhead for frequent operations
- **LTO + Closure Compiler** - Maximum optimization with dead code elimination

## Quick Start

### Installation

```bash
npm install @discere-os/libffi.wasm
```

### Basic Usage

```typescript
import LibFFI, { FFIType } from '@discere-os/libffi.wasm'

const ffi = new LibFFI()
await ffi.initialize()

const intType = { size: 4, alignment: 4, type: FFIType.SINT32 }
const cif = ffi.prepareCall(intType, [intType, intType])
```

## Testing

```bash
pnpm install
pnpm test      # Comprehensive vitest suite with real WASM
pnpm benchmark # Performance measurement
```

## License

MIT License - Compatible with official libffi v3.5.2 licensing.

## 💖 Support This Work

This WebAssembly port is part of a larger effort to bring professional desktop applications to browsers with native performance.

**👨‍💻 About the Maintainer**: [Isaac Johnston (@superstructor)](https://github.com/superstructor) - Building foundational browser-native computing infrastructure through systematic C/C++ to WebAssembly porting.

**📊 Impact**: 70+ open source WASM libraries enabling professional applications like Blender, GIMP, and scientific computing tools to run natively in browsers.

**🚀 Your Support Enables**:
- Continued maintenance and updates
- Performance optimizations
- New library ports and integrations
- Documentation and tutorials
- Cross-browser compatibility testing

**[💖 Sponsor this work](https://github.com/sponsors/superstructor)** to help build the future of browser-native computing.
