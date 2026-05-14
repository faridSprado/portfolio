use std::{env, fs};

const FNV_OFFSET: u64 = 0xcbf29ce484222325;
const FNV_PRIME: u64 = 0x100000001b3;

fn main() {
    let path = env::args()
        .nth(1)
        .unwrap_or_else(|| "backend/app/db/portfolio_content.json".to_string());
    let bytes = fs::read(&path).expect("content file should be readable");
    let fingerprint = fnv1a64(&bytes);
    println!("{fingerprint:016x}  {path}");
}

fn fnv1a64(bytes: &[u8]) -> u64 {
    bytes.iter().fold(FNV_OFFSET, |hash, byte| {
        let mixed = hash ^ u64::from(*byte);
        mixed.wrapping_mul(FNV_PRIME)
    })
}
