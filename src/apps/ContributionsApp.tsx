import { useEffect, useMemo, useState } from "react";
import { projects } from "../data/portfolioData";
import { projectCaseStudies } from "../data/projectCaseStudies";
import { useOpenApp } from "./appDefs";

const ACCOUNTS = [
  { login: "whatelsekartik", label: "Personal", url: "https://github.com/whatelsekartik" },
  { login: "aminotkartik", label: "Projects", url: "https://github.com/aminotkartik" },
  { login: "sitemango", label: "Studio", url: "https://github.com/sitemango" },
] as const;

type ActivityKind = "commit" | "pr" | "release";
type AccountFilter = "all" | (typeof ACCOUNTS)[number]["login"];
type KindFilter = "all" | ActivityKind;

interface GitHubPublicEvent {
  id?: string;
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    action?: string;
    commits?: Array<{ sha?: string; message?: string }>;
    pull_request?: {
      merged?: boolean;
      merged_at?: string | null;
      html_url?: string;
      title?: string;
      number?: number;
      body?: string | null;
    };
    release?: {
      draft?: boolean;
      prerelease?: boolean;
      name?: string | null;
      tag_name?: string;
      html_url?: string;
      published_at?: string | null;
      body?: string | null;
    };
  };
}

interface ProjectInfo {
  id?: string;
  name: string;
  status: string;
  repoUrl: string;
  liveUrl?: string;
}

interface ActivityItem {
  id: string;
  account: string;
  repo: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  date: string;
  url: string;
  project?: ProjectInfo;
}

const publicEventCache = new Map<string, Promise<GitHubPublicEvent[]>>();

function loadPublicEvents(login: string): Promise<GitHubPublicEvent[]> {
  const cached = publicEventCache.get(login);
  if (cached) return cached;

  const request = fetch("https://api.github.com/users/" + encodeURIComponent(login) + "/events/public?per_page=100", {
    headers: { Accept: "application/vnd.github+json" },
  }).then(async (response) => {
    if (!response.ok) {
      if (response.status === 403) throw new Error("GitHub API rate limit reached");
      throw new Error("GitHub returned HTTP " + response.status);
    }
    const result: unknown = await response.json();
    if (!Array.isArray(result)) throw new Error("GitHub returned an unexpected event feed");
    return result as GitHubPublicEvent[];
  }).catch((error: unknown) => {
    publicEventCache.delete(login);
    throw error;
  });

  publicEventCache.set(login, request);
  return request;
}

function resolveProject(repo: string): ProjectInfo | undefined {
  const repoUrl = "https://github.com/" + repo;
  const match = projects.find((item) => item.repo?.replace(/\/+$/, "").toLowerCase() === repoUrl.toLowerCase());
  if (match) {
    const study = projectCaseStudies[match.id];
    return {
      id: match.id,
      name: match.name,
      status: study?.stageLabel ?? "Portfolio project",
      repoUrl,
      liveUrl: match.link,
    };
  }
  if (repo.toLowerCase() === "whatelsekartik/portfolio") {
    return { name: "Portfolio", status: "Portfolio / interface", repoUrl };
  }
  return undefined;
}

