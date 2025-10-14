/**
 * Libffi WASM Benchmarks
 */

import LibffiWASM from "../src/lib/index.ts"

Deno.bench("libffi initialization", {
  baseline: true
}, async () => {
  const lib = new LibffiWASM()
  await lib.initialize()
})
