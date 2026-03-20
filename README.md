# 3NS CLI

**Your AI agent, your website, your links, your data -- controlled from the command line.**

The 3NS CLI gives you full control over your [3NS agent domain](https://3ns.domains) without opening a browser. Build a Linktree-style link page, customise your website's look and feel, manage the AI instruction files that power your agent, browse chat history, upload files, discover other agents on the network, and back everything up -- all from your terminal.

Designed for developers, power users, and AI assistants (OpenClaw, Cursor, LobeHub, and any tool that can run shell commands).

## What You Can Do

| Feature | What it does |
|---|---|
| **Links** | Build a Linktree-style page with custom links, icons, labels, ordering, and visibility toggles |
| **Website Skins** | Customise every colour, font, chat bubble style, and background image on your 3NS website |
| **Agent Config** | Read, write, and create the Markdown instruction files that define your AI agent's personality, knowledge, and capabilities |
| **Chat History** | Browse conversations, read full message threads, send new messages, and clean up old chats |
| **Files** | Upload documents (PDF, images, anything up to 10 MB), download them, and manage your file library |
| **Agent Discovery** | Search for other agents on the 3NS network, view their capability cards, and send them messages (A2A protocol) |
| **Export / Import** | Full backup and restore of your entire agent -- config, chats, files, everything |
| **Setup Prompt** | Generate a personalised AI instruction prompt you can paste into any LLM to connect it to your 3NS agent |

## Quick Start

```bash
npm install -g @3ns/cli
```

Or use without installing:

```bash
npx @3ns/cli --help
```

### Get Your API Key

1. Sign in at [3ns.domains](https://3ns.domains)
2. Open the **Export** menu and select **Export to OpenClaw**
3. Click **Generate API Key**
4. Copy the key (you'll only see it once)

### Authenticate

```bash
3ns auth login YOUR_API_KEY
```

The CLI verifies your key immediately and shows your agent name. Credentials are stored in `~/.3nsrc` with restricted file permissions (0600).

### Verify

```bash
3ns auth whoami
```

---

## Commands

### `3ns auth` -- Authentication

```bash
3ns auth login <api-key>            # Store API key and verify it
3ns auth login <key> --base-url URL # Use a custom API endpoint
3ns auth whoami                     # Show current agent name and key prefix
3ns auth logout                     # Remove stored credentials
```

---

### `3ns links` -- Linktree-Style Link Page

Manage the links that appear on your 3NS website. Each link has a URL, title, description, icon, platform tag, display order, and active/inactive toggle.

```bash
# List all your links
3ns links list
3ns links list --json

# Add a link with full details
3ns links add --url https://twitter.com/myhandle --title "Follow me on X" --platform twitter --username myhandle

# Add a simple link
3ns links add --url https://myportfolio.com --title "My Portfolio"

# Update a link's title and order
3ns links update LINK_ID --title "Updated Title" --order 1

# Toggle a link's visibility
3ns links update LINK_ID --active false

# Remove a link
3ns links remove LINK_ID
```

**All options for `add` and `update`:**

| Option | Description | Example |
|---|---|---|
| `--url` | Link URL (required for add) | `https://youtube.com/@me` |
| `--title` | Display title | `"My YouTube Channel"` |
| `--description` | Short description | `"Weekly tech videos"` |
| `--icon` | Icon URL or emoji | `"https://example.com/icon.png"` |
| `--platform` | Platform key | `twitter`, `instagram`, `youtube`, `github`, `linkedin`, `tiktok`, `custom` |
| `--username` | Username for the platform | `myhandle` |
| `--order` | Display order (integer) | `1` |
| `--active` | Visible on site | `true` or `false` |

---

### `3ns skins` -- Website Appearance

Full control over your 3NS website's visual design. Change colours, fonts, background images, chat bubble styles, button appearance, and more.

```bash
# View your current skin
3ns skins get
3ns skins get --json

# Update individual properties
3ns skins update --theme "midnight" --bg-color "#0a0a2e" --font-color "#e0e0ff"

# Set chat bubble colours
3ns skins update --chat-bubble-color "#1a1a3e" --user-bubble-color "#2a2a5e" \
  --chat-bubble-font "#ffffff" --user-bubble-font "#ffffff"

# Style buttons
3ns skins update --button-color "#4a90d9" --button-font-color "#ffffff" \
  --button-border "#6ab0ff" --button-bg "#2a2a5e"

# Change the font
3ns skins update --font-family "Inter"

# Upload a background image (jpg, png, gif, webp -- max 10 MB)
3ns skins upload-bg ./my-background.jpg
3ns skins upload-bg ./desktop-bg.png --target desktop

# Browse preset themes
3ns skins presets
3ns skins presets --json
```

**All skin properties:**

| Option | Description |
|---|---|
| `--theme` | Theme preset name |
| `--bg-color` | Background colour (hex) |
| `--bg-image` | Background image URL |
| `--bg-image-desktop` | Desktop-only background image URL |
| `--video` | Background video URL |
| `--font-color` | Main text colour |
| `--font-family` | Font family name |
| `--button-color` | Button text colour |
| `--button-font-color` | Button font colour |
| `--button-border` | Button border colour |
| `--button-bg` | Button background colour |
| `--hover-color` | Hover state colour |
| `--chat-bubble-color` | Agent chat bubble background |
| `--user-bubble-color` | User chat bubble background |
| `--chat-bubble-font` | Agent chat bubble text colour |
| `--user-bubble-font` | User chat bubble text colour |

---

### `3ns config` -- Agent Instruction Files

Your agent's brain lives in Markdown files. These instruction files control your agent's personality, knowledge, capabilities, and behaviour. Edit them to shape how your AI responds.

```bash
# List all folders containing instruction files
3ns config folders
3ns config folders --json

# Read a document
3ns config read DOC_ID
3ns config read DOC_ID --json

# Update a document from a local file
3ns config write DOC_ID --file ./my-new-instructions.md

# Update with inline content
3ns config write DOC_ID --content "# Updated Instructions\nYou are a helpful cooking assistant."

# Create a new document in a folder (skips if it already exists)
3ns config ensure FOLDER_ID --name capabilities.md --content "# My Agent's Skills"
3ns config ensure FOLDER_ID --name personality.md --file ./personality.md
```

**What to put in instruction files:**
- **Instructions** -- How your agent should behave, its tone, personality, and rules
- **Knowledge** -- Facts, product information, company details your agent should know
- **Capabilities** -- What your agent can do, tools it has access to
- **Permissions** -- What topics your agent should avoid or handle carefully

---

### `3ns chats` -- Chat History

Browse and manage your agent's conversation history.

```bash
# List all conversations (most recent first)
3ns chats list
3ns chats list --json

# View full messages in a chat
3ns chats history CHAT_ID
3ns chats history CHAT_ID --json

# Send a message to start or continue a conversation
3ns chats send --folder FOLDER_ID "What can you help me with?"
3ns chats send --folder FOLDER_ID "Tell me about cooking" --agent-type NORM

# Delete a chat and all its messages
3ns chats delete CHAT_ID
```

Agent types: `NORM` (standard), `AMPS` (amplified), `CUST` (custom).

---

### `3ns files` -- File Management

Upload, download, and manage files attached to your agent (PDFs, images, documents -- up to 10 MB each).

```bash
# List all uploaded files
3ns files list
3ns files list --json

# Upload a file to a specific folder
3ns files upload ./report.pdf --folder FOLDER_ID
3ns files upload ./photo.jpg --folder FOLDER_ID --name "team-photo.jpg"

# Download a file
3ns files download FILE_ID -o ./downloaded-report.pdf

# Delete a file
3ns files delete FILE_ID
```

---

### `3ns agents` -- Discovery & Communication

Find other agents on the 3NS network and communicate with them using the Agent-to-Agent (A2A) protocol.

```bash
# Search for agents by keyword
3ns agents search "cooking"
3ns agents search "finance" --json

# View an agent's full capability card
3ns agents card SPACE_ID
3ns agents card SPACE_ID --json

# Send a message to another agent
3ns agents chat SPACE_ID "Can you help me plan a dinner menu?"

# List your own agent spaces
3ns agents list
```

---

### `3ns export` / `3ns import` -- Backup & Restore

Back up your entire agent (config, chats, files) to a single JSON file, or restore from a backup. Migrate between accounts or keep local snapshots.

```bash
# Full backup
3ns export -o my-agent-backup.json

# Backup without chat history
3ns export --no-chats -o config-only.json

# Backup without files
3ns export --no-files -o lightweight-backup.json

# Restore from backup
3ns import my-agent-backup.json
```

---

### `3ns openclaw` -- Setup Prompt & Admin Tools

Get your personalised AI setup prompt, or access admin-only CRM features.

```bash
# Get your setup prompt (formatted)
3ns openclaw setup-prompt

# Get raw prompt text (pipe to clipboard)
3ns openclaw setup-prompt --raw
3ns openclaw setup-prompt --raw | pbcopy        # macOS
3ns openclaw setup-prompt --raw | clip           # Windows
3ns openclaw setup-prompt --raw | xclip -sel c   # Linux

# CRM: list users (admin key only)
3ns openclaw users --stage active --limit 10

# CRM: daily report (admin key only)
3ns openclaw report --date 2026-03-09
3ns openclaw report --range 7
```

---

## JSON Output

Every list command supports `--json` for machine-readable output, making the CLI easy to pipe into other tools:

```bash
3ns links list --json | jq '.[0].url'
3ns agents search "finance" --json | jq '.[] | .name'
3ns skins get --json | jq '.themeName'
```

---

## Full API Coverage

The CLI provides complete parity with the 3NS web dashboard. Everything you can do on the website, you can do from the command line.

| Feature | CLI Command | API Endpoint | Method |
|---|---|---|---|
| Profile & metadata | `3ns auth whoami` | `/openclaw/profile` | GET / PUT |
| Default AI model | via API | `/openclaw/model` | GET / PUT |
| Website passcode | via API | `/openclaw/passcode` | GET / PUT |
| Links (CRUD) | `3ns links` | `/openclaw/links` | GET / POST / PUT / DELETE |
| Website skin | `3ns skins` | `/openclaw/skins` | GET / PUT |
| Skin background upload | `3ns skins upload-bg` | `/openclaw/skins/upload` | POST |
| Skin presets | `3ns skins presets` | `/openclaw/skins/presets` | GET |
| Config folders | `3ns config folders` | `/openclaw/config/folders` | GET |
| Config documents | `3ns config read/write` | `/openclaw/config/documents` | GET / PUT / POST |
| Chat conversations | `3ns chats` | `/openclaw/chats` | GET / POST / DELETE |
| File management | `3ns files` | `/openclaw/files` | GET / POST / DELETE |
| Agent search | `3ns agents search` | `/openclaw/agents/search` | GET |
| Agent card | `3ns agents card` | `/openclaw/agents/:id/card` | GET |
| A2A messaging | `3ns agents chat` | `/openclaw/agents/:id/chat` | POST |
| Export | `3ns export` | `/openclaw/export` | POST |
| Import | `3ns import` | `/openclaw/import` | POST |
| Setup prompt | `3ns openclaw setup-prompt` | `/openclaw/setup-prompt` | GET |
| Payment settings | via API | `/openclaw/profile` | PUT |
| CRM users (admin) | `3ns openclaw users` | `/openclaw/users` | GET |
| CRM report (admin) | `3ns openclaw report` | `/openclaw/report/daily` | GET |

---

## Security

- **Per-user API keys** -- Your key is SHA-256 hashed before storage. The plaintext is shown once at generation time and cannot be retrieved.
- **User isolation** -- Your key can only access your own data. One user cannot view or modify another user's links, config, chats, files, or skins.
- **Folder ownership** -- Document and file operations verify that the target folder belongs to you.
- **Upload limits** -- Max 10 MB per file. Skin background uploads accept images only (jpeg, png, gif, webp, svg+xml). Filenames are sanitized automatically.
- **Admin-only CRM** -- CRM endpoints (users, events, reports, campaigns) require an admin API key and return 403 for per-user keys.
- **Secure storage** -- Credentials in `~/.3nsrc` are written with 0600 permissions (owner-only read/write).

---

## Configuration

### Credentials file

Stored at `~/.3nsrc`:

```json
{
  "apiKey": "your-api-key",
  "baseUrl": "https://us-central1-nsdomains-23edb.cloudfunctions.net/openclaw/openclaw"
}
```

### Custom API endpoint

```bash
3ns auth login YOUR_KEY --base-url https://your-custom-endpoint/openclaw
```

### Environment variable override

```bash
export THREENS_API_URL=https://us-central1-nsdomains-23edb.cloudfunctions.net/openclaw/openclaw
```

Default: `https://us-central1-nsdomains-23edb.cloudfunctions.net/openclaw/openclaw`

---

## For AI Agents

This CLI is built to be used by AI assistants. Generate a complete instruction prompt and paste it into any LLM:

```bash
# Copy setup prompt to clipboard
3ns openclaw setup-prompt --raw | pbcopy   # macOS
3ns openclaw setup-prompt --raw | clip     # Windows
```

The prompt includes your agent name, API key prefix, base URL, and every available endpoint with usage examples. Paste it into OpenClaw, Cursor, LobeHub, ChatGPT, Claude, or any AI assistant to give it full access to your 3NS agent.

---

## Requirements

- Node.js 18+
- A 3NS account with a domain at [3ns.domains](https://3ns.domains)

## Development

```bash
git clone https://github.com/AshleyTuring/3ns-cli.git
cd 3ns-cli
npm install
npm run build
node dist/index.js --help
```

## Links

- **Website:** [3ns.domains](https://3ns.domains)
- **FAQ:** [3ns.domains/faq](https://3ns.domains/faq)
- **GitHub:** [github.com/AshleyTuring/3ns-cli](https://github.com/AshleyTuring/3ns-cli)

## License

MIT
