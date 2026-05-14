# WhatsApp Client Bridge — Architecture

> Client: Thay Guimarães · WhatsApp
> Purpose: Receive client feedback messages → structured files readable by both OpenClaw and Claude Code
> Audio: Auto-transcribe via Whisper GPU (RTX 4090)

## Components

```
Thay's WhatsApp
      │
      ▼
┌─────────────────┐
│  OpenClaw        │  WhatsApp plugin (baileys-based)
│  WhatsApp Plugin │  → receives messages
│  (port: gateway) │  → pairs via QR code (scan with WhatsApp mobile app)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Message Relay   │  ~/flipper/scripts/wa-relay.sh
│  (cron or hook)  │  → polls OpenClaw session for Thay's messages
│                  │  → writes to ~/flipper/feedback/thay/YYYY-MM-DD.jsonl
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│OpenClaw│ │Claude Code│   both read the same files
│agent   │ │agent      │   via jq / cat
└────────┘ └──────────┘
```

## Setup Steps for Claude Code Agent

### 1. Enable WhatsApp in OpenClaw

Edit `/home/adminuser/.openclaw/openclaw.json` — add a `channels.whatsapp` block (the config patch is protected, needs direct edit):

```json
"channels": {
  "whatsapp": {
    "enabled": true,
    "dmPolicy": "open",
    "groupPolicy": "disabled",
    "reactionLevel": "off",
    "accounts": {
      "default": {
        "enabled": true,
        "name": "Kira",
        "dmPolicy": "open"
      }
    }
  }
}
```

Then: `openclaw gateway restart`

### 2. Expose QR code page for remote pairing

The WhatsApp plugin serves a pairing page on the gateway's internal HTTP server. Expose it:

```bash
# Check gateway bind
grep -A5 '"bind"' ~/.openclaw/openclaw.json

# The gateway is already bound to "lan" (0.0.0.0)
# Pairing page is at: http://<gateway-ip>:<port>/whatsapp/pair
# OR: access via https://kira.abbamarkt.nl (control UI → WhatsApp status → QR code)

# Cloudflare tunnel the pairing page:
# cloudflared tunnel route dns <tunnel-name> wa-pair.abbamarkt.nl
# cloudflared tunnel config → ingress: wa-pair.abbamarkt.nl → http://localhost:<gateway-port>
```

### 3. Create message relay script

Write `~/flipper/scripts/wa-relay.sh`:

```bash
#!/bin/bash
# Poll Thay's messages from OpenClaw session and append to feedback file
FEEDBACK_DIR="$HOME/flipper/feedback/thay"
mkdir -p "$FEEDBACK_DIR"
DATE_FILE="$FEEDBACK_DIR/$(date -u +%Y-%m-%d).jsonl"

# Use sessions_list to find Thay's session, then sessions_history to pull messages
# This is a template — the actual API calls depend on OpenClaw session keys

# For audio messages: download media, transcribe with whisper
# whisper audio.ogg --model medium --output_format txt --output_dir "$FEEDBACK_DIR"
```

### 4. Claude Code CLI snippet

Add to `CLAUDE.md` bootstrap or run directly:

```bash
# Pull Thay's latest feedback
cat ~/flipper/feedback/thay/$(date -u +%Y-%m-%d).jsonl 2>/dev/null | jq -r '[.timestamp, .text] | @tsv'

# Pull last 3 days
for f in ~/flipper/feedback/thay/2026-05-{12,13,14}.jsonl; do
  [ -f "$f" ] && echo "=== $(basename $f) ===" && cat "$f" | jq -r '.text'
done

# Transcribe latest audio
ls -t ~/flipper/feedback/thay/audio-*.ogg 2>/dev/null | head -1 | xargs -I{} whisper {} --model medium --output_format txt --output_dir ~/flipper/feedback/thay/
```

## Pairing Flow

1. Gateway restarts with WhatsApp channel enabled
2. Gateway generates QR code (baileys handshake with WhatsApp servers)
3. QR code is shown at the gateway control UI or WhatsApp status endpoint
4. Otto scans QR code with WhatsApp mobile app (Settings → Linked Devices → Link a Device)
5. WhatsApp connection established → messages flow to OpenClaw
6. Relay script copies messages to `~/flipper/feedback/thay/`

## Notes

- Audio messages arrive as `.ogg` files — whisper handles these natively
- RTX 4090 GPU available for fast transcription (`--device cuda`)
- Feedback files should be gitignored (client data)
- The relay script can run as a cron job every 30s or be hook-triggered
