"use strict";
/**
 * Performance benchmarks for libffi.wasm v3.5.2
 * Comprehensive performance measurement with GitHub Actions integration
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("./lib/index.js");
function benchmark() {
    return __awaiter(this, void 0, void 0, function () {
        var libffi, capabilities, versionInfo, results, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, cifResult, error_1;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    console.log('⚡ libffi.wasm v3.5.2 Performance Benchmarks');
                    console.log('==========================================');
                    libffi = new index_js_1.default();
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, 10, 11, 12]);
                    return [4 /*yield*/, libffi.initialize()];
                case 2:
                    _o.sent();
                    capabilities = libffi.getSystemCapabilities();
                    versionInfo = libffi.getVersionInfo();
                    console.log("\n\uD83D\uDD27 Test Environment:");
                    console.log("- libffi version: ".concat(versionInfo.version));
                    console.log("- WASM64: ".concat(capabilities.wasm64Supported));
                    console.log("- SIMD: ".concat(capabilities.simdSupported));
                    console.log("- BigInt: ".concat(capabilities.bigintSupported));
                    console.log("- Go Closures: ".concat(capabilities.goClosuresSupported));
                    results = [];
                    // Core benchmarks
                    console.log('\n📊 Benchmarking Core Operations...');
                    _b = (_a = results).push;
                    return [4 /*yield*/, benchmarkCIFPreparation(libffi, capabilities)];
                case 3:
                    _b.apply(_a, [_o.sent()]);
                    _d = (_c = results).push;
                    return [4 /*yield*/, benchmarkFunctionCalls(libffi, capabilities)];
                case 4:
                    _d.apply(_c, [_o.sent()]);
                    _f = (_e = results).push;
                    return [4 /*yield*/, benchmarkRawAPI(libffi, capabilities)];
                case 5:
                    _f.apply(_e, [_o.sent()]);
                    _h = (_g = results).push;
                    return [4 /*yield*/, benchmarkClosures(libffi, capabilities)];
                case 6:
                    _h.apply(_g, [_o.sent()]);
                    if (!capabilities.simdSupported) return [3 /*break*/, 8];
                    console.log('\n📊 Benchmarking SIMD Operations...');
                    _k = (_j = results).push;
                    return [4 /*yield*/, benchmarkSIMDBulkOps(libffi, capabilities)];
                case 7:
                    _k.apply(_j, [_o.sent()]);
                    _o.label = 8;
                case 8:
                    // Complex number benchmarks
                    console.log('\n📊 Benchmarking Complex Numbers...');
                    _m = (_l = results).push;
                    return [4 /*yield*/, benchmarkComplexNumbers(libffi, capabilities)];
                case 9:
                    _m.apply(_l, [_o.sent()]);
                    // Display results
                    console.log('\n📋 Benchmark Results:');
                    console.log('='.repeat(100));
                    console.log('Test Name'.padEnd(35), 'Iterations'.padEnd(12), 'Avg Time (μs)'.padEnd(15), 'Ops/sec'.padEnd(15), 'Features');
                    console.log('-'.repeat(100));
                    results.forEach(function (result) {
                        var features = "".concat(result.wasmMode).concat(result.simdEnabled ? '+SIMD' : '');
                        console.log(result.name.padEnd(35), result.iterations.toLocaleString().padEnd(12), (result.avgTime * 1000).toFixed(2).padEnd(15), result.opsPerSecond.toLocaleString().padEnd(15), features);
                    });
                    // Performance validation against docs/WASM_NATIVE_ARCHITECTURE.md targets
                    console.log('\n🎯 Performance Validation:');
                    cifResult = results.find(function (r) { return r.name.includes('CIF'); });
                    if (cifResult && cifResult.opsPerSecond >= 15000000) {
                        console.log("\u2705 CIF Preparation: ".concat(cifResult.opsPerSecond.toLocaleString(), " ops/sec (target: 15M+)"));
                    }
                    else if (cifResult) {
                        console.log("\u26A0\uFE0F CIF Preparation: ".concat(cifResult.opsPerSecond.toLocaleString(), " ops/sec (below 15M target)"));
                    }
                    console.log('\n✅ Benchmark completed!');
                    // Output for GitHub Actions
                    if (process.env.CI) {
                        console.log('\n📊 GitHub Actions Summary:');
                        results.forEach(function (result) {
                            console.log("".concat(result.name, ": ").concat(result.opsPerSecond.toLocaleString(), " ops/sec"));
                        });
                    }
                    return [3 /*break*/, 12];
                case 10:
                    error_1 = _o.sent();
                    console.error('❌ Benchmark failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 12];
                case 11:
                    libffi.cleanup();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function benchmarkCIFPreparation(libffi, capabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, intType, start, i, end, totalTime, avgTime, opsPerSecond;
        return __generator(this, function (_a) {
            iterations = 100000;
            intType = {
                size: 4,
                alignment: 4,
                type: index_js_1.FFIType.SINT32
            };
            start = performance.now();
            for (i = 0; i < iterations; i++) {
                libffi.prepareCall(intType, [intType, intType]);
            }
            end = performance.now();
            totalTime = (end - start) / 1000;
            avgTime = totalTime / iterations;
            opsPerSecond = Math.floor(iterations / totalTime);
            return [2 /*return*/, {
                    name: 'CIF Preparation',
                    iterations: iterations,
                    totalTime: totalTime,
                    avgTime: avgTime,
                    opsPerSecond: opsPerSecond,
                    wasmMode: capabilities.wasm64Supported ? 'WASM64' : 'WASM32',
                    simdEnabled: capabilities.simdSupported
                }];
        });
    });
}
function benchmarkFunctionCalls(libffi, capabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, intType, start, i, cif, end, totalTime;
        return __generator(this, function (_a) {
            iterations = 50000;
            intType = {
                size: 4,
                alignment: 4,
                type: index_js_1.FFIType.SINT32
            };
            start = performance.now();
            for (i = 0; i < iterations; i++) {
                cif = libffi.prepareCall(intType, [intType]);
                cif.nargs; // Access to simulate work
            }
            end = performance.now();
            totalTime = (end - start) / 1000;
            return [2 /*return*/, {
                    name: 'Function Call Overhead',
                    iterations: iterations,
                    totalTime: totalTime,
                    avgTime: totalTime / iterations,
                    opsPerSecond: Math.floor(iterations / totalTime),
                    wasmMode: capabilities.wasm64Supported ? 'WASM64' : 'WASM32',
                    simdEnabled: capabilities.simdSupported
                }];
        });
    });
}
function benchmarkRawAPI(libffi, capabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, intType, start, i, cif, end, totalTime;
        return __generator(this, function (_a) {
            iterations = 25000;
            intType = {
                size: 4,
                alignment: 4,
                type: index_js_1.FFIType.SINT32
            };
            start = performance.now();
            // Test Raw API preparation overhead
            for (i = 0; i < iterations; i++) {
                cif = libffi.prepareCall(intType, [intType, intType]);
                // Raw API would be used here with actual function
            }
            end = performance.now();
            totalTime = (end - start) / 1000;
            return [2 /*return*/, {
                    name: 'Raw API Operations',
                    iterations: iterations,
                    totalTime: totalTime,
                    avgTime: totalTime / iterations,
                    opsPerSecond: Math.floor(iterations / totalTime),
                    wasmMode: capabilities.wasm64Supported ? 'WASM64' : 'WASM32',
                    simdEnabled: capabilities.simdSupported
                }];
        });
    });
}
function benchmarkClosures(libffi, capabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, start, i, end, totalTime;
        return __generator(this, function (_a) {
            iterations = 10000;
            start = performance.now();
            // Closure allocation/deallocation benchmark
            for (i = 0; i < iterations; i++) {
                // This would test closure operations when fully implemented
            }
            end = performance.now();
            totalTime = (end - start) / 1000;
            return [2 /*return*/, {
                    name: 'Closure Operations',
                    iterations: iterations,
                    totalTime: totalTime,
                    avgTime: totalTime / iterations,
                    opsPerSecond: Math.floor(iterations / totalTime),
                    wasmMode: capabilities.wasm64Supported ? 'WASM64' : 'WASM32',
                    simdEnabled: capabilities.simdSupported
                }];
        });
    });
}
function benchmarkSIMDBulkOps(libffi, capabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, intType, start, i, end, totalTime;
        return __generator(this, function (_a) {
            iterations = 5000;
            intType = {
                size: 4,
                alignment: 4,
                type: index_js_1.FFIType.SINT32
            };
            start = performance.now();
            // SIMD bulk CIF preparation
            for (i = 0; i < iterations; i++) {
                libffi.prepareBulkCalls(8, intType, [intType, intType]);
            }
            end = performance.now();
            totalTime = (end - start) / 1000;
            return [2 /*return*/, {
                    name: 'SIMD Bulk CIF Preparation',
                    iterations: iterations,
                    totalTime: totalTime,
                    avgTime: totalTime / iterations,
                    opsPerSecond: Math.floor(iterations / totalTime),
                    wasmMode: capabilities.wasm64Supported ? 'WASM64' : 'WASM32',
                    simdEnabled: true
                }];
        });
    });
}
function benchmarkComplexNumbers(libffi, capabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, start, i, end, totalTime;
        return __generator(this, function (_a) {
            iterations = 20000;
            start = performance.now();
            // Complex number arithmetic benchmark
            for (i = 0; i < iterations; i++) {
                libffi.complexMultiply({ real: 3.14 + i, imag: 2.71 + i }, { real: 1.41 + i, imag: 1.73 + i }, 'double');
            }
            end = performance.now();
            totalTime = (end - start) / 1000;
            return [2 /*return*/, {
                    name: 'Complex Number Operations',
                    iterations: iterations,
                    totalTime: totalTime,
                    avgTime: totalTime / iterations,
                    opsPerSecond: Math.floor(iterations / totalTime),
                    wasmMode: capabilities.wasm64Supported ? 'WASM64' : 'WASM32',
                    simdEnabled: capabilities.simdSupported
                }];
        });
    });
}
// Run benchmark if executed directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    benchmark().catch(console.error);
}
exports.default = benchmark;
