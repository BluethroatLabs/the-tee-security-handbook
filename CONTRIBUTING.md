# Contributing to the TEE Security Handbook

Thank you for helping make the handbook more accurate, practical, and useful.
Contributions can include technical corrections, clearer explanations, new
platform coverage, diagrams, source updates, proofreading, and improvements to
the documentation site.

## Before you begin

- Search the open issues and pull requests to avoid duplicating work.
- Open an issue before making a large addition, reorganizing several pages, or
  changing the site, scripts, or versioned documentation. This lets maintainers
  agree on scope and placement before substantial work begins.
- For a focused correction or typo fix, you may open a pull request directly.
- Do not include confidential information, credentials, private vulnerability
  details, or personal data that you are not authorized to publish.

## Set up the site locally

This project requires Node.js 20 or newer and uses Yarn.

```sh
git clone https://github.com/BluethroatLabs/the-tee-security-handbook.git
cd the-tee-security-handbook
yarn install
yarn dev
```

Use a fork if you do not have write access. Create a focused branch from the
repository's default branch (or from the base branch named in the issue), and
keep unrelated changes in separate pull requests.

## Editing handbook content

### Work in `docs/`

For normal handbook changes, edit only the source pages under `docs/`. These
files are the current version of the handbook.

Do **not** make the same edit in `versioned_docs/` or `versioned_sidebars/`.
Those directories are frozen snapshots of earlier releases. They should change
only when a maintainer has explicitly approved a backport because the correction
must also appear in a particular older version.

### Add, rename, or remove a page

The sidebar is maintained explicitly. When adding a new page:

1. Add the `.md` or `.mdx` file in the appropriate location under `docs/`.
2. Give it clear front matter, including a unique `title` and a stable `slug`
   when the page needs an intentional URL.
3. Add its document ID to `sidebars.ts` in the appropriate reading order.
4. Add referenced images under `static/img/` and provide meaningful alternative
   text when the image conveys content.

Renaming or removing a page also requires updating `sidebars.ts` and any links
to that page. Discuss large renumbering or navigation changes with a maintainer
first because document IDs must remain consistent across versions for reliable
version switching.

### Write security guidance carefully

- Prefer primary sources, such as vendor documentation, specifications,
  advisories, and research papers. Link the source close to the claim it
  supports.
- Check that links resolve and that quoted or paraphrased material is
  attributed.
- State assumptions, affected versions, dates, and threat models where they
  matter. Avoid presenting a platform-specific property as universal to all
  TEEs.
- Distinguish a confirmed vulnerability from a theoretical attack, an
  implementation risk, or a defense-in-depth recommendation.
- Make examples safe to copy. Use unmistakably fake keys, domains, accounts, and
  identifiers, and call out destructive or production-sensitive commands.
- Preserve the handbook's direct, practitioner-oriented voice. Define uncommon
  acronyms on first use and use headings and short paragraphs to keep dense
  material readable.

MDX files may contain imports and React components. Preserve the existing front
matter, `PageBanner`, and component structure unless your change intentionally
updates them.

## Adding yourself to the contributors page

The contributors page combines Git history with profiles in
`contributors.config.json`. If this is your first contribution and you want a
profile displayed, add yourself to the `contributors` array in that file. The
repository sets `includeUnlistedContributors` to `false`, so Git authors who do
not have a configured profile are not published. Do not change this flag as
part of adding or updating an individual profile.

Use accurate, verifiable information:

- `name`: the name you want displayed.
- `emails`: every Git author email that should map your commits to this profile.
  Put your preferred address first. At least one address is required, and the
  address used for your commits must appear here for attribution to work.
- `avatar`: an optional HTTPS image URL. A GitHub avatar can use
  `https://github.com/USERNAME.png?size=192`.
- `tags`: short, factual roles or areas of contribution, such as `Contributor`,
  `Research`, `Security`, or `Proofreader`.
- `about`: an optional brief, factual description.
- `links`: optional public links. The site has labels for `email`, `github`,
  `x`, and `telegram`; use a `mailto:` URL for email.
- `hidden`: set this to `false` if the profile should appear.
- `hideStats`: set this to `true` when the profile should be listed without Git
  activity statistics, such as for review or proofreading support.

Do not invent credentials, roles, contribution numbers, or links. Do not change
another person's profile without their permission. Inaccurate or unverifiable
profile information may block the pull request until it is corrected.

The `initialContribution` object records work that predates this repository. It
is maintained project data, not a self-reported score. Leave it unchanged (or
omit it for a new entry) unless a maintainer has approved specific historical
values.

Do not edit `docs/_generated/contributors.json` or
`docs/_generated/contributors.ts`. They are generated and ignored by Git. The
development and build commands regenerate them from Git history and
`contributors.config.json`.

## Site, component, and script changes

Changes outside handbook content are welcome when they support an agreed issue.
Keep them separate from large editorial changes where practical. Preserve
keyboard access, semantic markup, readable contrast, responsive behavior, and
reduced-motion preferences. Explain any behavior or dependency change in the
pull request.

Do not edit `.docusaurus/`, `build/`, or `node_modules/`; they are local build
artifacts or installed dependencies.

## Validate your change

Before opening or updating a pull request, run:

```sh
yarn build
```

Also preview affected pages with `yarn dev`. Check the following manually:

- the page renders without MDX errors;
- headings, tables, code blocks, notes, diagrams, and mobile layout are
  readable;
- sidebar placement and previous/next navigation are correct;
- internal links, external sources, and image paths work; and
- both light and dark themes remain usable when the change affects presentation.

`yarn format` rewrites files across the repository. If you use it, review the
diff and do not include unrelated formatting changes.

## Open a pull request

Keep commits and the final diff focused. In the pull request description:

- explain what changed and why.
- link the relevant issue, if one exists.
- identify the pages and versions affected.
- list the authoritative sources used for technical claims.
- report the validation you ran.
- include screenshots for visual changes.

Before requesting review, inspect `git diff` and `git status`. Remove unrelated
generated files and local artifacts. Respond to review comments with follow-up
commits or a clear explanation, and resolve conversations only after the concern
has been addressed.
