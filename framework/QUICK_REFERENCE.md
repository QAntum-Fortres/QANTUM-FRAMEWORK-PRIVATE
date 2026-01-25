# ⚡ MOJO-RUST QUICK REFERENCE GUIDE

## 🎯 Quick Start

### Install Dependencies
```bash
# Install Mojo
curl https://get.modular.com | sh -
modular install mojo

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Build Framework
```bash
cd framework

# Option 1: Pure Rust (portable)
cargo build --release

# Option 2: With Mojo acceleration (fastest)
cargo build --release --features use_native_mojo
```

### Run Tests
```bash
cargo test
cargo bench
```

---

## 📚 API Reference

### Mojo Kernel Functions

#### `mojo_accelerate_tensors(data: Tensor[DType.float32])`
**Purpose:** Hardware-accelerated tensor operations  
**Complexity:** O(1/SIMD_Width)  
**Use Case:** Neural network weight updates, batch normalization

```mojo
var weights = Tensor[DType.float32](1000000)
mojo_accelerate_tensors(weights)
```

#### `mojo_scan_void(context: Pointer[None]) -> Float32`
**Purpose:** Ultra-low-latency market scanning  
**Complexity:** O(1) per asset  
**Use Case:** High-frequency trading, arbitrage detection

```mojo
var market_data = get_market_context()
var score = mojo_scan_void(market_data)
```

---

### Rust Bridge API

#### `MojoBridge::execute_tensor_pass(data: &mut [f32])`
**Purpose:** Execute tensor acceleration (Mojo or fallback)  
**Safety:** `unsafe` - requires valid aligned data  
**Returns:** None (modifies in-place)

```rust
use mojo_bridge::MojoBridge;

let mut weights = vec![1.0f32; 1_000_000];
unsafe {
    MojoBridge::execute_tensor_pass(&mut weights);
}
```

#### `MojoBridge::scan_void_optimized(vsh: Arc<VectorSpaceHeap>)`
**Purpose:** Async market void scanning  
**Safety:** Safe  
**Returns:** `SovereignResult<String>`

```rust
let vsh = VectorSpaceHeap::new();
let result = MojoBridge::scan_void_optimized(vsh).await?;
println!("{}", result);
```

---

### HybridKernel (Fallback)

#### `HybridKernel::accelerate_weights(data: &mut [f32])`
**Purpose:** Pure Rust SIMD tensor acceleration  
**Safety:** `unsafe` - uses AVX intrinsics  
**Returns:** None (modifies in-place)

```rust
use mojo_kernel::HybridKernel;

let mut data = vec![1.0f32; 1000];
unsafe {
    HybridKernel::accelerate_weights(&mut data);
}
```

#### `HybridKernel::scan_market_void(vsh: Arc<VectorSpaceHeap>)`
**Purpose:** Rust-based market scanning  
**Safety:** Safe (async)  
**Returns:** `SovereignResult<String>`

```rust
let vsh = Arc::new(VectorSpaceHeap::new());
let result = HybridKernel::scan_market_void(vsh).await?;
```

---

### VortexAI Engine

#### `VortexAI::new() -> Self`
**Purpose:** Create new VortexAI instance  
**Returns:** Initialized VortexAI with all departments

```rust
let vortex = VortexAI::new();
```

#### `VortexAI::start()`
**Purpose:** Start the Vortex engine  
**Async:** Yes  
**Side Effects:** Spawns background task

```rust
vortex.start().await;
```

#### `VortexAI::get_status() -> String`
**Purpose:** Get current engine status  
**Returns:** Status string with cycle count

```rust
let status = vortex.get_status();
println!("{}", status);
```

---

### Parser API

#### `LwasParser::parse(source: &str) -> Result<Vec<AstNode>>`
**Purpose:** Parse LWAS source code to AST  
**Returns:** Vector of AST nodes or error

```rust
use lwas_parser::LwasParser;

