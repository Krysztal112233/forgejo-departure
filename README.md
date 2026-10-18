# forgejo-departure

A departure-board theme for [Forgejo](https://forgejo.org): faded
industrial paper by day, night terminal after dark. Zero radii, 2px ink lines,
hard offset shadows, graph-paper grid, blinking block cursor. All monospace,
all square.

Plain CSS: Tailwind v4 tokens in, three `theme-*.css` files out, loaded through
Forgejo's custom-theme hook. No template overrides. Themed: nav, panels, tabs,
popovers, tooltips, code and diff views, syntax colours, the heatmap,
scrollbars.

## Installation

See [INSTALL.md](INSTALL.md).

> [!NOTE]
>
> The theme currently targets Forgejo 17 only - the image tag pinned in `compose.yml`.
>
> See [upstream drift](#upstream-drift) before running it on any other version.

## Themes

- `departure-auto` - default, follows `prefers-color-scheme`
- `departure-light` - departure board on faded paper
- `departure-dark` - night terminal

Pick one in `Site Administration > Configuration > Appearance`, or per user in
`Settings > Appearance`.

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for the local test instance, the
rebuild loop and the release flow.

## Upstream drift

Forgejo explicitly does not support custom themes, and its CSS variables carry
no portability guarantee - not even across patch releases. Before bumping the
image tag, diff `web_src/css/themes/theme-forgejo-{light,dark}.css` at the new
tag against `src/_{light,dark}.css`. v17's oklch `--color-thin-*` layer is not
overridden here, so anything driven by it keeps upstream colours.

## License

- Project under the MIT - see [LICENSE](./LICENSE)
- IBM Plex Mono ships under the OFL 1.1 - see [LICENSE](./public/OFL-ibm-plex-mono.txt)
