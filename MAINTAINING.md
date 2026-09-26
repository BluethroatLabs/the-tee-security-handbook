# Documentation Maintainer Guide

This runbook is for maintainers of the TEE Security Handbook. Its primary scope
is editorial review, documentation releases, backports, and contributor
attribution. The final section covers the additional checks needed for changes
to the Docusaurus site and its scripts.

## Repository model

Keep these boundaries clear during every review:

| Path                                         | Purpose                                          | Normal maintenance policy                               |
| -------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `docs/`                                      | Source for the current handbook                  | Edit here for routine content work                      |
| `sidebars.ts`                                | Navigation for `docs/`                           | Update when pages are added, moved, renamed, or removed |
| `contributors.config.json`                   | Human-maintained contributor profiles            | Review identity and profile claims                      |
| `docs/_generated/`                           | Current contributor data generated at build time | Never edit or commit                                    |
| `versioned_docs/version-X/`                  | Frozen snapshot of release `X`                   | Change only for an approved backport                    |
| `versioned_sidebars/version-X-sidebars.json` | Frozen navigation for release `X`                | Change only with the matching versioned content         |
| `versions.json`                              | Docusaurus's ordered list of snapshots           | Normally changed only by version pinning                |
| `docusaurus.config.ts`                       | Site and version-label configuration             | Update deliberately during a release                    |

The repository sets `lastVersion: 'current'`. As a result, `docs/` is the
default handbook served at the site root, while pinned snapshots remain
available from the version dropdown.

## Triage before review

Determine which kind of pull request you are reviewing:

1. A routine correction to the current handbook.
2. A new page or a structural content change.
3. A deliberately requested backport to an older release.
4. A version-pinning pull request.
5. A site, component, dependency, configuration, or script change.

The classification controls which files are expected. In particular, a routine
documentation pull request that changes both `docs/` and `versioned_docs/`
usually needs revision. Ask the author to remove the snapshot edits unless the
pull request names the older release and explains why it must change.

## Review documentation pull requests

### Scope and repository hygiene

- Confirm that the pull request has one coherent purpose and targets the correct
  base branch.
- Compare the changed files with the repository model above. Reject committed
  build output, installed dependencies, `.docusaurus/`, `build/`, and current
  generated contributor files.
- For a new, renamed, moved, or removed page, confirm that `sidebars.ts` and all
  affected links are updated. Check for duplicate document IDs and slugs.
- Watch for accidental broad changes caused by `yarn format`, especially because
  handbook and version snapshot directories are intentionally excluded from the
  repository's Prettier pass.

### Technical and editorial accuracy

- Verify security-sensitive claims against primary sources. Confirm that the
  cited source supports the exact claim, platform, configuration, and timeframe.
- Check the stated threat model and trust boundaries. Require the author to
  distinguish verified attacks, plausible abuse paths, implementation mistakes,
  and defense-in-depth advice.
- Challenge absolutes such as “secure,” “impossible,” and “eliminates” unless
  they are tightly scoped and supported.
- Check names, acronyms, product versions, dates, URLs, code, and command-line
  flags. Prefer durable source links over marketing summaries.
- Ensure examples contain no real secrets or personal data and cannot cause
  surprising destructive or production behavior when copied.
- Read the surrounding section, not only the diff. Look for contradictions,
  duplicated guidance, broken narrative flow, and claims elsewhere that the
  change makes stale.
- Preserve a direct and readable voice. A valuable edit should improve accuracy,
  clarity, coverage, or navigation—not merely replace words with synonyms.

### Rendering and accessibility

- Confirm front matter and MDX syntax are valid and imports resolve.
- Check heading hierarchy, table width, syntax highlighting, admonitions, and
  previous/next navigation.
- Require useful alternative text for informative images; decorative images
  should not be redundantly announced.
- For visual changes, inspect representative desktop and mobile widths, keyboard
  navigation, focus visibility, light/dark themes, and reduced motion where
  applicable.

