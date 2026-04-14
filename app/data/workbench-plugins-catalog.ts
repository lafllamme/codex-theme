export type MarketplaceKind = 'plugin' | 'skill'
export type MarketplaceBuiltBy = 'openai' | 'community'

/** Section ids differ between Plugins vs Skills tabs. */
export type PluginSectionId = 'featured' | 'coding' | 'design' | 'productivity'
export type SkillSectionId = 'recommended' | 'system' | 'personal'

export interface MarketplaceItem {
  id: string
  name: string
  description: string
  /** Iconify icon name */
  icon: string
  builtBy: MarketplaceBuiltBy
  kind: MarketplaceKind
  section: PluginSectionId | SkillSectionId
}

export const marketplaceCatalog: MarketplaceItem[] = [
  // Plugins — Featured
  { id: 'github', name: 'GitHub', description: 'Triage PRs, issues, CI, and publish work from the repo.', icon: 'simple-icons:github', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'slack', name: 'Slack', description: 'Read and manage Slack conversations and channels.', icon: 'simple-icons:slack', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'notion', name: 'Notion', description: 'Notion workflows for specs, docs, and project pages.', icon: 'simple-icons:notion', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'linear', name: 'Linear', description: 'Find and reference issues and project cycles.', icon: 'simple-icons:linear', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'gmail', name: 'Gmail', description: 'Read and manage Gmail threads and drafts.', icon: 'simple-icons:gmail', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'gcal', name: 'Google Calendar', description: 'Manage Google Calendar events and availability.', icon: 'simple-icons:googlecalendar', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'gdrive', name: 'Google Drive', description: 'Search and open files from shared drives.', icon: 'simple-icons:googledrive', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'figma', name: 'Figma', description: 'Pull frames, comments, and design context.', icon: 'simple-icons:figma', builtBy: 'openai', kind: 'plugin', section: 'featured' },
  { id: 'vercel', name: 'Vercel', description: 'Deployments, previews, and project status.', icon: 'simple-icons:vercel', builtBy: 'community', kind: 'plugin', section: 'featured' },
  // Plugins — Coding
  { id: 'hf', name: 'Hugging Face', description: 'Inspect models, datasets, and Spaces metadata.', icon: 'simple-icons:huggingface', builtBy: 'community', kind: 'plugin', section: 'coding' },
  { id: 'netlify', name: 'Netlify', description: 'Build hooks, deploy logs, and site configuration.', icon: 'simple-icons:netlify', builtBy: 'community', kind: 'plugin', section: 'coding' },
  { id: 'gamestudio', name: 'Game Studio', description: 'Prototype scenes and asset references.', icon: 'ph:game-controller', builtBy: 'community', kind: 'plugin', section: 'coding' },
  { id: 'cloudflare', name: 'Cloudflare', description: 'DNS, Workers, and edge configuration.', icon: 'simple-icons:cloudflare', builtBy: 'community', kind: 'plugin', section: 'coding' },
  { id: 'sentry', name: 'Sentry', description: 'Error triage and release health.', icon: 'simple-icons:sentry', builtBy: 'community', kind: 'plugin', section: 'coding' },
  { id: 'ios', name: 'Build iOS Apps', description: 'Xcode schemes, simulators, and signing hints.', icon: 'ph:device-mobile-camera', builtBy: 'openai', kind: 'plugin', section: 'coding' },
  { id: 'macos', name: 'Build macOS Apps', description: 'Notarize, package, and distribute macOS builds.', icon: 'ph:desktop', builtBy: 'openai', kind: 'plugin', section: 'coding' },
  { id: 'web', name: 'Build Web Apps', description: 'Vite, Next, and static hosting workflows.', icon: 'ph:browser', builtBy: 'openai', kind: 'plugin', section: 'coding' },
  { id: 'android', name: 'Test Android Apps', description: 'Emulators, adb, and Gradle tasks.', icon: 'ph:android-logo', builtBy: 'openai', kind: 'plugin', section: 'coding' },
  // Design
  { id: 'canva', name: 'Canva', description: 'Search, create, and edit designs.', icon: 'simple-icons:canva', builtBy: 'community', kind: 'plugin', section: 'design' },
  // Productivity
  { id: 'jam', name: 'Jam', description: 'Screen record with context for bug reports.', icon: 'ph:strawberry', builtBy: 'community', kind: 'plugin', section: 'productivity' },
  { id: 'stripe', name: 'Stripe', description: 'Payments and business tools.', icon: 'simple-icons:stripe', builtBy: 'community', kind: 'plugin', section: 'productivity' },
  { id: 'box', name: 'Box', description: 'Search and reference enterprise files.', icon: 'simple-icons:box', builtBy: 'community', kind: 'plugin', section: 'productivity' },
  { id: 'lifescience', name: 'Life Science: Research', description: 'Literature search and citation helpers.', icon: 'ph:flask', builtBy: 'openai', kind: 'plugin', section: 'productivity' },

  // Skills — Recommended
  { id: 'sora', name: 'Sora', description: 'Generate, edit, extend, and manage video drafts.', icon: 'ph:film-strip', builtBy: 'openai', kind: 'skill', section: 'recommended' },
  { id: 'pdf', name: 'PDF', description: 'Create, edit, and review PDFs.', icon: 'ph:file-pdf', builtBy: 'openai', kind: 'skill', section: 'recommended' },
  { id: 'doc', name: 'Doc', description: 'Edit and review docx files.', icon: 'ph:file-doc', builtBy: 'openai', kind: 'skill', section: 'recommended' },
  { id: 'sheet', name: 'Spreadsheet', description: 'Create, edit, and analyze tabular data.', icon: 'ph:grid-four', builtBy: 'openai', kind: 'skill', section: 'recommended' },
  { id: 'playwright', name: 'Playwright', description: 'Automate real browsers from the terminal.', icon: 'simple-icons:playwright', builtBy: 'openai', kind: 'skill', section: 'recommended' },
  // System
  { id: 'imggen', name: 'Image Gen', description: 'Generate or edit images for UI mockups.', icon: 'ph:image', builtBy: 'openai', kind: 'skill', section: 'system' },
  { id: 'openaidocs', name: 'OpenAI Docs', description: 'Reference official OpenAI docs in context.', icon: 'simple-icons:openai', builtBy: 'openai', kind: 'skill', section: 'system' },
  { id: 'plugincreator', name: 'Plugin Creator', description: 'Scaffold plugins and marketplace metadata.', icon: 'ph:puzzle-piece', builtBy: 'openai', kind: 'skill', section: 'system' },
  { id: 'skillcreator', name: 'Skill Creator', description: 'Create or update a skill package.', icon: 'ph:package', builtBy: 'openai', kind: 'skill', section: 'system' },
  { id: 'skillinstaller', name: 'Skill Installer', description: 'Install curated skills from the directory.', icon: 'ph:download-simple', builtBy: 'openai', kind: 'skill', section: 'system' },
  // Personal
  { id: 'agentbrowser', name: 'Agent Browser', description: 'Browser automation CLI for AI agents.', icon: 'ph:globe-hemisphere-west', builtBy: 'community', kind: 'skill', section: 'personal' },
  { id: 'squirrelscan', name: 'squirrelscan', description: 'Audit websites for SEO, performance, and content.', icon: 'ph:squirrel', builtBy: 'community', kind: 'skill', section: 'personal' },
]
