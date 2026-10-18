# Installation

The deployable unit is two directories - `css/` and `fonts/`, ~150KB in
total - landing side by side in Forgejo's custom assets directory
(`$FORGEJO_CUSTOM/public/assets/`, usually `/data/gitea/public/assets` in the
official container). The stylesheets reach the fonts through `../fonts/`, so
the side-by-side layout is mandatory. After the files are in place, register
the themes (below) and restart Forgejo.

## Option 1: release tarball

```sh
cd /path/to/custom/public/assets
curl -LO https://github.com/Krysztal112233/forgejo-departure/releases/latest/download/forgejo-departure.tar.gz
curl -LO https://github.com/Krysztal112233/forgejo-departure/releases/latest/download/SHA256SUMS.txt
sha256sum -c SHA256SUMS.txt   # -> forgejo-departure.tar.gz: OK
tar xzf forgejo-departure.tar.gz
```

`latest` always points at the newest release. To pin a specific version,
replace `latest/download` with `download/vX.Y.Z`.

## Option 2: init container (compose)

The release pipeline also publishes `ghcr.io/Krysztal112233/forgejo-departure`, an image
whose only payload is the theme at `/theme`.

A one-shot init container copies it into a shared volume before Forgejo starts:

```yaml
services:
  theme-init:
    image: ghcr.io/Krysztal112233/forgejo-departure:v0.1.0 # pin a tag; :latest tracks newest
    volumes:
      - forgejo-assets:/assets
    command: ["sh", "-c", "cp -rf /theme/. /assets/"]

  forgejo:
    image: codeberg.org/forgejo/forgejo:17
    depends_on:
      theme-init:
        condition: service_completed_successfully
    volumes:
      - forgejo-assets:/data/gitea/public/assets

volumes:
  forgejo-assets:
```

Works with podman-compose as well.

## Option 3: build from source

Needs Node 20.19+ (or 22.12+) and pnpm:

```sh
pnpm install
pnpm build        # emits dist/css/theme-departure-*.css + dist/fonts/
cp -r dist/css dist/fonts /path/to/custom/public/assets/
```

## Register the themes

In `app.ini`, add the departure themes and pick the default:

```ini
[ui]
THEMES = forgejo-auto,forgejo-light,forgejo-dark,departure-auto,departure-light,departure-dark
DEFAULT_THEME = departure-auto
```

Restart Forgejo, then pick the active theme as described in
[README: Themes](README.md#themes).

## Upgrading and downgrading

Re-run the option you installed with at the new version; the files overwrite
in place and a browser hard refresh picks them up - no Forgejo restart needed
for theme-file changes (only for `app.ini` changes). With the init container,
bumping the image tag and re-running `compose up -d` re-runs the copy.

Before bumping the Forgejo image itself, check
[README: upstream drift](README.md#upstream-drift) - Forgejo's CSS variables
carry no stability guarantee.

## Uninstall

Remove `css/theme-departure-*.css`, the four `fonts/ibm-plex-mono-*.woff2`
files and `fonts/OFL-ibm-plex-mono.txt` from the assets directory (remove
`fonts/` too if it held nothing else), drop the `departure-*` entries from
`THEMES`, and restart Forgejo.
