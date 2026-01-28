Write-Host "Deploying Sovereign Engine v2.0..."
Write-Host "Checking Rust Environment..."
rustc --version
Write-Host "Checking Node.js Environment..."
node --version
Write-Host "Building LWAS Core..."
cd AETERNAAA/lwas_core
cargo build --release
cd ../..
Write-Host "Deploy complete."
