const ACCOUNTS = ["whatelsekartik", "aminotkartik", "sitemango"];
const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeCalendar(payload) {
  if (!payload || !Array.isArray(payload.contributions)) {
    throw new Error("Provider did not return a contribution array");
  }

  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const firstDate = dateKey(new Date(todayUtc.getTime() - 380 * DAY_MS));
  const todayKey = dateKey(todayUtc);
  const rows = payload.contributions
    .filter((item) => item && typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date))
    .filter((item) => item.date >= firstDate && item.date <= todayKey)
    .map((item) => {
      const count = Number(item.count);
      return {
        date: item.date,
        count: Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0,
        level: Number.isFinite(Number(item.level)) ? Number(item.level) : 0,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const unique = new Map(rows.map((row) => [row.date, row]));
  const contributions = [...unique.values()];
  const latestDate = contributions.at(-1)?.date;
  if (contributions.length < 350) {
    throw new Error("Provider returned only " + contributions.length + " days; expected a full-year calendar");
  }
  if (!latestDate || latestDate < dateKey(new Date(todayUtc.getTime() - 14 * DAY_MS))) {
    throw new Error("Provider calendar is stale; latest day was " + (latestDate || "missing"));
  }

  return {
    total: contributions.reduce((sum, item) => sum + item.count, 0),
    contributions,
    latestDate,
  };
}

async function getCalendar(login) {
  const providers = [
    {
      source: "github-contributions.vercel.app",
      url: "https://github-contributions.vercel.app/api/v1/" + encodeURIComponent(login),
    },
    {
      source: "github-contributions-api.jogruber.de",
      url: "https://github-contributions-api.jogruber.de/v4/" + encodeURIComponent(login) + "?y=last",
    },
  ];
  const errors = [];

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      const normalized = normalizeCalendar(payload);
      return {
        login,
        data: { ...normalized, source: provider.source },
      };
    } catch (error) {
      errors.push(provider.source + ": " + (error instanceof Error ? error.message : "request failed"));
    }
  }

  return {
    login,
    error: errors.join(" · ") || "No contribution provider returned usable data",
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Vary", "Accept");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const results = await Promise.all(ACCOUNTS.map(getCalendar));
  const accounts = Object.fromEntries(
    results.filter((result) => result.data).map((result) => [result.login, result.data]),
  );
  const errors = Object.fromEntries(
    results.filter((result) => result.error).map((result) => [result.login, result.error]),
  );

  return res.status(Object.keys(accounts).length ? 200 : 502).json({
    accounts,
    errors,
    generatedAt: new Date().toISOString(),
    window: "last 12 months",
  });
}