### Contributor profiles and attribution

When `contributors.config.json` changes:

- Keep `includeUnlistedContributors` set to `false` unless the project
  intentionally changes its publication policy. When it is `false`, only
  profiles in the `contributors` array can appear on the contributors page.
- Confirm the name, biography, roles, avatar, and public links are accurate and
  appropriate for publication.
- Confirm `emails` contains the Git author email used by the contributor. Email
  aliases are the key by which the generator combines identities.
- Do not accept self-awarded historical statistics. `initialContribution` is for
  known work predating this repository and requires maintainer verification.
- Use `hideStats: true` for people credited for review or support without
  tracked documentation commits. Use `hidden: true` only when the profile should
  not be published.
- Check that the author has not edited generated contributor files. The build
  regenerates current data; pinned generated data is a release snapshot.

Contribution statistics reflect repository activity, not the importance or
quality of the work. Do not use them as a reason to accept, reject, or rank a
contribution.

### Required validation

Authors should normally run:

```sh
yarn build
```

As reviewer, inspect the deployment preview when available. For substantial
changes, reproduce the build locally and visit every affected route. A green
build is necessary but does not replace source verification or a rendered-page
review.

Before merge, confirm all material review conversations are addressed, required
checks pass, and the final commit author identity maps correctly when the
contributor has requested a public profile. Use the repository's configured
merge method and retain a clear pull request title and description for history.

## Pin a documentation version

Pinning creates a permanent snapshot of the entire current handbook. It is a
release operation, not a way to preview work or preserve a branch.

### 1. Prepare the release

- Agree on the version name and the next version label. Follow the existing
  numbering scheme; do not include a `version-` prefix in the command.
- Finish and merge the intended release content first. Pin from a clean branch
  at the exact commit being released so contributor history and copied content
  are reproducible.
- Ensure the clone has complete Git history. The contributor generator uses Git
  log and blame; a shallow clone can produce incomplete attribution.
- Confirm all current pages are present in `sidebars.ts`, source links work, and
  `yarn build` succeeds.
- Search for the proposed name in `versions.json` and `versioned_docs/`. The
  command is for a new version and must not overwrite an existing snapshot.

### 2. Create the snapshot

Run the repository wrapper, replacing `X.Y` with the approved version:

```sh
yarn version:pin X.Y
```

The wrapper first generates current contributor data and then invokes
Docusaurus's `docs:version` command. Docusaurus:

- copies `docs/` to `versioned_docs/version-X.Y/`;
- snapshots `sidebars.ts` as `versioned_sidebars/version-X.Y-sidebars.json`; and
- adds `X.Y` to `versions.json`.

Do not hand-copy these directories. Do not make editorial improvements inside
the new snapshot during this step; fix `docs/`, validate it, and recreate the
snapshot before it is merged if the release content was wrong.

### Worked example: advance the handbook to 0.2

Assume `docs/` contains the finished `0.1` handbook and there is no existing
`0.1` snapshot. First validate the release, then pin the content that is about
to become the old version:

```sh
yarn version:pin 0.1
```

This creates `versioned_docs/version-0.1/`,
`versioned_sidebars/version-0.1-sidebars.json`, and a `versions.json` entry for
`0.1`. The unversioned `docs/` directory remains the editable current handbook.
Update its displayed version to `0.2` as described below.

The argument to `version:pin` names the version being frozen, not the new
current version. To freeze the current handbook as `0.2`, run
`yarn version:pin 0.2` and then advance the current label to the next approved
version, such as `0.3`.

### 3. Advance the current version configuration

After pinning, update both version displays in `docusaurus.config.ts`:

1. Change `presets[0][1].docs.versions.current.label` to the next current
   handbook version.
2. In the navbar's `docsVersionDropdown.versions` object, change the `current`
   label to the same next version plus `(Latest)`.
3. Add the newly pinned version to that navbar object, ordered between `current`
   and older releases. This is required because the repository supplies an
   explicit dropdown subset.