let source = "immortal x = 42;";
let ast = LwasParser::parse(source)?;
```

#### AST Node Types
- `Immortal { name, value }` - Persistent state
- `Manifold { name, body }` - Vector space
- `Resonate { target, frequency }` - Frequency operations
- `Collapse { target, entropy_threshold }` - Entropy reduction
- `Magnet { label, power }` - Attraction operations
- `Department { name, priority }` - System modules

---

### Economy API

#### `BinanceConnector::new(api_key: String) -> Self`
**Purpose:** Create Binance exchange connector

```rust
let binance = BinanceConnector::new("your_api_key".to_string());
```

#### `BinanceConnector::get_balance(asset: &str) -> AssetBalance`
**Purpose:** Query asset balance  
**Complexity:** O(1)

```rust
let balance = binance.get_balance("BTC");
println!("BTC Balance: {}", balance.total);
```

---

## 🛠️ Configuration

### Cargo Features

| Feature | Description | Performance Impact |
|---------|-------------|-------------------|
| `use_native_mojo` | Enable native Mojo kernels | +90% speed |
| `gpu` (future) | Enable GPU acceleration | +500% speed |
| `debug_telemetry` | Enable detailed logging | -10% speed |

### Environment Variables

```bash
# Library path for Mojo .so files
export LD_LIBRARY_PATH=/path/to/framework/mojo_soul:$LD_LIBRARY_PATH

# Enable Rust backtrace
export RUST_BACKTRACE=1

# Logging level
export RUST_LOG=debug
```

---

## 🔧 Common Tasks

### Adding a New Mojo Kernel

1. **Create Mojo file** in `mojo_soul/`:
   ```mojo
   fn my_new_kernel(data: Tensor[DType.float32]):
       # Implementation
   ```

2. **Add FFI declaration** in `rust_bridge/mojo_bridge.rs`:
   ```rust
   extern "C" {
       fn my_new_kernel(data: *mut f32, len: usize);
   }
   ```

3. **Create Rust fallback** in `rust_bridge/`:
   ```rust
   pub unsafe fn my_new_kernel_fallback(data: &mut [f32]) {
       // Rust implementation
   }
   ```

4. **Add bridge function**:
   ```rust
   pub unsafe fn execute_my_kernel(data: &mut [f32]) {
       if cfg!(feature = "use_native_mojo") {
           my_new_kernel(data.as_mut_ptr(), data.len());
       } else {
           my_new_kernel_fallback(data);
       }
   }
   ```

### Compiling Mojo to Shared Library

```bash
cd framework/mojo_soul
mojo build my_kernel.mojo -o libmy_kernel.so

# For specific architectures
mojo build my_kernel.mojo --target=x86_64-linux-gnu -o libmy_kernel.so
mojo build my_kernel.mojo --target=aarch64-linux-gnu -o libmy_kernel_arm.so
```

### Benchmarking

```bash
# Run all benchmarks
cargo bench

# Run specific benchmark
cargo bench mojo_native

