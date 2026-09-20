import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { BACKEND_URL, backendGet, backendPost } from "../utils/backend";

interface Entry {
  name: string;
  message: string;
  date: string;
}

// Where messages live: a Google Sheet via a small Google Apps Script web app
// (see backend/google-apps-script.gs). No backend URL = this device only.
const ENDPOINT = BACKEND_URL;

const MAX_NAME = 40;
const MAX_MESSAGE = 280;
const COOLDOWN_MS = 30_000;
const LOCAL_KEY = "mac-portfolio-guestbook";
const LAST_POST_KEY = "mac-portfolio-guestbook-last";
const CACHE_KEY = "mac-portfolio-guestbook-cache";

const WELCOME: Entry = { name: "System 7", message: "Welcome to the guestbook! Sign below.", date: "1991-05-13" };

const btn =
  "border-2 border-black bg-[#dfdfdf] px-3 py-1 text-[13px] shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-[#dfdfdf] disabled:hover:text-black";
const field = "border-2 border-black bg-white px-2 py-1 outline-none focus:bg-[#fffdea]";

function loadLocal(): Entry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "null");
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* storage unavailable or corrupt */
  }
  return [WELCOME];
}

/** Last messages seen from the backend, shown instantly while fresh ones load. */
function loadCached(): Entry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  return [];
}

function secondsLeft(): number {
  try {
    const last = Number(localStorage.getItem(LAST_POST_KEY) ?? 0);
    return Math.max(0, Math.ceil((last + COOLDOWN_MS - Date.now()) / 1000));
  } catch {
    return 0;
  }
}

export default function GuestbookApp() {
  const [entries, setEntries] = useState<Entry[]>(ENDPOINT ? loadCached : loadLocal);
  const [loading, setLoading] = useState(Boolean(ENDPOINT));
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState(""); // honeypot: humans never see this field
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ text: string; bad?: boolean } | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    if (!ENDPOINT) return;
    setLoading(true);
    setLoadError(false);
    try {
      const data = await backendGet<{ ok?: boolean; entries?: Entry[] }>();
      if (!alive.current) return;
      if (!data.ok || !Array.isArray(data.entries)) throw new Error("bad response");
      setEntries(data.entries);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.entries));
      } catch {
        /* ignore */
      }
    } catch {
      if (alive.current) setLoadError(true);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage || sending) return;

    const wait = secondsLeft();
    if (wait > 0) {
      setNotice({ text: `Please wait ${wait}s before signing again.`, bad: true });
      return;
    }

    const entry: Entry = { name: cleanName, message: cleanMessage, date: new Date().toISOString().slice(0, 10) };
    setSending(true);
    setNotice(null);

    try {
      if (ENDPOINT) {
        const data = await backendPost<{ ok?: boolean; error?: string }>({
          name: cleanName,
          message: cleanMessage,
          website: trap,
        });
        if (!data.ok) throw new Error(data.error || "Could not save your message.");
      } else {
        const next = [entry, ...entries];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      }
      setEntries((prev) => [entry, ...prev]);
      setName("");
      setMessage("");
      setNotice({ text: "Thanks for signing!" });
      try {
        localStorage.setItem(LAST_POST_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    } catch (err) {
      setNotice({ text: err instanceof Error ? err.message : "Could not save your message. Try again.", bad: true });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col gap-3 p-4 text-[14px]">
      <div className="flex items-baseline justify-between">
        <p className="font-chicago text-[16px]">Guestbook</p>
        {ENDPOINT && (
          <button type="button" onClick={load} disabled={loading} className="text-[12px] underline disabled:opacity-40">
            Refresh
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b-2 border-dashed border-black/30 pb-3">
        <input
          placeholder="Your name"
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Your name"
          className={field}
        />
        <textarea
          placeholder="Leave a message…"
          value={message}
          maxLength={MAX_MESSAGE}
          rows={3}
          onChange={(e) => setMessage(e.target.value)}
          required
          aria-label="Your message"
          className={`${field} resize-none`}
        />
        {/* Honeypot for bots; hidden from people and screen readers. */}
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          name="website"
        />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={sending} className={btn}>
            {sending ? "Signing…" : "Sign"}
          </button>
          <span className="text-[12px] text-black/50">
            {message.length}/{MAX_MESSAGE}
          </span>
          {notice && (
            <span role="status" className={`text-[12px] ${notice.bad ? "text-[#b00020]" : "text-[#1a6b1a]"}`}>
              {notice.text}
            </span>
          )}
        </div>
      </form>

      {loading && entries.length === 0 && <p className="text-black/60">Loading messages…</p>}
      {loadError && (
        <p className="text-[#b00020]">
          Couldn't load the messages right now. Try Refresh in a moment.
        </p>
      )}
      {!loading && !loadError && entries.length === 0 && (
        <p className="text-black/60">No messages yet. Be the first to sign!</p>
      )}

      <ul className="flex flex-col gap-2">
        {entries.map((e, i) => (
          <li key={`${e.date}-${i}`} className="border-2 border-black/20 p-2">
            <div className="flex justify-between gap-2">
              <p className="font-bold break-words">{e.name}</p>
              <p className="shrink-0 text-[12px] text-black/50">{e.date}</p>
            </div>
            <p className="break-words whitespace-pre-wrap">{e.message}</p>
          </li>
        ))}
      </ul>

      {!ENDPOINT && (
        <p className="mt-auto text-[12px] text-black/45">Messages are saved on this device only.</p>
      )}
    </div>
  );
}
