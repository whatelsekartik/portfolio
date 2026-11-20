import { education, experience, profile, projects, skillGroups, socials } from "./portfolioData";

/**
 * Everything the AI assistant is allowed to know, built from portfolioData.ts so
 * you only ever edit your details in one place. Kept short: the backend trims it.
 */
export function aiContext(): string {
  return [
    `Name: ${profile.name}`,
    `Role: ${profile.title}`,
    `Location: ${profile.location}`,
    `Tagline: ${profile.tagline}`,
    "",
    "About:",
    ...profile.bio,
    `Interests: ${profile.interests.join(", ")}`,
    `Personality: ${profile.personality.join(", ")}`,
    "",
    "Skills:",
    ...skillGroups.map((g) => `- ${g.name}: ${g.items.map((i) => `${i.name} (${i.level}/10)`).join(", ")}`),
    "",
    "Projects:",
    ...projects.map(
      (p) => `- ${p.name} (${p.year}): ${p.tagline} ${p.description} Tags: ${p.tags.join(", ")}.${p.link ? ` Link: ${p.link}` : ""}${p.repo ? ` Code: ${p.repo}` : ""}`
    ),
    "",
    "Experience:",
    ...experience.map((e) => `- ${e.role}, ${e.org} (${e.kind}, ${e.period}): ${e.points.join(" ")}`),
    "",
    "Education:",
    ...education.schools.map((s) => `- ${s.degree}, ${s.school} (${s.period}). ${s.details.join(" ")}`),
    ...education.certifications.map((c) => `- Certification: ${c.name}, ${c.issuer} (${c.year})`),
    ...education.achievements.map((a) => `- Achievement: ${a}`),
    "",
    "Contact:",
    `Email: ${socials.email}`,
    `GitHub: ${socials.github}`,
    `LinkedIn: ${socials.linkedin}`,
    `Instagram: ${socials.instagram}`,
  ].join("\n");
}
