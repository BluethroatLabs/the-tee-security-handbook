import Link from '@docusaurus/Link'
import styles from './styles.module.css'

type LinkKind = 'email' | 'github' | 'x' | 'telegram'

type Contributor = {
  readonly name: string
  readonly avatar: string | null
  readonly tags: readonly string[]
  readonly about: string | null
  readonly links: Readonly<Record<string, string>>
  readonly hideStats: boolean
  readonly commits: number
  readonly additions: number
  readonly deletions: number
  readonly currentLines: number
  readonly currentLineShare: number
  readonly lastContribution: string | null
}

type ContributorData = {
  readonly repositoryUrl: string
  readonly isShallowRepository: boolean
  readonly scope: { readonly documents: number }
  readonly contributors: readonly Contributor[]
}

const linkLabels: Record<LinkKind, string> = {
  email: 'Email',
  github: 'GitHub',
  x: 'X',
  telegram: 'Telegram',
}

function formatDate(value: string | null) {
  if (!value) return null
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Avatar({ contributor }: { contributor: Contributor }) {
  return (
    <div className={styles.avatar}>
      <span aria-hidden="true">{initials(contributor.name)}</span>
      {contributor.avatar && (
        <img
          src={contributor.avatar}
          alt=""
          loading="lazy"
          width="512"
          height="512"
          onError={(event) => {
            event.currentTarget.hidden = true
          }}
        />
      )}
    </div>
  )
}

function Tags({ contributor }: { contributor: Contributor }) {
  return (
    <ul className={styles.tags} aria-label={`${contributor.name} roles`}>
      {contributor.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}

function ContributorLinks({ contributor }: { contributor: Contributor }) {
  if (Object.keys(contributor.links).length === 0) return null

  return (
    <nav className={styles.links} aria-label={`${contributor.name} links`}>
      {Object.entries(contributor.links).map(([kind, href]) => (
        <Link key={kind} href={href}>
          {linkLabels[kind as LinkKind] ?? kind}
        </Link>
      ))}
    </nav>
  )
}

const getGithubUsername = (githubLink = '') => {
  if (!githubLink) return undefined
  return githubLink?.split('/')?.at(-1)
}

function ActiveContributor({
  contributor,
  repoLink,
}: {
  contributor: Contributor
  repoLink: string
}) {
  const lastContribution = formatDate(contributor.lastContribution)
  const githubUsername = getGithubUsername(contributor.links.github)
  const contributionLink = githubUsername
    ? repoLink + '/pulls?q=is%3Apr+author%3A' + githubUsername
    : undefined

  return (
    <article className={styles.activePerson}>
      <header className={styles.personHeader}>
        <Avatar contributor={contributor} />
        <div className={styles.identity}>
          <h2>{contributor.name}</h2>
          <Tags contributor={contributor} />
        </div>
      </header>

      {contributor.about && <p className={styles.about}>{contributor.about}</p>}

      <div className={styles.contribution}>
        <div className={styles.shareLine}>
          <p>
            <strong>{contributor.currentLineShare}%</strong>
            {/* <span>current ownership</span> */}
          </p>
          {/* <span>{contributor.currentLines.toLocaleString()} lines</span> */}
          {!!contributionLink && (
            <span className={styles.links}>
              <Link href={contributionLink} target="_blank">
                See Contribution
              </Link>
            </span>
          )}
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-label={`${contributor.name}'s share of current source lines`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={contributor.currentLineShare}
        >
          <span style={{ width: `${contributor.currentLineShare}%` }} />
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Commits</dt>
            <dd>{contributor.commits}</dd>
          </div>
          <div>
            <dt>Added</dt>
            <dd className={styles.added}>
              +{contributor.additions.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt>Removed</dt>
            <dd className={styles.removed}>
              −{contributor.deletions.toLocaleString()}
            </dd>
          </div>
        </dl>
        {lastContribution && (
          <p className={styles.lastActive}>Last active {lastContribution}</p>
        )}
      </div>

      <ContributorLinks contributor={contributor} />
    </article>
  )
}

function ProfileContributor({ contributor }: { contributor: Contributor }) {
  return (
    <li className={styles.profilePerson}>
      <Avatar contributor={contributor} />
      <div className={styles.profileIdentity}>
        <h3>{contributor.name}</h3>
        <Tags contributor={contributor} />
        {contributor.about && (
          <p className={styles.profileAbout}>{contributor.about}</p>
        )}
        <ContributorLinks contributor={contributor} />
      </div>
    </li>
  )
}

export default function Contributors({ data }: { data: ContributorData }) {
  const activeContributors = data.contributors.filter(
    (contributor) =>
      !contributor.hideStats &&
      (contributor.commits > 0 || contributor.currentLines > 0)
  )
  const profileContributors = data.contributors.filter(
    (contributor) => !activeContributors.includes(contributor)
  )

  return (
    <section className={styles.directory} aria-labelledby="contributors-title">
      {data.isShallowRepository && (
        <aside className={styles.warning}>
          This build used a shallow clone. Older activity may be missing.
        </aside>
      )}

      <div className={styles.activePeople}>
        {activeContributors.map((contributor) => (
          <ActiveContributor
            key={contributor.name}
            contributor={contributor}
            repoLink={data.repositoryUrl}
          />
        ))}
      </div>

      {profileContributors.length > 0 && (
        <section className={styles.support} aria-labelledby="support-title">
          <header>
            <h2 id="support-title">Review and support</h2>
            <p>Proofreading, feedback, and specialist review.</p>
          </header>
          <ul className={styles.profilePeople}>
            {profileContributors.map((contributor) => (
              <ProfileContributor
                key={contributor.name}
                contributor={contributor}
              />
            ))}
          </ul>
        </section>
      )}

      <details className={styles.methodology}>
        <summary>How contribution numbers are calculated</summary>
        <div>
          <p>
            <strong>Current ownership</strong> uses Git blame. Commits,
            additions, and removals come from file history, including renames.
            Initial values for work completed before this repository are added
            to those totals.
          </p>
          <p>
            These numbers describe repository activity, not the quality or
            importance of a person’s work. This page and generated files are
            excluded.
          </p>
          <Link href={`${data.repositoryUrl}/commits`}>
            View complete history on GitHub <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </details>
    </section>
  )
}
