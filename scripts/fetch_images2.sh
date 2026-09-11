#!/bin/bash
OUT=/home/z/my-project/scripts/img
mkdir -p $OUT

run() {
  name=$1; query=$2; count=$3
  z-ai image-search -q "$query" --count $count --gl us --no-rank -o "$OUT/$name.json" 2>/dev/null && echo "✓ $name" || echo "✗ $name"
}

run tee-graphic "graphic print streetwear t-shirt" 3 &
run tee-cream "oversized white t-shirt fashion model" 3 &
run jeans "loose fit denim jeans streetwear" 3 &
wait
run cap "plain black snapback cap" 3 &
run sweatpants "grey jogger sweatpants mens" 3 &
wait
echo "ALL DONE"