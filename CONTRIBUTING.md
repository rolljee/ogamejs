# Contributing

Thanks for taking the time to contribute! 🚀

## Getting started

```bash
git clone https://github.com/rolljee/ogamejs.git
cd ogamejs
npm install
```

Requires **Node.js >= 24** (see `.nvmrc`).

## Workflow

1. Create a branch off `master` (e.g. `feat/fusion-tweak` or `fix/debris-rounding`).
2. Make your change and add or update tests next to the code (`*.test.js`).
3. Make sure everything passes locally:
   ```bash
   npm run lint
   npm test
   ```
4. Commit using **[Conventional Commits](https://www.conventionalcommits.org/)** — the version and changelog are derived from them. You can use the interactive helper:
   ```bash
   npm run commit
   ```
5. Open a pull request against `master`. CI runs lint and tests on every PR.

## Commit conventions

Commit messages drive automated releases via semantic-release:

| Prefix                                         | Effect                                  |
| ---------------------------------------------- | --------------------------------------- |
| `fix:`                                         | patch release (e.g. `1.0.0` → `1.0.1`)  |
| `feat:`                                        | minor release (e.g. `1.0.0` → `1.1.0`)  |
| `feat!:` / `BREAKING CHANGE:` footer           | major release (e.g. `1.0.0` → `2.0.0`)  |
| `chore:`, `docs:`, `ci:`, `test:`, `refactor:` | no release                              |

## Releases

You never bump the version or edit `CHANGELOG.md` by hand. Once a PR is merged:

- **`master`** → stable release published to npm,
- **`develop`** → pre-release published to npm.

Everything (version, changelog, git tag, GitHub release, npm publish) is handled by CI.
