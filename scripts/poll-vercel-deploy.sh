#!/bin/bash
# Poll the Vercel production URL until the new zero-config deploy goes live.
# Old deploy: homepage 500 (DB fallback broken). New deploy: 200 + products.
URL="${1:-https://postform-eight.vercel.app}"
DEADLINE=$(( $(date +%s) + 480 ))   # wait up to 8 minutes
SEEN_OLD=0

while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  CODE=$(curl -s -o /tmp/poll-home.html -w "%{http_code}" --max-time 30 "$URL/" || echo 000)
  if [ "$CODE" = "200" ]; then
    # Confirm it is the real storefront (hero copy), not a Vercel error page
    if grep -q "CURATED\|STREETWEAR\|POSTFORM" /tmp/poll-home.html && \
       ! grep -q "__next_error__" /tmp/poll-home.html; then
      echo "LIVE: homepage 200 with storefront content"
      echo "SHOP: $(curl -s -o /tmp/poll-shop.html -w '%{http_code}' --max-time 30 "$URL/shop")"
      echo "PRODUCT LINKS:"
      grep -o 'href="/product/[a-z0-9-]*"' /tmp/poll-shop.html | sort -u | head -6
      SITEMAP_CODE=$(curl -s -o /tmp/poll-sitemap.xml -w '%{http_code}' --max-time 30 "$URL/sitemap.xml")
      echo "SITEMAP: $SITEMAP_CODE"
      if [ "$SITEMAP_CODE" = "200" ]; then
        echo "URLS IN SITEMAP: $(grep -c '<loc>' /tmp/poll-sitemap.xml)"
      fi
      exit 0
    fi
  fi
  if [ "$CODE" = "500" ]; then SEEN_OLD=1; fi
  echo "waiting... homepage=$CODE (old-500-seen=$SEEN_OLD), retry in 20s"
  sleep 20
done
echo "TIMEOUT after 8 minutes — last code: $CODE"
exit 1
