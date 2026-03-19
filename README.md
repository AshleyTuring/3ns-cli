# 3NS CLI

Control your [3NS](https://3ns.domains) agent domain from the command line. Manage your profile, links, AI model, website skin, agent configuration (MD instruction files), chat history, files, and discover other agents -- all from your terminal or AI assistant.

## Installation

```bash
npm install -g @3ns/cli
```

Or run without installing:

```bash
npx @3ns/cli --help
```

## Getting Started

### 1. Get your API key

Sign in at [3ns.domains](https://3ns.domains), open the Export menu, select "Export to OpenClaw", and click "Generate API Key". Each user gets their own key, scoped to their data only.

### 2. Authenticate

```bash
3ns auth login YOUR_API_KEY
```

### 3. Check your identity

```bash
3ns auth whoami
```

## Security Model

- **Per-user API keys** are SHA-256 hashed before storage. Your plaintext key is shown once at generation time.
- Your key can only access **your own** spaces, links, documents, chats, files, and skins.
- **CRM endpoints** (users, events, reports, campaigns) require an **admin key** and return 403 for per-user keys.
- **Upload limits:** Max 10 MB per file. Skin background uploads accept images only (jpeg, png, gif, webp, svg+xml).
- Filenames are sanitized automatically.

## Commands

### `3ns auth`

| Command | Description |
|---------|-------------|
| `3ns auth login <key>` | Store API key in ~/.3nsrc |
| `3ns auth whoami` | Show current auth status |
| `3ns auth logout` | Remove stored credentials |

### `3ns links`

Manage the Linktree-style links on your 3NS website.

```bash
3ns links list
3ns links add --url https://example.com --title "My Site" --platform twitter --username myhandle
3ns links update LINK_ID --title "Updated Title" --active false
3ns links remove LINK_ID
```

Options: `--url`, `--title`, `--platform`, `--username`, `--active` (true/false), `--order`.

### `3ns config`

Manage agent configuration -- the MD instruction files that control your agent's behaviour.

```bash
3ns config folders
3ns config read DOC_ID
3ns config write DOC_ID --file ./updated-instructions.md
3ns config ensure FOLDER_ID --name capabilities.md --content "# Skills"
```

### `3ns agents`

Discover and interact with other agents on the network.

```bash
3ns agents search "cooking"
3ns agents card SPACE_ID
3ns agents chat SPACE_ID "Can you help me with recipes?"
3ns agents list
```

### `3ns chats`

Browse and manage your chat history.

```bash
3ns chats list
3ns chats history CHAT_ID
3ns chats send --folder FOLDER_ID "Hello agent"
3ns chats delete CHAT_ID
```

### `3ns files`

Upload, download, and manage files attached to your agent (max 10 MB).

```bash
3ns files list
3ns files upload ./document.pdf --folder FOLDER_ID
3ns files download FILE_ID -o ./local-copy.pdf
3ns files delete FILE_ID
```

### `3ns skins`

Customise your agent website's appearance (17 color/style fields).

```bash
3ns skins get
3ns skins update --theme "midnight" --bg-color "#0a0a0a" --font-color "#ffffff"
3ns skins upload-bg ./background.jpg --target both
3ns skins presets
```

Options for `update`: `--theme`, `--bg-color`, `--font-color`, `--button-color`, `--button-font-color`, `--hover-color`, `--font-family`, `--chat-bubble-color`, `--user-bubble-color`, `--chat-bubble-font`, `--user-bubble-font`, `--btn-border`, `--btn-bg`.

Options for `upload-bg`: `--target` (`both` or `desktop`). Accepts jpg, png, gif, webp. Max 10 MB.

### `3ns export` / `3ns import`

Backup and restore your entire agent.

```bash
3ns export -o my-agent-backup.json
3ns export --no-chats -o config-only.json
3ns import my-agent-backup.json
```

### `3ns openclaw`

Access CRM features (admin key only) and get your AI setup prompt.

```bash
3ns openclaw setup-prompt
3ns openclaw setup-prompt --raw
3ns openclaw users --stage active --limit 10
3ns openclaw report --range 7
```

Note: `users` and `report` commands require an admin API key.

## JSON Output

All list commands support `--json` for machine-readable output:

```bash
3ns links list --json
3ns agents search "finance" --json
```

## Configuration

Credentials are stored in `~/.3nsrc` with restricted permissions (0600).

```json
{
  "apiKey": "your-api-key",
  "baseUrl": "https://custom-endpoint.example.com"
}
```

## API Coverage

The CLI provides full parity with the 3NS dashboard:

| Feature | CLI Command | API Endpoint |
|---------|-------------|--------------|
| Profile | via `setup-prompt` | `GET/PUT /openclaw/profile` |
| Default Model | -- | `GET/PUT /openclaw/model` |
| Passcode | -- | `GET/PUT /openclaw/passcode` |
| Links | `3ns links` | `GET/POST/PUT/DELETE /openclaw/links` |
| Config/Docs | `3ns config` | `/openclaw/config/folders`, `/openclaw/config/documents` |
| Chats | `3ns chats` | `GET/POST/PUT/DELETE /openclaw/chats` |
| Files | `3ns files` | `GET/POST/DELETE /openclaw/files` |
| Skins | `3ns skins` | `GET/PUT/POST /openclaw/skins` |
| Agents | `3ns agents` | `GET/POST /openclaw/agents` |
| Export/Import | `3ns export/import` | `POST /openclaw/export`, `POST /openclaw/import` |
| Payment settings | -- | `PUT /openclaw/profile` (payment fields) |
| CRM (admin) | `3ns openclaw` | `/openclaw/users`, `/openclaw/events`, etc. |

## For AI Agents

This CLI is designed to be used by AI agents (OpenClaw, Cursor, LobeHub, etc.). The setup prompt command generates a complete instruction set:

```bash
3ns openclaw setup-prompt --raw | pbcopy
```

Then paste into your AI assistant's system prompt.

## Development

```bash
git clone https://github.com/AshleyTuring/3ns-cli.git
cd 3ns-cli
npm install
npm run build
node dist/index.js --help
```

## License

MIT
