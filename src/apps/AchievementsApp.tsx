import { useEffect, useRef, useState } from "react";

interface CertificateDetails {
  title?: string;
  issuer?: string;
  date?: string;
  credentialUrl?: string;
}

interface Certificate {
  filename: string;
  src: string;
  title: string;
  issuer?: string;
  date?: string;
  credentialUrl?: string;
}

/**
 * Add certificate images to src/assets/certificates/.
 * Supported formats: .jpg, .jpeg, .png, .webp, .avif
 * Vite discovers new files automatically at build time.
 */
const certificateAssets = import.meta.glob(
  "../assets/certificates/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default", query: "?url" },
) as Record<string, string>;

/** Optional human-friendly metadata, keyed by the exact image filename. */
const CERTIFICATE_DETAILS: Record<string, CertificateDetails> = {
  // Example:
  // "certificate1.jpeg": {
  //   title: "Introduction to ...",
  //   issuer: "Issuing organisation",
  //   date: "2026",
  //   credentialUrl: "https://...",
  // },
};

function titleFromFilename(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, "");
  const numbered = stem.match(/^certificate[\s_-]?(\d+)$/i);
  if (numbered) return `Certificate ${String(Number(numbered[1])).padStart(2, "0")}`;

  return stem
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Certificate";
}

const certificates: Certificate[] = Object.entries(certificateAssets)
  .map(([path, src]) => {
    const filename = path.split("/").pop() ?? path;
    const details = CERTIFICATE_DETAILS[filename] ?? {};
    return {
      filename,
      src,
      title: details.title || titleFromFilename(filename),
      issuer: details.issuer,
      date: details.date,
      credentialUrl: details.credentialUrl,
    };
  })
  .sort((a, b) => a.filename.localeCompare(b.filename, "en", { numeric: true, sensitivity: "base" }));

