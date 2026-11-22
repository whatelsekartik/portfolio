export type CertificateCategory = "workshops" | "events" | "achievements" | "uncategorized";
export type CertificateFilter = "all" | CertificateCategory;
export type CertificateSort = "archive" | "newest";

export interface CertificateDetails {
  title?: string;
  issuer?: string;
  date?: string;
  /** ISO date for sorting; ranges use the event's last day. */
  sortDate?: string;
  category?: CertificateCategory;
  /** Describes what the certificate actually recognizes, not just its heading. */
  outcome?: string;
  credentialUrl?: string;
}

export const CERTIFICATE_DETAILS: Record<string, CertificateDetails> = {
  "certificate1.webp": { title: "GitHub Hands-On Workshop", issuer: "Microsoft Learning Student Chapter · PCCOE IEEE Branch", date: "1 Oct 2026", sortDate: "2026-10-01", category: "workshops", outcome: "Participation" },
  "certificate2.webp": { title: "WCC Launchpad 30", issuer: "WeCodeCoders · National Online Hackathon", date: "4–5 Oct 2026", sortDate: "2026-10-05", category: "events", outcome: "Participation", credentialUrl: "https://wecodecoders.in/verify/L30-7J4M8C" },
  "certificate3.webp": { title: "Promptify · Anveshan 3.0", issuer: "PCCOE · Computer Engineering (Regional Language)", date: "9–10 Oct 2026", sortDate: "2026-10-10", category: "events", outcome: "Participation" },
  "certificate4.webp": { title: "PRAXIS 2026 · Storyverse", issuer: "MLSC · Department of Information Technology, PCCOE", date: "9–10 Oct 2026", sortDate: "2026-10-10", category: "events", outcome: "Participation" },
  "certificate5.webp": { title: "CodeSprint 2026", issuer: "RANKUP · Certificate ID RNK-CS26-118", date: "21 Oct 2026", sortDate: "2026-10-21", category: "events", outcome: "Participation" },
  "certificate6.webp": { title: "Code Variant · Top 50 Achievers", issuer: "Code Variant · Build 01", date: "28 Oct 2026", sortDate: "2026-10-28", category: "achievements", outcome: "Top 50" },
  "certificate7.webp": { title: "Pixel Perfect", issuer: "PCCOE · Computer Science & Engineering (AI & ML)", date: "9–11 Oct 2026", sortDate: "2026-10-11", category: "events", outcome: "Participation" },
  "certificate8.webp": { title: "Prompt Relay", issuer: "PCCOE · Computer Science & Engineering (AI & ML)", date: "9–11 Oct 2026", sortDate: "2026-10-11", category: "events", outcome: "Participation" },
  "certificate9.webp": { title: "Houdini Heist", issuer: "PCCOE · Computer Science & Engineering (AI & ML)", date: "9–11 Oct 2026", sortDate: "2026-10-11", category: "events", outcome: "Participation" },
  "certificate10.webp": { title: "Code star 30 · National-Level Hackathon", issuer: "WeCodeCoders", category: "events", outcome: "Participation" },
  "certificate11.webp": { title: "Codex 48 · National-Level Hackathon", issuer: "WeCodeCoders", category: "events", outcome: "Participation" },
};

export function selectCertificates<T extends { filename: string; category: CertificateCategory; sortDate?: string }>(
  items: T[], filter: CertificateFilter, sort: CertificateSort,
): T[] {
  return items.filter((item) => filter === "all" || item.category === filter).sort((a, b) => {
    if (sort === "newest") {
      const byDate = (b.sortDate ?? "").localeCompare(a.sortDate ?? "");
      if (byDate) return byDate;
    }
    return a.filename.localeCompare(b.filename, "en", { numeric: true, sensitivity: "base" });
  });
}
