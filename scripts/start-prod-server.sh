#!/bin/bash
# Robust detached launcher for the POSTFORM production server.
# Double-fork + setsid so the server survives the parent shell session.
LOG=/home/z/my-project/prod3100.log

# Kill any previous instance
pkill -f "standalone/server.js" 2>/dev/null
sleep 1

# Double-fork: child spawns grandchild and exits immediately;
# grandchild is reparented to init and detached from our process group.
setsid bash -c '
  cd /home/z/my-project
  exec env TURSO_DATABASE_URL="file:/home/z/my-project/db/custom.db" \
    DATABASE_URL="file:/home/z/my-project/db/custom.db" \
    NODE_ENV=production PORT=3000 HOSTNAME="::" \
    bun .next/standalone/server.js
' < /dev/null > "$LOG" 2>&1 &

# Wait for readiness
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://[::1]:3000/" --max-time 3 2>/dev/null)
  if [ "$code" = "200" ]; then
    echo "server ready (attempt $i): HTTP $code on IPv4+IPv6"
    exit 0
  fi
  sleep 1
done
echo "server failed to become ready; log tail:"
tail -10 "$LOG"
exit 1