export default function AchievementsApp() {
  const wallRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeCertificate && !dialog.open) {
      dialog.showModal();
    } else if (!activeCertificate && dialog.open) {
      dialog.close();
    }
  }, [activeCertificate]);

  function moveWallLight(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !wallRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
    wallRef.current.style.setProperty("--wall-x", x + "%");
    wallRef.current.style.setProperty("--wall-y", y + "%");
  }

  function resetWallLight() {
    wallRef.current?.style.setProperty("--wall-x", "52%");
    wallRef.current?.style.setProperty("--wall-y", "16%");
  }

  function tiltCard(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / Math.max(1, bounds.width);
    const y = (event.clientY - bounds.top) / Math.max(1, bounds.height);
    card.style.setProperty("--tilt-x", ((0.5 - y) * 4).toFixed(2) + "deg");
    card.style.setProperty("--tilt-y", ((x - 0.5) * 5).toFixed(2) + "deg");
    card.style.setProperty("--shine-x", (x * 100).toFixed(1) + "%");
    card.style.setProperty("--shine-y", (y * 100).toFixed(1) + "%");
  }

  function resetCardTilt(event: React.PointerEvent<HTMLButtonElement>) {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "50%");
  }

  return (
    <div
      ref={wallRef}
      className="cert-wall min-h-full"
      onPointerMove={moveWallLight}
      onPointerLeave={resetWallLight}
    >
      <div className="cert-wall-inner">
        <header className="cert-wall-header">
          <div className="cert-wall-kicker">
            <span className="cert-wall-kicker-mark" aria-hidden="true">✳</span>
            <span>Personal archive / 01—{String(certificates.length).padStart(2, "0")}</span>
          </div>
          <div className="cert-wall-heading-row">
            <div className="min-w-0">
              <h1 className="cert-wall-title">Proof,<br /><em>framed.</em></h1>
              <p className="cert-wall-intro">
                A growing wall of milestones, courses, and things worth keeping.
                Select a frame to take a closer look.
              </p>
            </div>
            <div className="cert-wall-counter" aria-label={certificates.length + " certificates"}>
              <strong>{String(certificates.length).padStart(2, "0")}</strong>
              <span>{certificates.length === 1 ? "certificate" : "certificates"}</span>
            </div>
          </div>
          <div className="cert-wall-rule">
            <span>Selected credentials</span>
            <span className="cert-wall-rule-line" />
            <span>Explore ↘</span>
          </div>
        </header>

        {certificates.length > 0 ? (
          <section className="cert-gallery" aria-label="Certificate wall">
            {certificates.map((certificate, index) => {
              const failed = Boolean(failedImages[certificate.filename]);
              return (
                <article className="cert-item" key={certificate.filename}>
                  <button
                    type="button"
                    className={"cert-frame" + (failed ? " cert-frame-failed" : "")}
                    onClick={() => !failed && setActiveCertificate(certificate)}
                    onPointerMove={tiltCard}
                    onPointerLeave={resetCardTilt}
                    disabled={failed}
                    aria-label={
                      failed
                        ? certificate.title + " image unavailable"
                        : "View " + certificate.title + " full size"
                    }
                  >
                    <span className="cert-frame-topline" aria-hidden="true">
                      <span>KG / ARCHIVE</span>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </span>
                    <span className="cert-frame-mat">
                      {failed ? (
                        <span className="cert-image-fallback" role="img" aria-label="Certificate image failed to load">
                          <span aria-hidden="true">▧</span>
                          <span>Image unavailable</span>
                          <small>{certificate.filename}</small>
                        </span>
                      ) : (
                        <img
                          src={certificate.src}
                          alt={certificate.title}
                          loading="lazy"
                          decoding="async"
                          onError={() => setFailedImages((current) => ({ ...current, [certificate.filename]: true }))}
                        />
                      )}
                    </span>
                    <span className="cert-frame-footer" aria-hidden="true">
                      <span>INSPECT FRAME</span>
                      <span className="cert-frame-arrow">↗</span>
                    </span>
                    <span className="cert-frame-shine" aria-hidden="true" />
                  </button>

                  <div className="cert-caption">
                    <div className="cert-caption-title-row">
                      <h2>{certificate.title}</h2>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    {(certificate.issuer || certificate.date) && (
                      <p>
                        {[certificate.issuer, certificate.date].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="cert-wall-empty" aria-labelledby="cert-empty-title">
            <div className="cert-empty-mark" aria-hidden="true">▧</div>
            <p className="cert-wall-empty-kicker">The frames are ready</p>
            <h2 id="cert-empty-title">Your first certificate goes here.</h2>
            <p>
              Add image files to <code>src/assets/certificates/</code>. The wall will
              discover them automatically on the next build.
            </p>
            <div className="cert-file-example">
              <span className="cert-file-dot" aria-hidden="true" />
              certificate1.jpeg
            </div>
            <div className="cert-file-example">
              <span className="cert-file-dot" aria-hidden="true" />
              certificate2.jpeg
            </div>
            <p className="cert-wall-empty-foot">
              JPG, JPEG, PNG, WebP, and AVIF · Numbered files sort naturally.
            </p>
          </section>
        )}

        <footer className="cert-wall-footer">
          <span>THE WORK KEEPS GOING.</span>
          <span>Made of small milestones <span aria-hidden="true">✳</span></span>
        </footer>
      </div>

      <dialog
        ref={dialogRef}
        className="cert-lightbox"
        aria-label={activeCertificate ? activeCertificate.title : "Certificate preview"}
        onClose={() => setActiveCertificate(null)}
        onCancel={() => setActiveCertificate(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveCertificate(null);
        }}
      >
        {activeCertificate && (
          <div className="cert-lightbox-panel">
            <div className="cert-lightbox-header">
              <div className="min-w-0">
                <span className="cert-wall-kicker">Certificate / Full view</span>
                <h2>{activeCertificate.title}</h2>
                {activeCertificate.issuer && <p>{activeCertificate.issuer}</p>}
              </div>
              <button
                type="button"
                className="cert-lightbox-close"
                onClick={() => setActiveCertificate(null)}
                aria-label="Close certificate preview"
              >
                ×
              </button>
            </div>
            <div className="cert-lightbox-image-wrap">
              <img
                src={activeCertificate.src}
                alt={activeCertificate.title + " — full-size certificate"}
                onError={() => setFailedImages((current) => ({ ...current, [activeCertificate.filename]: true }))}
              />
            </div>
            <div className="cert-lightbox-footer">
              <span>{activeCertificate.filename}</span>
              {activeCertificate.credentialUrl && (
                <a href={activeCertificate.credentialUrl} target="_blank" rel="noreferrer">
                  Verify credential ↗
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
