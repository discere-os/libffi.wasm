/*
 * SIMD Bulk Operations for libffi.wasm v3.5.2
 * Copyright © 2025 Superstruct Ltd, New Zealand
 * Licensed under MIT License
 *
 * SIMD enhancements for the official libffi WASM implementation
 * Provides performance optimizations for bulk operations
 */

#include <ffi.h>
#include <emscripten/emscripten.h>
#include <string.h>
#include <stddef.h>

#ifdef __wasm_simd128__
#include <wasm_simd128.h>

/* SIMD-accelerated bulk CIF preparation */
EMSCRIPTEN_KEEPALIVE
int ffi_prep_bulk_cifs_simd(ffi_cif *cifs, unsigned int count, 
                            ffi_abi abi, ffi_type *rtype, 
                            ffi_type **atypes, unsigned int nargs) {
    if (count < 4) {
        // Use standard prep_cif for small batches
        for (unsigned int i = 0; i < count; i++) {
            if (ffi_prep_cif(&cifs[i], abi, nargs, rtype, atypes) != FFI_OK) {
                return 0;
            }
        }
        return 1;
    }
    
    // SIMD-accelerated initialization for bulk operations
    // Clear all CIF structures at once using SIMD
    const size_t cif_size = sizeof(ffi_cif);
    const size_t total_size = count * cif_size;
    
    if (total_size >= 16) {
        uint8_t *buf = (uint8_t*)cifs;
        v128_t zero = wasm_i8x16_splat(0);
        
        size_t simd_count = total_size / 16;
        for (size_t i = 0; i < simd_count; i++) {
            wasm_v128_store(buf + i * 16, zero);
        }
        
        // Handle remaining bytes
        size_t remaining = total_size % 16;
        if (remaining > 0) {
            memset(buf + simd_count * 16, 0, remaining);
        }
    } else {
        memset(cifs, 0, total_size);
    }
    
    // Set common fields for all CIFs
    for (unsigned int i = 0; i < count; i++) {
        cifs[i].abi = abi;
        cifs[i].nargs = nargs;
        cifs[i].arg_types = atypes;
        cifs[i].rtype = rtype;
        cifs[i].nfixedargs = nargs;
        
        // Calculate bytes
        size_t bytes = 0;
        for (unsigned int j = 0; j < nargs; j++) {
            bytes += atypes[j]->size;
        }
        cifs[i].bytes = bytes;
        cifs[i].flags = 0; // Will be set by official ffi_prep_cif if needed
    }
    
    return 1;
}

/* SIMD-accelerated memory operations for large buffers */
EMSCRIPTEN_KEEPALIVE
void ffi_memclear_simd(void *ptr, size_t size) {
    if (size < 16) {
        memset(ptr, 0, size);
        return;
    }
    
    uint8_t *buf = (uint8_t*)ptr;
    v128_t zero = wasm_i8x16_splat(0);
    
    size_t simd_count = size / 16;
    for (size_t i = 0; i < simd_count; i++) {
        wasm_v128_store(buf + i * 16, zero);
    }
    
    size_t remaining = size % 16;
    if (remaining > 0) {
        memset(buf + simd_count * 16, 0, remaining);
    }
}

/* SIMD-accelerated bulk argument copying */  
EMSCRIPTEN_KEEPALIVE
void ffi_bulk_copy_simd(void *dest, const void *src, size_t size) {
    if (size < 32) {
        memcpy(dest, src, size);
        return;
    }
    
    const uint8_t *source = (const uint8_t*)src;
    uint8_t *destination = (uint8_t*)dest;
    
    size_t simd_count = size / 16;
    for (size_t i = 0; i < simd_count; i++) {
        v128_t chunk = wasm_v128_load(source + i * 16);
        wasm_v128_store(destination + i * 16, chunk);
    }
    
    size_t remaining = size % 16;
    if (remaining > 0) {
        memcpy(destination + simd_count * 16, source + simd_count * 16, remaining);
    }
}

#else

// Fallback implementations without SIMD
EMSCRIPTEN_KEEPALIVE
int ffi_prep_bulk_cifs_simd(ffi_cif *cifs, unsigned int count,
                            ffi_abi abi, ffi_type *rtype,
                            ffi_type **atypes, unsigned int nargs) {
    for (unsigned int i = 0; i < count; i++) {
        if (ffi_prep_cif(&cifs[i], abi, nargs, rtype, atypes) != FFI_OK) {
            return 0;
        }
    }
    return 1;
}

EMSCRIPTEN_KEEPALIVE
void ffi_memclear_simd(void *ptr, size_t size) {
    memset(ptr, 0, size);
}

EMSCRIPTEN_KEEPALIVE
void ffi_bulk_copy_simd(void *dest, const void *src, size_t size) {
    memcpy(dest, src, size);
}

#endif