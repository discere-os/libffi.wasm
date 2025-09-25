#include <emscripten.h>
#include "ffi_version.h"

EMSCRIPTEN_KEEPALIVE
const char* libffi_wasm_version(void) {
  return FFI_WASM_VERSION;
}

