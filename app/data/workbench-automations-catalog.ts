export interface AutomationSection {
  id: string
  title: string
}

export interface AutomationCard {
  id: string
  sectionId: string
  body: string
  /** Iconify icon name */
  icon: string
}

export const automationSections: AutomationSection[] = [
  { id: 'status-reports', title: 'Status reports' },
  { id: 'release-prep', title: 'Release prep' },
  { id: 'incidents-triage', title: 'Incidents & triage' },
  { id: 'code-quality', title: 'Code quality' },
  { id: 'repo-maintenance', title: 'Repo maintenance' },
  { id: 'growth-exploration', title: 'Growth & exploration' },
]

export const automationCards: AutomationCard[] = [
  {
    id: 'sr-1',
    sectionId: 'status-reports',
    body: 'Summarize yesterday’s git activity for standup.',
    icon: 'ph:chats-circle',
  },
  {
    id: 'sr-2',
    sectionId: 'status-reports',
    body: 'Synthesize this week’s PRs, rollouts, incidents, and reviews into a weekly update.',
    icon: 'ph:article',
  },
  {
    id: 'sr-3',
    sectionId: 'status-reports',
    body: 'Summarize last week’s PRs by teammate and theme; highlight risks.',
    icon: 'ph:newspaper',
  },
  {
    id: 'rp-1',
    sectionId: 'release-prep',
    body: 'Draft weekly release notes from merged PRs (include links when available).',
    icon: 'ph:book-open',
  },
  {
    id: 'rp-2',
    sectionId: 'release-prep',
    body: 'Before tagging, verify changelog, migrations, feature flags, and tests.',
    icon: 'ph:seal-check',
  },
  {
    id: 'rp-3',
    sectionId: 'release-prep',
    body: 'Update the changelog with this week’s highlights and key PR links.',
    icon: 'ph:pencil-simple',
  },
  {
    id: 'it-1',
    sectionId: 'incidents-triage',
    body: 'Summarize CI failures and flaky tests from the last CI window; suggest top fixes.',
    icon: 'ph:lightning',
  },
  {
    id: 'it-2',
    sectionId: 'incidents-triage',
    body: 'Check CI failures; group by likely root cause and suggest minimal fixes.',
    icon: 'ph:terminal-window',
  },
  {
    id: 'it-3',
    sectionId: 'incidents-triage',
    body: 'Triage new issues; suggest owner, priority, and labels.',
    icon: 'ph:warning-circle',
  },
  {
    id: 'cq-1',
    sectionId: 'code-quality',
    body: 'Scan recent commits (since the last run, or last 24h) for likely bugs and propose minimal fixes.',
    icon: 'ph:bug',
  },
  {
    id: 'cq-2',
    sectionId: 'code-quality',
    body: 'Identify untested paths from recent changes; add focused tests and use $yeet for draft PRs.',
    icon: 'ph:package',
  },
  {
    id: 'cq-3',
    sectionId: 'code-quality',
    body: 'Compare recent changes to benchmarks or traces and flag regressions early.',
    icon: 'ph:hand-thumbs-up',
  },
  {
    id: 'rm-1',
    sectionId: 'repo-maintenance',
    body: 'Detect dependency and SDK drift and propose a minimal alignment plan.',
    icon: 'ph:check-circle',
  },
  {
    id: 'rm-2',
    sectionId: 'repo-maintenance',
    body: 'Scan outdated dependencies; propose safe upgrades with minimal changes.',
    icon: 'ph:cube',
  },
  {
    id: 'rm-3',
    sectionId: 'repo-maintenance',
    body: 'Update AGENTS.md with newly discovered workflows and commands.',
    icon: 'ph:file-text',
  },
  {
    id: 'ge-1',
    sectionId: 'growth-exploration',
    body: 'From recent PRs and reviews, suggest next skills to deepen.',
    icon: 'ph:tree-structure',
  },
  {
    id: 'ge-2',
    sectionId: 'growth-exploration',
    body: 'Audit performance regressions and propose highest-leverage fixes.',
    icon: 'ph:gauge',
  },
]

export function cardsForSection(sectionId: string): AutomationCard[] {
  return automationCards.filter(c => c.sectionId === sectionId)
}