function cleanSummary(value?: string | null): string {
  return (value ?? "")
    .split(/\n\s*\n/)[0]
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

function extractActivities(login: string, events: GitHubPublicEvent[]): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const event of events) {
    const repo = event.repo?.name;
    const payload = event.payload;
    if (!repo || !event.created_at || !payload) continue;
    const project = resolveProject(repo);

    if (event.type === "PushEvent") {
      for (const commit of payload.commits ?? []) {
        if (!commit.sha || !commit.message) continue;
        const parts = commit.message.split("\n");
        items.push({
          id: login + ":commit:" + commit.sha,
          account: login,
          repo,
          kind: "commit",
          title: parts[0].trim() || "Commit",
          detail: parts.slice(1).join(" ").trim() || "Commit pushed to a public repository.",
          date: event.created_at,
          url: "https://github.com/" + repo + "/commit/" + encodeURIComponent(commit.sha),
          project,
        });
      }
    }

    if (
      event.type === "PullRequestEvent" &&
      payload.action === "closed" &&
      payload.pull_request &&
      (payload.pull_request.merged === true || Boolean(payload.pull_request.merged_at)) &&
      payload.pull_request.number
    ) {
      const pr = payload.pull_request;
      items.push({
        id: login + ":pr:" + repo + ":" + pr.number,
        account: login,
        repo,
        kind: "pr",
        title: pr.title || "Merged pull request #" + pr.number,
        detail: cleanSummary(pr.body) || "Merged pull request in a public repository.",
        date: pr.merged_at || event.created_at,
        url: pr.html_url || "https://github.com/" + repo + "/pull/" + pr.number,
        project,
      });
    }

    if (
      event.type === "ReleaseEvent" &&
      payload.release &&
      payload.release.draft !== true &&
      (payload.action === "published" || payload.action === "released")
    ) {
      const release = payload.release;
      const tag = release.tag_name;
      items.push({
        id: login + ":release:" + repo + ":" + (tag || release.name || event.id || event.created_at),
        account: login,
        repo,
        kind: "release",
        title: release.name || tag || "Published GitHub release",
        detail: cleanSummary(release.body) || "Public release published on GitHub. A release is not, by itself, proof of a production deployment.",
        date: release.published_at || event.created_at,
        url: release.html_url || ("https://github.com/" + repo + "/releases" + (tag ? "/tag/" + encodeURIComponent(tag) : "")),
        project,
      });
    }
  }

  const unique = new Map<string, ActivityItem>();
  for (const item of items) unique.set(item.id, item);
  return [...unique.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function accountLabel(login: string): string {
  return ACCOUNTS.find((account) => account.login === login)?.label ?? login;
}

function kindLabel(kind: ActivityKind): string {
  if (kind === "pr") return "Merged PR";
  if (kind === "release") return "Release";
  return "Commit";
}

export default function ContributionsApp() {
  const openApp = useOpenApp();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadErrors, setLoadErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [accountFilter, setAccountFilter] = useState<AccountFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(ACCOUNTS.map(async (account) => {
      try {
        const events = await loadPublicEvents(account.login);
        return { login: account.login, items: extractActivities(account.login, events), error: "" };
      } catch (error) {
        return {
          login: account.login,
          items: [] as ActivityItem[],
          error: error instanceof Error ? error.message : "Could not load this activity feed",
        };
      }
    })).then((results) => {
      if (cancelled) return;
      setActivities(results.flatMap((result) => result.items).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
      setLoadErrors(Object.fromEntries(results.filter((result) => result.error).map((result) => [result.login, result.error])));
      setLoadedAt(new Date());
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const accountActivities = useMemo(
    () => activities.filter((item) => accountFilter === "all" || item.account === accountFilter),
    [activities, accountFilter],
  );

  const filteredActivities = useMemo(
    () => accountActivities.filter((item) => kindFilter === "all" || item.kind === kindFilter),
    [accountActivities, kindFilter],
  );

  useEffect(() => { setVisibleCount(24); }, [accountFilter, kindFilter]);

  const stats = useMemo(() => ({
    commits: accountActivities.filter((item) => item.kind === "commit").length,
    prs: accountActivities.filter((item) => item.kind === "pr").length,
    releases: accountActivities.filter((item) => item.kind === "release").length,
  }), [accountActivities]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 90);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const days: string[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      days.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    while (days.length % 7 !== 0) {
      days.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return days;
  }, []);

  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of filteredActivities) {
      const key = item.date.slice(0, 10);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [filteredActivities]);

  const repoCounts = useMemo(() => {
    const counts: Record<string, ActivityItem[]> = {};
    for (const item of accountActivities) {
      if (!item.project?.id) continue;
      if (!counts[item.project.id]) counts[item.project.id] = [];
      counts[item.project.id].push(item);
    }
    return counts;
  }, [accountActivities]);

  const hasAnyError = Object.keys(loadErrors).length > 0;

  return (
    <div className="contrib-root flex min-h-full flex-col gap-5 p-4 text-[14px] sm:p-5">
      <header className="contrib-hero">
        <div className="editorial-meta text-[#e7ad5a]">Open source / build log</div>
        <h1 className="font-display mt-2 text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.06em]">
          WORK, NOT<br />JUST GREEN <span>.</span>
        </h1>
        <p>Public commits, merged pull requests, and published releases across three GitHub accounts — linked back to the code and the projects they support.</p>
        <div className="contrib-hero-foot">
          <span>3 accounts</span>
          <span>Live public activity</span>
          <span>Evidence-linked</span>
        </div>
      </header>

      <section aria-label="GitHub accounts" className="contrib-account-section">
        <div className="contrib-section-head">
          <span className="editorial-meta">Activity scope</span>
          {loadedAt && <span className="contrib-muted">Updated {loadedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
        </div>
        <div className="contrib-account-list">
          <button type="button" className={"contrib-account-button" + (accountFilter === "all" ? " is-active" : "")} onClick={() => setAccountFilter("all")}>
            All accounts <span>{activities.length}</span>
          </button>
          {ACCOUNTS.map((account) => (
            <button key={account.login} type="button" className={"contrib-account-button" + (accountFilter === account.login ? " is-active" : "")} onClick={() => setAccountFilter(account.login)}>
              {account.login} <span>{activities.filter((item) => item.account === account.login).length}</span>
            </button>
          ))}
        </div>
        <div className="contrib-profile-links">
          {ACCOUNTS.map((account) => (
            <a key={account.login} href={account.url} target="_blank" rel="noreferrer">
              {account.label} profile ↗
            </a>
          ))}
        </div>
      </section>

      <section className="contrib-section" aria-label="Recent activity map">
        <div className="contrib-section-head">
          <div>
            <p className="editorial-meta text-[#89551e]">Contribution map</p>
            <h2>Recent work, by day.</h2>
          </div>
          <span className="contrib-muted">~13 weeks</span>
        </div>
        <p className="contrib-explainer">Each square reflects a commit, merged PR, or published release found in the selected public activity feeds. Select an account or activity type to change the map.</p>
        <div className="contrib-heatmap-scroll">
          <div className="contrib-weekdays" aria-hidden="true">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="contrib-heatmap" role="group" aria-label="Daily public GitHub activity heatmap">
            {calendarDays.map((day) => {
              const count = dayCounts[day] ?? 0;
              const future = day > new Date().toISOString().slice(0, 10);
              const level = future || count === 0 ? 0 : Math.min(4, count);
              return <span key={day} className={"contrib-day contrib-level-" + level + (future ? " contrib-day-future" : "")} title={day + ": " + count + " observed activity items"} aria-label={day + ": " + count + " observed activity items"} />;
            })}
          </div>
        </div>
        <div className="contrib-heatmap-footer">
          <span className="contrib-muted">Less</span>
          <span className="contrib-day contrib-level-0" aria-hidden="true" />
          <span className="contrib-day contrib-level-1" aria-hidden="true" />
          <span className="contrib-day contrib-level-2" aria-hidden="true" />
          <span className="contrib-day contrib-level-3" aria-hidden="true" />
          <span className="contrib-day contrib-level-4" aria-hidden="true" />
          <span className="contrib-muted">More</span>
        </div>
      </section>

      <section className="contrib-stats" aria-label="Observed activity totals">
        <article className="contrib-stat">
          <span className="editorial-meta">Commits</span>
          <strong>{stats.commits}</strong>
          <span>Observed in public feed</span>
        </article>
        <article className="contrib-stat">
          <span className="editorial-meta">Merged PRs</span>
          <strong>{stats.prs}</strong>
          <span>Merge confirmed by GitHub event</span>
        </article>
        <article className="contrib-stat">
          <span className="editorial-meta">Releases</span>
          <strong>{stats.releases}</strong>
          <span>Published GitHub releases</span>
        </article>
      </section>

      <section className="contrib-section">
        <div className="contrib-section-head">
          <div>
            <p className="editorial-meta text-[#89551e]">Project ledger</p>
            <h2>What the work belongs to.</h2>
          </div>
          <span className="contrib-muted">{projects.length} case studies</span>
        </div>
        <p className="contrib-explainer">Portfolio maturity labels stay separate from activity counts: a commit proves a code change, not a deployment or a successful real-world test.</p>
        <div className="contrib-project-grid">
          {projects.map((project) => {
            const study = projectCaseStudies[project.id];
            const items = repoCounts[project.id] ?? [];
            const latest = items.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0];
            const implementedEvidence = study.evidence.filter((item) => item.state === "built").slice(0, 2);
            const cautionEvidence = study.evidence.find((item) => item.state === "verify")
              ?? study.evidence.find((item) => item.state === "configured")
              ?? study.evidence.find((item) => item.state === "design");
            const featureEvidence = implementedEvidence.concat(
              cautionEvidence && !implementedEvidence.includes(cautionEvidence) ? [cautionEvidence] : [],
            );
            const evidenceLabels: Record<string, string> = {
              built: "Implemented in source",
              configured: "Configured in code",
              verify: "Needs verification",
              design: "Design / target",
            };
            return (
              <article className="contrib-project-card" key={project.id}>
                <div className="contrib-project-topline">
                  <span className="editorial-meta">{project.year}</span>
                  <span className={"case-stage case-stage--compact case-stage--" + study.stageTone}>{study.stageLabel}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.tagline}</p>
                <div className="contrib-project-activity">
                  <strong>{items.length}</strong> observed linked items
                  {latest && <span>Latest: {formatDate(latest.date)}</span>}
                  {!latest && <span>No matching item in this recent sample</span>}
                </div>
                <div className="contrib-feature-evidence">
                  <span className="editorial-meta">Feature evidence</span>
                  {featureEvidence.map((evidence) => (
                    <div className="contrib-feature-item" key={evidence.title}>
                      <span className={"contrib-evidence-dot contrib-evidence-" + evidence.state} aria-hidden="true" />
                      <div>
                        <strong>{evidence.title}</strong>
                        <span className={"contrib-evidence-label contrib-evidence-label-" + evidence.state}>{evidenceLabels[evidence.state]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => openApp("project-detail", { id: project.id })}>Open evidence-led case study ↗</button>
                <a href={project.repo} target="_blank" rel="noreferrer">Repository ↗</a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="contrib-section">
        <div className="contrib-section-head">
          <div>
            <p className="editorial-meta text-[#89551e]">Activity timeline</p>
            <h2>Receipts from GitHub.</h2>
          </div>
          <span className="contrib-muted">{filteredActivities.length} items</span>
        </div>
        <div className="contrib-filter-row" role="group" aria-label="Filter activity type">
          {([
            ["all", "All work"],
            ["commit", "Commits"],
            ["pr", "Merged PRs"],
            ["release", "Releases"],
          ] as [KindFilter, string][]).map(([kind, label]) => (
            <button key={kind} type="button" className={"contrib-filter-button" + (kindFilter === kind ? " is-active" : "")} onClick={() => setKindFilter(kind)}>{label}</button>
          ))}
        </div>

        {loading && (
          <div className="contrib-empty" role="status">
            <span className="contrib-loader" aria-hidden="true" />
            Loading public GitHub activity…
          </div>
        )}

        {!loading && hasAnyError && (
          <div className="contrib-api-note" role="status">
            <strong>Some activity feeds could not be loaded.</strong>
            <p>{Object.entries(loadErrors).map(([login, error]) => login + ": " + error).join(" · ")}</p>
            <button type="button" onClick={() => { publicEventCache.clear(); setRefreshKey((key) => key + 1); }}>Retry public feeds</button>
          </div>
        )}

        {!loading && filteredActivities.length === 0 && (
          <div className="contrib-empty">
            No matching commits, merged PRs, or published releases appeared in this public feed sample. That does not mean the account has no other contributions.
          </div>
        )}

        <div className="contrib-timeline">
          {filteredActivities.slice(0, visibleCount).map((item) => (
            <article className="contrib-activity" key={item.id}>
              <div className={"contrib-activity-mark contrib-mark-" + item.kind} aria-hidden="true">
                {item.kind === "commit" ? "↳" : item.kind === "pr" ? "⇄" : "✳"}
              </div>
              <div className="contrib-activity-body">
                <div className="contrib-activity-meta">
                  <span>{kindLabel(item.kind)}</span>
                  <span>{accountLabel(item.account)} · {formatDate(item.date)}</span>
                </div>
                <a className="contrib-activity-title" href={item.url} target="_blank" rel="noreferrer">{item.title} ↗</a>
                <div className="contrib-activity-repo">{item.repo}</div>
                {item.detail && <p>{item.detail}</p>}
                <div className="contrib-activity-links">
                  <a href={item.url} target="_blank" rel="noreferrer">{item.kind === "pr" ? "Review merged PR" : item.kind === "release" ? "Inspect release" : "Inspect commit"} ↗</a>
                  {item.project?.id && <button type="button" onClick={() => openApp("project-detail", { id: item.project?.id })}>Open {item.project.name} case study</button>}
                  {item.project && !item.project.id && <span>{item.project.name}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
        {!loading && filteredActivities.length > visibleCount && (
          <button type="button" className="contrib-load-more" onClick={() => setVisibleCount((count) => count + 24)}>
            Load more activity ({filteredActivities.length - visibleCount} remaining)
          </button>
        )}
      </section>

      <footer className="contrib-footnote">
        <strong>How to read this:</strong> this view uses GitHub's recent public-events endpoint, capped at 100 event records per account. It is not a lifetime contribution graph, does not include private work, and can miss older activity or commits GitHub does not attribute to these handles. A published GitHub release is not automatically proof of a production deployment. Project stage labels come from the linked case studies.
        <div>Source accounts: {ACCOUNTS.map((account) => account.login).join(" · ")}</div>
      </footer>
    </div>
  );
}
