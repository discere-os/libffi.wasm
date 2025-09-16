#!/bin/bash
# Enhanced WASM-native build for libffi.wasm v3.5.2
# Building on official implementation with modern toolchain integration

set -euo pipefail

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
TARGET_DIR="$PROJECT_ROOT/target" 
DIST_DIR="$PROJECT_ROOT/dist"

# Build options
BUILD_TYPE="${1:-release}"
WASM_MODE="${2:-wasm32}" # wasm32 or wasm64

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m' 
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"; }
success() { echo -e "${GREEN}[SUCCESS] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }

# Check prerequisites
check_prereqs() {
    log "Checking prerequisites..."
    command -v emcc >/dev/null || error "Emscripten not found"
    command -v autoreconf >/dev/null || error "autotools not found"
    
    local emcc_version=$(emcc --version | head -n1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
    log "Using Emscripten version: $emcc_version"
    
    if command -v mandoc >/dev/null 2>&1; then
        log "mandoc available for documentation generation"
    else
        log "mandoc not found, skipping documentation"
    fi
}

# Build official libffi with WASM support
build_libffi() {
    log "Building official libffi v3.5.2 for $WASM_MODE..."
    
    cd "$PROJECT_ROOT"
    rm -rf "$BUILD_DIR" "$TARGET_DIR"
    mkdir -p "$BUILD_DIR" "$TARGET_DIR"
    
    # Generate configure if needed
    if [[ ! -f configure ]]; then
        log "Generating configure script..."
        ./autogen.sh
    fi
    
    cd "$BUILD_DIR"
    
    # Configure for WASM target
    local host_flag="--host=${WASM_MODE}-unknown-emscripten"
    if [[ "$WASM_MODE" == "wasm64" ]]; then
        export CFLAGS="-O3 -fPIC -sWASM_BIGINT=1"
    else
        export CFLAGS="-O3 -fPIC"
    fi
    
    emconfigure "$PROJECT_ROOT/configure" \
        "$host_flag" \
        --prefix="$TARGET_DIR" \
        --enable-static \
        --disable-shared \
        --disable-docs \
        --enable-portable-binary \
        --disable-multi-os-directory
    
    # Build with make
    emmake make -j$(nproc)
    emmake make install
    
    success "Official libffi built for $WASM_MODE"
}

# Create TypeScript-compatible WASM module
build_typescript_module() {
    log "Creating TypeScript-compatible WASM module..."
    
    cd "$BUILD_DIR"
    
    # Build enhanced module with TypeScript integration
    local wasm_flags=""
    if [[ "$WASM_MODE" == "wasm64" ]]; then
        wasm_flags="-sWASM_BIGINT=1 -sWASM64=1"
    fi
    
    # Add SIMD bulk operations to official implementation
    emcc "$TARGET_DIR/lib/libffi.a" "$PROJECT_ROOT/src/wasm/simd-bulk.c" \
        -I"$TARGET_DIR/include" \
        -I"$PROJECT_ROOT/include" \
        -o "$TARGET_DIR/libffi.js" \
        -sEXPORTED_FUNCTIONS='["_ffi_prep_cif","_ffi_call","_ffi_prep_cif_var","_ffi_raw_call","_ffi_ptrarray_to_raw","_ffi_raw_to_ptrarray","_ffi_raw_size","_ffi_closure_alloc","_ffi_closure_free","_ffi_prep_closure_loc","_ffi_prep_go_closure","_ffi_call_go","_ffi_get_version","_ffi_get_version_number","_ffi_get_default_abi","_ffi_get_closure_size","_ffi_prep_bulk_cifs_simd","_ffi_memclear_simd","_ffi_bulk_copy_simd","_malloc","_free"]' \
        -sEXPORTED_RUNTIME_METHODS='["ccall","cwrap","addFunction","removeFunction","UTF8ToString","stringToUTF8","HEAPU8","HEAP8","HEAPU16","HEAP16","HEAPU32","HEAP32","HEAPF32","HEAPF64","HEAPU64","bigintToI53Checked","wasmTable"]' \
        -sMODULARIZE=1 \
        -sEXPORT_NAME="LibFFIModule" \
        -sALLOW_MEMORY_GROWTH=1 \
        -sEXPORT_ES6=1 \
        -msimd128 \
        -flto \
        --closure=1 \
        $wasm_flags \
        -O3
        
    success "TypeScript-compatible module built"
}

# Generate documentation
generate_docs() {
    if command -v mandoc >/dev/null 2>&1; then
        log "Converting man pages to markdown..."
        mkdir -p "$DIST_DIR/docs"
        
        for man_file in "$PROJECT_ROOT/man"/*.3; do
            if [[ -f "$man_file" ]]; then
                base_name=$(basename "$man_file" .3)
                mandoc -T markdown "$man_file" > "$DIST_DIR/docs/${base_name}.md"
                log "Converted $base_name.3 to markdown"
            fi
        done
        
        success "Documentation generated in $DIST_DIR/docs/"
    fi
}

# Setup distribution
setup_distribution() {
    log "Setting up NPM distribution..."
    
    mkdir -p "$DIST_DIR/wasm"
    cp "$TARGET_DIR/libffi.js" "$DIST_DIR/wasm/"
    cp "$TARGET_DIR/libffi.wasm" "$DIST_DIR/wasm/"
    cp -r "$TARGET_DIR/include" "$DIST_DIR/"
    cp -r "$TARGET_DIR/lib" "$DIST_DIR/"
    
    # Create CDN-ready bundle info
    cat > "$DIST_DIR/wasm/info.json" << EOF
{
  "name": "@discere-os/libffi.wasm",
  "version": "3.5.2",
  "wasmMode": "$WASM_MODE",
  "buildDate": "$(date -Iseconds)",
  "features": {
    "wasm64": $([ "$WASM_MODE" = "wasm64" ] && echo "true" || echo "false"),
    "simd": true,
    "bigint": $([ "$WASM_MODE" = "wasm64" ] && echo "true" || echo "false"),
    "goClosures": true,
    "complexNumbers": true,
    "rawApi": true
  },
  "cdn": {
    "primary": "https://cdn.discere.cloud/npm/@discere-os/libffi.wasm/",
    "integrity": "$(sha384sum $TARGET_DIR/libffi.wasm | cut -d' ' -f1)"
  }
}
EOF
    
    success "Distribution setup complete"
}

# Main execution
main() {
    log "Starting enhanced libffi.wasm v3.5.2 build..."
    check_prereqs
    build_libffi
    build_typescript_module
    generate_docs
    setup_distribution
    
    success "Enhanced libffi.wasm build complete!"
    echo
    echo "Build outputs:"
    echo "  WASM Module: $TARGET_DIR/libffi.wasm"
    echo "  JS Wrapper: $TARGET_DIR/libffi.js" 
    echo "  TypeScript: dist/lib/"
    echo "  Documentation: dist/docs/"
    echo "  CDN Bundle: dist/wasm/"
    echo
    echo "Usage:"
    echo "  import LibFFI from '@discere-os/libffi.wasm'"
    echo "  const ffi = new LibFFI({ cdnUrl: 'https://cdn.discere.cloud/...' })"
}

main "$@"