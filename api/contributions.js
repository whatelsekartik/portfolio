const ACCOUNTS = ["whatelsekartik", "aminotkartik", "sitemango"];

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const results = await Promise.all(ACCOUNTS.map(async (login) => {
    try {
      // The upstream service doesn't expose browser CORS headers, so keep this
      // narrow, same-origin proxy limited to the three portfolio-owned profiles.
      const upstream = await fetch(
        "https://github-contributions-api.jogruber.de/v4/" + encodeURIComponent(login) + "?y=last",
        { headers: { Accept: "application/json" } },
      );
      if (!upstream.ok) throw new Error("Contribution provider returned HTTP " + upstream.status);

      const payload = await upstream.json();
      if (!payload || !Array.isArray(payload.contributions)) {
        throw new Error("Contribution provider returned an unexpected calendar");
      }

      const contributions = payload.contributions
        .filter((item) => item && typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date))
        .map((item) => ({
          date: item.date,
          count: Number.isFinite(item.count) ? Math.max(0, Math.floor(item.count)) : 0,
          level: Number.isFinite(item.level) ? item.level : 0,
        }));

      const total = Number(payload.total?.lastYear);
      return {
        login,
        data: {
          total: Number.isFinite(total) ? total : contributions.reduce((sum, item) => sum + item.count, 0),
          contributions,
        },
      };
    } catch (error) {
      return {
        login,
        error: error instanceof Error ? error.message : "Could not fetch the public contribution calendar",
      };
    }
  }));

  const accounts = Object.fromEntries(
    results.filter((result) => result.data).map((result) => [result.login, result.data]),
  );
  const errors = Object.fromEntries(
    results.filter((result) => result.error).map((result) => [result.login, result.error]),
  );

  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(Object.keys(accounts).length ? 200 : 502).json({
    accounts,
    errors,
    generatedAt: new Date().toISOString(),
    window: "last 12 months",
  });
}
