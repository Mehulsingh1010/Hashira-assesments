# Stage 1: Build
FROM rust:latest AS builder

RUN apt-get update && \
    apt-get install -y libleveldb-dev libsnappy-dev cmake build-essential clang libclang-dev llvm && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Cargo.toml Cargo.lock ./

COPY src ./src

RUN cargo build --release

# Stage 2: Runtime (slim image)
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/benchmarker .

RUN mkdir -p /app/results

CMD ["./benchmarker"]