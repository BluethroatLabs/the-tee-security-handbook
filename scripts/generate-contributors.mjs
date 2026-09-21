import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(
  readFileSync(resolve(root, 'contributors.config.json'), 'utf8')
)
const versionFlagIndex = process.argv.indexOf('--version')
const snapshotVersion =
  versionFlagIndex === -1 ? null : process.argv[versionFlagIndex + 1]

if (snapshotVersion && !/^[a-zA-Z0-9._-]+$/.test(snapshotVersion)) {
  throw new Error(`Invalid documentation version: ${snapshotVersion}`)
}

const contentRoot = snapshotVersion
  ? `versioned_docs/version-${snapshotVersion}`
  : 'docs'
const jsonOutputPath = resolve(
  root,
  contentRoot,
  '_generated/contributors.json'
)
const moduleOutputPath = resolve(
  root,
  contentRoot,
  '_generated/contributors.ts'
)
const excluded = new Set(config.exclude ?? [])

function git(args, fallback = '') {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return fallback
  }
}

function contributorKey(email, name) {
  const normalizedEmail = email.trim().toLowerCase()
  const profile = config.contributors.find((candidate) =>
    candidate.emails.some(
      (alias) => alias.trim().toLowerCase() === normalizedEmail
    )
  )
  return (
    profile?.emails[0].toLowerCase() ?? normalizedEmail ?? name.toLowerCase()
  )
}

function emptyStats() {
  return {
    commits: new Set(),
    additions: 0,
    deletions: 0,
    currentLines: 0,
    lastContribution: null,
  }
}

const stats = new Map()
const identities = new Map()

function ensureContributor(email, name) {
  const key = contributorKey(email, name)
  if (!stats.has(key)) stats.set(key, emptyStats())
  if (!identities.has(key)) identities.set(key, { name, email })
  return { key, value: stats.get(key) }
}

const docs = git([
  'ls-files',
  'docs/**/*.md',
  'docs/**/*.mdx',
  'docs/*.md',
  'docs/*.mdx',
])
  .split('\n')
  .filter(Boolean)
  .filter((file) => !excluded.has(file))

for (const file of docs) {
  const log = git([
    'log',
    '--follow',
    '--format=@@@%H%x09%aN%x09%aE%x09%aI',
    '--numstat',
    '--',
    file,
  ])
  let currentCommit = null

  for (const line of log.split('\n')) {
    if (line.startsWith('@@@')) {
      const [sha, name, email, date] = line.slice(3).split('\t')
      currentCommit = { sha, name, email, date }
      continue
    }

    const match = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/)
    if (!match || !currentCommit) continue

    const { key, value } = ensureContributor(
      currentCommit.email,
      currentCommit.name
    )
    value.commits.add(currentCommit.sha)
    value.additions += match[1] === '-' ? 0 : Number(match[1])
    value.deletions += match[2] === '-' ? 0 : Number(match[2])
    if (
      !value.lastContribution ||
      currentCommit.date > value.lastContribution
    ) {
      value.lastContribution = currentCommit.date
    }
    stats.set(key, value)
  }
}

for (const file of docs) {
  const blame = git(['blame', 'HEAD', '--line-porcelain', '--', file])
  let author = ''
  let email = ''
  for (const line of blame.split('\n')) {
    if (line.startsWith('author ')) author = line.slice(7)
    if (line.startsWith('author-mail ')) {
      email = line.slice(12).replace(/^<|>$/g, '')
    }
    if (line.startsWith('\t')) {
      const { value } = ensureContributor(email, author)
      value.currentLines += 1
    }
  }
}

for (const profile of config.contributors) {
  ensureContributor(profile.emails[0], profile.name)
}

function profileOrder(key) {
  const index = config.contributors.findIndex(
    (candidate) => candidate.emails[0].toLowerCase() === key
  )
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function configuredProfile(key) {
  return config.contributors.find(
    (candidate) => candidate.emails[0].toLowerCase() === key
  )
}

function initialValue(profile, field) {
  return Math.max(0, Number(profile?.initialContribution?.[field]) || 0)
}

const publishedEntries = [...stats.entries()].filter(([key]) => {
  const profile = configuredProfile(key)
  return (
    profile?.hidden !== true &&
    (profile !== undefined || config.includeUnlistedContributors === true)
  )
})
const totalCurrentLines = publishedEntries.reduce(
  (sum, [key, value]) =>
    sum +
    value.currentLines +
    initialValue(configuredProfile(key), 'currentLines'),
  0
)

const contributors = publishedEntries
  .map(([key, value]) => {
    const profile = configuredProfile(key)
    const identity = identities.get(key)
    const currentLines =
      value.currentLines + initialValue(profile, 'currentLines')
    const initialDate = profile?.initialContribution?.lastContribution ?? null
    const lastContribution =
      initialDate &&
      (!value.lastContribution || initialDate > value.lastContribution)
        ? initialDate
        : value.lastContribution
    return {
      name: profile?.name ?? identity.name,
      avatar: profile?.avatar ?? null,
      tags: profile?.tags ?? ['Contributor'],
      about: profile?.about ?? null,
      links: profile?.links ?? {},
      hideStats: profile?.hideStats === true,
      commits: value.commits.size + initialValue(profile, 'commits'),
      additions: value.additions + initialValue(profile, 'additions'),
      deletions: value.deletions + initialValue(profile, 'deletions'),
      currentLines,
      currentLineShare:
        totalCurrentLines === 0
          ? 0
          : Math.round((currentLines / totalCurrentLines) * 1000) / 10,
      lastContribution,
      profileOrder: profileOrder(key),
    }
  })
  .sort(
    (a, b) =>
      b.currentLines - a.currentLines ||
      b.commits - a.commits ||
      a.profileOrder - b.profileOrder ||
      a.name.localeCompare(b.name)
  )
  .map(({ profileOrder: _profileOrder, ...contributor }) => contributor)

const lastCommit = git(['log', '-1', '--format=%aI', '--', ...docs]) || null
const documentationCommits = new Set(
  [...stats.values()].flatMap((value) => [...value.commits])
).size
const payload = {
  generatedAt: lastCommit,
  lastContribution: lastCommit,
  repositoryUrl: config.repositoryUrl,
  isShallowRepository: git(['rev-parse', '--is-shallow-repository']) === 'true',
  scope: {
    documents: docs.length,
    currentLines: totalCurrentLines,
    commits: documentationCommits,
  },
  contributors,
}

const serializedPayload = JSON.stringify(payload, null, 2)
mkdirSync(dirname(jsonOutputPath), { recursive: true })
writeFileSync(jsonOutputPath, `${serializedPayload}\n`)
writeFileSync(
  moduleOutputPath,
  `// Generated by scripts/generate-contributors.mjs. Do not edit.\nconst contributors = ${serializedPayload} as const\n\nexport default contributors\n`
)
console.log(
  `Generated ${relative(root, jsonOutputPath)} and ${relative(root, moduleOutputPath)} from ${docs.length} documents.`
)
