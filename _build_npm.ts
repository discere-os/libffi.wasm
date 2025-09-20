/**
 * NPM Package Builder for libffi.wasm
 * Creates NPM-compatible package from Deno-first source
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts"

await emptyDir("./npm")

await build({
  entryPoints: ["./src/lib/index.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
    webAssembly: true,
  },
  package: {
    name: "@discere-os/libffi.wasm",
    version: "3.5.2",
    description: "High-performance libffi foreign function interface library with WebAssembly and TypeScript-first API",
    keywords: ["ffi", "wasm", "webassembly", "foreign-function-interface", "libffi", "c-interop"],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/discere-os/discere-nucleus.git",
      directory: "client/emscripten/libffi.wasm"
    },
    bugs: {
      url: "https://github.com/discere-os/discere-nucleus/issues"
    },
    homepage: "https://github.com/discere-os/discere-nucleus/tree/main/client/emscripten/libffi.wasm",
    author: {
      name: "Discere OS Contributors",
      url: "https://github.com/discere-os"
    },
    main: "./esm/lib/index.js",
    module: "./esm/lib/index.js",
    types: "./esm/lib/index.d.ts",
    exports: {
      ".": {
        "import": "./esm/lib/index.js",
        "types": "./esm/lib/index.d.ts"
      },
      "./types": {
        "import": "./esm/lib/types.js",
        "types": "./esm/lib/types.d.ts"
      }
    },
    files: [
      "esm/",
      "script/",
      "README.md",
      "LICENSE"
    ],
    scripts: {
      "test": "node script/test.js",
      "bench": "node script/bench.js"
    },
    engines: {
      "node": ">=18.0.0"
    },
    browser: {
      "./esm/lib/index.js": "./esm/lib/index.js"
    }
  },
  postBuild() {
    // Copy WASM files and assets to NPM package
    Deno.copyFileSync("install/wasm/libffi-main.js", "npm/esm/libffi-main.js")
    Deno.copyFileSync("install/wasm/libffi-main.wasm", "npm/esm/libffi-main.wasm")
    Deno.copyFileSync("install/wasm/libffi-side.wasm", "npm/esm/libffi-side.wasm")
    Deno.copyFileSync("install/wasm/type-info.json", "npm/esm/type-info.json")
    Deno.copyFileSync("LICENSE", "npm/LICENSE")
    Deno.copyFileSync("README.md", "npm/README.md")

    // Create package info for CDN distribution
    const packageInfo = {
      name: "@discere-os/libffi.wasm",
      version: "3.5.2",
      description: "High-performance libffi with WASM and TypeScript support",
      main: "./esm/lib/index.js",
      types: "./esm/lib/index.d.ts",
      files: {
        "main": "./esm/libffi-main.js",
        "wasm": "./esm/libffi-main.wasm",
        "side": "./esm/libffi-side.wasm",
        "types": "./esm/type-info.json"
      },
      cdn: {
        primary: "https://wasm.discere.cloud/libffi@3.5.2/",
        fallback: [
          "https://cdn.jsdelivr.net/npm/@discere-os/libffi.wasm@3.5.2/esm/",
          "https://unpkg.com/@discere-os/libffi.wasm@3.5.2/esm/"
        ]
      },
      features: {
        simd: true,
        complexNumbers: true,
        rawApi: true,
        goClosures: true,
        wasm32: true,
        wasm64: false
      },
      buildDate: new Date().toISOString()
    }

    Deno.writeTextFileSync("npm/package-info.json", JSON.stringify(packageInfo, null, 2))

    console.log("✅ NPM package built successfully")
    console.log("   - ES modules in npm/esm/")
    console.log("   - WASM binaries included")
    console.log("   - Ready for CDN deployment")
  },
})

console.log("\n🎉 Build complete! Ready to publish:")
console.log("   cd npm && npm publish")