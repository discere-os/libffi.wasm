project('libffi.wasm', 'c', version: '3.4.6', meson_version: '>=1.3.0')

simd = get_option('simd')
cargs = []
if simd
  cargs += ['-msimd128']
endif

executable('libffi-main',
  files('wasm/libffi_wasm_module.c'),
  c_args: cargs,
  link_args: [
    '-sWASM=1','-sMODULARIZE=1','-sEXPORT_ES6=1','-sEXPORT_NAME=LibffiModule',
    '-sALLOW_MEMORY_GROWTH=1','-sNO_FILESYSTEM=1','-sEXPORTED_RUNTIME_METHODS=["cwrap","ccall","UTF8ToString"]','-O3','-flto'
  ],
  install: true,
  install_dir: get_option('bindir')
)

shared_module('libffi-side',
  files('wasm/libffi_wasm_side.c'),
  name_prefix: '',
  c_args: cargs,
  link_args: ['-sSIDE_MODULE=2','-fPIC','-O3','-flto','-sEXPORTED_FUNCTIONS=["_libffi_wasm_version"]'],
  install: true,
  install_dir: get_option('libdir')
)

# Static library for linking by dependent libraries
libffi = static_library('ffi',
  files('wasm/libffi_wasm_module.c'),
  c_args: cargs,
  install: true,
  install_dir: get_option('libdir')
)

# Generate and install pkg-config file for glib dependency
pkg = import('pkgconfig')
pkg.generate(
  name: 'libffi',
  description: 'Foreign Function Interface library',
  version: meson.project_version(),
  libraries: '-lffi'
)