# Compare with baseline
cargo bench --bench tensor_ops -- --baseline main
```

---

## 🐛 Troubleshooting

### Mojo Library Not Found

**Error:** `error while loading shared libraries: libmojo_kernel.so`

**Solution:**
```bash
export LD_LIBRARY_PATH=/path/to/framework/mojo_soul:$LD_LIBRARY_PATH
# Or copy to system library path
sudo cp framework/mojo_soul/*.so /usr/local/lib/
sudo ldconfig
```

### AVX-512 Not Available

**Error:** `Illegal instruction (core dumped)`

**Solution:** Build without AVX-512:
```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
# Or force AVX2
RUSTFLAGS="-C target-feature=+avx2" cargo build --release
```

### FFI Segfault

**Error:** Segmentation fault when calling Mojo

**Checklist:**
1. Verify data alignment (16/32/64-byte boundaries)
2. Check pointer validity
3. Ensure length matches actual allocation
4. Verify Mojo library ABI compatibility

```rust
// Ensure alignment
let mut data = vec![0.0f32; 1000];
assert_eq!(data.as_ptr() as usize % 64, 0);
```

---

## 📊 Performance Tips

### 1. Data Alignment
```rust
// ❌ Bad: Unaligned data
let data = vec![1.0f32; 1000];

// ✅ Good: Aligned data
use std::alloc::{alloc, Layout};
let layout = Layout::from_size_align(4000, 64).unwrap();
let ptr = unsafe { alloc(layout) as *mut f32 };
```

### 2. Batch Processing
```rust
// ❌ Bad: Many small calls
for i in 0..1000 {
    MojoBridge::execute_tensor_pass(&mut data[i..i+100]);
}

// ✅ Good: One large call
MojoBridge::execute_tensor_pass(&mut data);
```

### 3. Avoid Copies
```rust
// ❌ Bad: Copies data
let data_copy = data.clone();
MojoBridge::execute_tensor_pass(&mut data_copy);

// ✅ Good: In-place modification
MojoBridge::execute_tensor_pass(&mut data);
```

---

## 🔒 Security Best Practices

### 1. Input Validation
```rust
pub fn safe_accelerate(data: &mut [f32]) -> Result<(), Error> {
    // Validate length
    if data.is_empty() || data.len() > MAX_TENSOR_SIZE {
        return Err(Error::InvalidSize);
    }
    
    // Validate alignment
    if data.as_ptr() as usize % 16 != 0 {
        return Err(Error::MisalignedData);
    }
    
    unsafe {
        MojoBridge::execute_tensor_pass(data);
    }
    Ok(())
}
```

### 2. Bounds Checking
```rust
// Always check before FFI calls
assert!(index < data.len());
assert!(!data.is_empty());
```

### 3. Resource Cleanup
```rust
struct MojoContext {
    data: Vec<f32>,
}

impl Drop for MojoContext {
    fn drop(&mut self) {
        // Ensure cleanup even on panic
        self.data.clear();
    }
}
```

---

## 📈 Optimization Checklist

- [ ] Use `--release` builds for production
- [ ] Enable `use_native_mojo` feature
- [ ] Compile Mojo kernels with `-O3`
- [ ] Profile with `cargo flamegraph`
- [ ] Use `#[inline(always)]` for hot paths
- [ ] Minimize allocations in loops
- [ ] Use `Arc` instead of `Mutex<Vec>` where possible
- [ ] Enable LTO: `lto = true` in Cargo.toml

---

## 🎓 Learning Resources

### Mojo
- [Mojo Documentation](https://docs.modular.com/mojo)
- [MLIR Overview](https://mlir.llvm.org/)
- [SIMD Programming Guide](https://www.intel.com/content/www/us/en/docs/intrinsics-guide)

### Rust
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust Performance Book](https://nnethercote.github.io/perf-book/)
- [FFI Guide](https://doc.rust-lang.org/nomicon/ffi.html)

### Architecture
- `framework/README.md` - Overview
- `framework/MOJO_RUST_SYNERGY_ANALYSIS.md` - Deep dive
- `framework/ARCHITECTURE_DIAGRAM.md` - Visual diagrams

---

## 🚀 Production Deployment

### Docker Image
```dockerfile
FROM rust:1.75 as builder
WORKDIR /build
COPY framework/ .
RUN cargo build --release --features use_native_mojo

FROM ubuntu:22.04
COPY --from=builder /build/target/release/liblwas_core.so /usr/local/lib/
COPY framework/mojo_soul/*.so /usr/local/lib/
ENV LD_LIBRARY_PATH=/usr/local/lib
CMD ["/usr/local/bin/lwas_ignite"]
```

### Systemd Service
```ini
[Unit]
Description=QANTUM Mojo-Rust Framework
After=network.target

[Service]
Type=simple
User=qantum
WorkingDirectory=/opt/qantum/framework
Environment="LD_LIBRARY_PATH=/opt/qantum/framework/mojo_soul"
ExecStart=/opt/qantum/framework/bin/lwas_ignite
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 📞 Support

**Issues:** Check `framework/TROUBLESHOOTING.md`  
**Architecture Questions:** See `framework/MOJO_RUST_SYNERGY_ANALYSIS.md`  
**Performance Tuning:** Consult benchmarks in `benches/`

---

**"Master the tools, own the performance."**  
— AETERNA_MOJO_CORE
