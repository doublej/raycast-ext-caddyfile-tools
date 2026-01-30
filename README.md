# Caddyfile Tools

Raycast extension to manage a Caddyfile on a remote NAS via local mount or SSH fallback.

## Features

- Open Caddyfile in your editor (local mount or SSH fallback)
- Generate passwords using a NAS-side script
- Apply Caddyfile changes from Mac to NAS

## Commands

| Command | Description |
|---------|-------------|
| Open Caddyfile | Open Caddyfile in editor (local mount or SSH fallback) |
| Generate Password (NAS) | Run password generation script on NAS |
| Apply Caddyfile | Apply Caddyfile changes from Mac to NAS |

## Preferences

| Name | Description | Required |
|------|-------------|----------|
| SSH Target | SSH target for NAS (e.g. `admin@nas.local`) | Yes |
| Remote Caddy Etc | Remote caddy config directory | No |
| Local Mount | Local mount point for the share | No |
| Editor Command | Editor to open Caddyfile with | No |

## Install

```bash
bun install
bun run build
bun run dev
```

## License

MIT
