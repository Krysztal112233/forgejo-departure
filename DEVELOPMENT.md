# Development

Working on the theme itself: a throwaway Forgejo to develop against, the
rebuild loop, and the release flow.

## Test instance

`compose.yml` runs a throwaway Forgejo with the built theme mounted in - for
working on the theme, not a deployment recipe.

```sh
pnpm setup     # forgejo/app.ini with fresh instance secrets
pnpm up        # http://localhost:3030
```

The first account becomes admin; then set `DISABLE_REGISTRATION = true` in
`forgejo/app.ini`. Registration already closed? Create users with
`podman exec -it forgejo-departure forgejo admin user create ...`.

`forgejo/app.ini` is gitignored because it holds per-instance secrets, and
`pnpm setup` never overwrites an existing file.

## Develop

Start from `src/_tokens.css` (palette and type scale); `src/_effects.css`
holds the shared structural styles (geometry, grid, shadows, tabs, popovers,
code).

`pnpm watch` rebuilds `dist/`; hard-refresh the browser (Ctrl+Shift+R) after a
build. Restart only for `forgejo/app.ini` changes. `pnpm logs` follows the test
container, `pnpm down` stops it.

Build fails with EACCES on `dist/`? The container chowned it on first init:
`podman unshare chown -R 0:0 dist`.
