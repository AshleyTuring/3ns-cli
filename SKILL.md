# 3NS Agent Domain CLI -- AI Skill

> This skill allows an AI agent to control a 3NS agent domain. Use the 3NS CLI to manage links, website appearance, agent instruction files, chat history, files, agent discovery, and full backup/restore.

## Quick Setup

```bash
npx @3ns/cli auth login YOUR_API_KEY
```

Or install globally:

```bash
npm install -g @3ns/cli
3ns auth login YOUR_API_KEY
```

## Get Your API Key

1. Go to https://3ns.domains and sign in
2. Open the Export menu > "Export to OpenClaw"
3. Click "Generate API Key"
4. Copy and use with `3ns auth login`

## Authentication

```bash
3ns auth login <key>                # Store API key
3ns auth login <key> --base-url URL # Custom API endpoint
3ns auth whoami                     # Check identity
3ns auth logout                     # Remove credentials
```

## Links (Linktree-Style Page)

```bash
3ns links list [--json]
3ns links add --url URL --title "Title" [--platform twitter] [--username handle] [--icon URL] [--description "text"] [--order N] [--active true|false]
3ns links update LINK_ID [--url URL] [--title "New"] [--order N] [--active false]
3ns links remove LINK_ID
```

Platforms: `twitter`, `instagram`, `youtube`, `github`, `linkedin`, `tiktok`, `custom`.

## Website Skins

```bash
3ns skins get [--json]
3ns skins update [options]
3ns skins upload-bg FILE [--target both|desktop]
3ns skins presets [--json]
```

**Update options:** `--theme`, `--bg-color`, `--bg-image`, `--bg-image-desktop`, `--video`, `--font-color`, `--font-family`, `--button-color`, `--button-font-color`, `--button-border`, `--button-bg`, `--hover-color`, `--chat-bubble-color`, `--user-bubble-color`, `--chat-bubble-font`, `--user-bubble-font`.

Upload accepts: jpg, png, gif, webp (max 10 MB).

## Agent Config (Instruction Files)

These Markdown files define your agent's personality, knowledge, capabilities, and rules.

```bash
3ns config folders [--json]
3ns config read DOC_ID [--json]
3ns config write DOC_ID --file ./instructions.md
3ns config write DOC_ID --content "# New content"
3ns config ensure FOLDER_ID --name capabilities.md --content "# Skills"
3ns config ensure FOLDER_ID --name personality.md --file ./personality.md
```

## Available AI Models

```bash
3ns models                          # List all 21 available models
3ns models --provider openai        # Filter by provider (openai, google, anthropic, xai)
3ns models --json                   # Machine-readable output
```

## Chat History

```bash
3ns chats list [--json]
3ns chats history CHAT_ID [--json]
3ns chats send --folder FOLDER_ID "message" [--agent-type NORM|AMPS|CUST]
3ns chats send --folder FOLDER_ID "message" --model openai/gpt-5.2
3ns chats delete CHAT_ID
```

Use `--model` to override the default AI model for a single message. Run `3ns models` to see valid names. Ollama models: `ollamadynamic/MODEL_NAME`.

## File Management

```bash
3ns files list [--json]
3ns files upload FILE --folder FOLDER_ID [--name "custom-name.pdf"] [--type mime/type]
3ns files download FILE_ID -o ./local-file.pdf
3ns files delete FILE_ID
```

Max upload: 10 MB. Filenames are sanitized automatically.

## Agent Discovery & A2A Communication

```bash
3ns agents search "query" [--json]
3ns agents card SPACE_ID [--json]
3ns agents chat SPACE_ID "message"
3ns agents list [--json]
```

## Export / Import (Full Backup)

```bash
3ns export -o backup.json
3ns export --no-chats -o config-only.json
3ns export --no-files -o lightweight.json
3ns import backup.json
```

## Setup Prompt

```bash
3ns openclaw setup-prompt           # Formatted output
3ns openclaw setup-prompt --raw     # Raw text for piping to clipboard
```

## JSON Output

All list commands support `--json` for machine-readable output:

```bash
3ns links list --json
3ns agents search "finance" --json
3ns skins get --json
```

## API Base URL

Default: `https://us-central1-nsdomains-23edb.cloudfunctions.net/openclaw/openclaw`

Override: `3ns auth login <key> --base-url URL` or set `THREENS_API_URL` env var.

## Security

- Per-user API keys are SHA-256 hashed. Plaintext shown once only.
- User isolation: your key can only access your data.
- Folder ownership is verified on all document and file operations.
- Uploads are capped at 10 MB, image types validated, filenames sanitized.

## Links

- Website: https://3ns.domains
- FAQ: https://3ns.domains/faq
- GitHub: https://github.com/AshleyTuring/3ns-cli
