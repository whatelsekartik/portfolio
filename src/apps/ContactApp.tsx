import { useState } from "react";
import { FileIcon } from "../components/Icons";
import { profile, socials } from "../data/portfolioData";

const btn =
  "border-2 border-black bg-[#dfdfdf] px-2 py-0.5 text-[13px] shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:bg-black hover:text-white";
const field = "border-2 border-black bg-white px-2 py-1 outline-none focus:bg-[#fffdea]";

const pretty = (url: string) => url.replace(/^https?:\/\//, "");

const rows = [
  { label: "Email", value: socials.email, href: `mailto:${socials.email}` },
  { label: "Phone", value: socials.phone, href: `tel:${socials.phone.replace(/[^+\d]/g, "")}` },
  { label: "LinkedIn", value: pretty(socials.linkedin), href: socials.linkedin },
  { label: "GitHub", value: pretty(socials.github), href: socials.github },
  { label: "Instagram", value: pretty(socials.instagram), href: socials.instagram },
];

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    } catch {
      /* clipboard can be blocked; the link still works */
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${socials.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="flex min-h-full flex-col gap-4 p-4 text-[14px]">
      <div className="flex items-center gap-3">
        <FileIcon kind="phone" className="h-12 w-12 shrink-0" />
        <div>
          <p className="font-chicago text-[17px] leading-tight">{profile.name}</p>
          <p className="text-black/60">Let's talk</p>
        </div>
      </div>

      <ul className="border-2 border-black">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 border-b border-black/25 px-2 py-1 last:border-b-0">
            <span className="w-[72px] shrink-0 text-black/55">{r.label}</span>
            <a
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="min-w-0 flex-1 truncate underline"
            >
              {r.value}
            </a>
            <button type="button" onClick={() => copy(r.label, r.value)} className="border border-black bg-[#efefef] px-1.5 text-[12px] hover:bg-black hover:text-white">
              {copied === r.label ? "Copied" : "Copy"}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t-2 border-dashed border-black/30 pt-3">
        <p className="font-chicago text-[14px]">Send a message</p>
        <div className="flex gap-2 max-sm:flex-col">
          <label className="flex flex-1 flex-col gap-0.5">
            <span className="text-[12px] text-black/60">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={field} />
          </label>
          <label className="flex flex-1 flex-col gap-0.5">
            <span className="text-[12px] text-black/60">Your email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={field} />
          </label>
        </div>
        <label className="flex flex-col gap-0.5">
          <span className="text-[12px] text-black/60">Message</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className={`${field} resize-none`} />
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" className={btn}>
            Send mail
          </button>
          {sent && <p className="text-[12px] text-black/60">Opening your mail app…</p>}
        </div>
      </form>
    </div>
  );
}
