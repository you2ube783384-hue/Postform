#!/bin/bash
# Fetch streetwear product images via z-ai image-search (parallel batches)
OUT=/home/z/my-project/scripts/img
mkdir -p $OUT

run() {
  name=$1; query=$2; count=$3
  z-ai image-search -q "$query" --count $count --gl us --no-rank -o "$OUT/$name.json" 2>/dev/null && echo "✓ $name" || echo "✗ $name"
}

# Batch 1
run hero "streetwear fashion editorial model bold outfit studio photography" 4 &
run tee-black "black oversized t-shirt streetwear on model" 3 &
run tee-graphic "white graphic print t-shirt streetwear" 3 &
wait
# Batch 2
run tee-cream "cream oversized drop shoulder t-shirt fashion" 3 &
run hoodie "black heavyweight hoodie streetwear" 3 &
run flannel "brown plaid flannel shirt mens fashion" 3 &
wait
# Batch 3
run cargo "olive green cargo pants streetwear outfit" 3 &
run jeans "baggy blue denim jeans mens fashion" 3 &
run sneakers-white "white retro court sneakers product photo" 3 &
wait
# Batch 4
run sneakers-chunky "chunky trail sneakers product photo" 3 &
run cap "black baseball cap product photo" 3 &
run beanie "black knit beanie product photo" 3 &
wait
# Batch 5
run tote "canvas tote bag streetwear minimal" 3 &
run sweatpants "grey sweatpants streetwear on model" 3 &
run shirt "oversized linen shirt mens fashion" 3 &
wait
echo "ALL DONE"