For the worked example above, after pinning `0.1` and beginning `0.2`, the
relevant labels should read:

```ts
// Docs plugin
versions: { current: { label: '0.2' } }

// Navbar dropdown
versions: {
  current: { label: '0.2 (Latest)' },
  0.1: { label: '0.1' },
}
```

Keep `lastVersion: 'current'` unless the release policy itself is intentionally
changing. The `versions.json` list must remain newest to oldest.

### 4. Verify the release diff and site

Run:

```sh
git status --short
yarn build
yarn serve
```

Verify that:

- the new `versioned_docs/version-X.Y/` tree matches the release state of
  `docs/`, including contributor data and static asset references.
- the versioned sidebar contains every page expected in that snapshot.
- `versions.json` contains the new version exactly once and in the right order.
- the dropdown shows current, the new snapshot, and supported older snapshots.
- representative pages work in both current and newly pinned versions.
- switching versions keeps readers on the equivalent page where document IDs
  match.

Review and commit the snapshot, version list, sidebar snapshot, and
configuration changes together. Record the source commit and release version
clearly in the pull request or release notes.

## Backport a correction to a pinned version

Version snapshots are immutable by default. A backport is appropriate only when
the older page remains materially wrong or unsafe for readers of that version,
such as a factual security correction, dangerous command, broken critical link,
or disclosure that applies retrospectively. Editorial polish and new coverage
normally belong only in `docs/`.

For an approved backport:

1. Name every affected version in the issue and pull request.
2. Make the smallest possible edit in each exact `versioned_docs/version-X/`
   directory.
3. If the backport adds, removes, or moves a page, update only the matching
   `versioned_sidebars/version-X-sidebars.json` as well.
4. Preserve that version's document IDs, URLs, terminology, capabilities, and
   historical context. Do not copy the current page wholesale if the versions
   have diverged.
5. Do not regenerate the pinned contributor data; it is part of the snapshot.
6. Build the whole site and preview the changed version-specific route.

State in the merge record why snapshot immutability was overridden. If the
correction also applies to the current handbook, update `docs/` deliberately in
the same pull request or open a tracked follow-up.

## Maintain the site and tooling

Code, configuration, and dependency pull requests need their own review in
addition to the documentation checks:

- Keep the Node.js requirement, exact Docusaurus package versions, Yarn
  lockfile, and deployment environment compatible.
- Review `yarn.lock` changes for the intended packages only and read upstream
  migration notes before Docusaurus major or minor upgrades.
- Test contributor generation with normal and shallow-history conditions. The
  production build attempts to unshallow the clone so published statistics use
  complete history.
- Treat `scripts/generate-contributors.mjs` as attribution logic: test identity
  aliases, exclusions, configured-only filtering, hidden profiles, initial
  values, sorting, renames, binary files, and empty history when changing it.
- For React or CSS changes, review semantics, keyboard and screen-reader output,
  failure states (including unavailable avatars), responsive layouts, theme
  contrast, and performance.
- Keep changes to deployment configuration, domains, analytics, external
  services, or permissions in a focused pull request with an explicit rollback
  plan.

## Periodic maintenance

- Review external sources and platform claims for staleness, especially after
  vendor advisories, hardware revisions, and threat-model changes.
- Check for broken links, missing assets, rendering warnings, and orphaned
  pages.
- Keep contributor profiles accurate when a person requests a correction or
  removal; minimize published personal information.
- Review supported documentation versions and mark or retire versions according
  to an explicit support policy.
- Update this runbook whenever release scripts, branch protections, deployment,
  or attribution behavior changes.

## Reference documentation

- [Docusaurus: Versioning](https://docusaurus.io/docs/versioning)
- [Docusaurus: Sidebar](https://docusaurus.io/docs/sidebar)
- [Docusaurus: Theme configuration](https://docusaurus.io/docs/api/themes/configuration/)
