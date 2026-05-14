# Thay Guimarães — Client Feedback

Messages forwarded by Otto. Each message saved as JSONL with image attachments in `images/`.

## Format (`YYYY-MM-DD.jsonl`, one JSON object per line)

```jsonl
{"timestamp":"2026-05-14T01:03:00Z","type":"text","text":"O dashboard ficou ótimo, mas..."}
{"timestamp":"2026-05-14T01:05:00Z","type":"image","text":"Olha esse card com padding quebrado","image":"images/2026-05-14T010500-screenshot.jpg"}
{"timestamp":"2026-05-14T01:07:00Z","type":"text","text":"A cor do header tá muito escura"}
```

## CLI quick ref (for Claude Code agent)

```bash
# Today's messages
cat ~/flipper/feedback/thay/$(date -u +%Y-%m-%d).jsonl | jq -r '[.timestamp, .type, .text] | @tsv'

# Last 3 days
cat ~/flipper/feedback/thay/2026-05-1[2-4].jsonl | jq -r '.text'

# Extract all action items (messages containing !fix or FIX)
cat ~/flipper/feedback/thay/2026-05-*.jsonl | jq -r 'select(.text | test("!fix|FIX|corrigir|arrumar|quebrado|bug")) | .text'
```
