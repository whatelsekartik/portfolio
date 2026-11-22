// @vitest-environment jsdom
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Desktop from "../src/components/Desktop";
import RecruiterPortfolio from "../src/components/RecruiterPortfolio";
import ProjectDetailApp from "../src/apps/ProjectDetailApp";
import { SystemProvider } from "../src/context/SystemContext";
import { ToastProvider } from "../src/context/ToastContext";
import { WindowManagerProvider } from "../src/context/WindowManagerContext";
import { CERTIFICATE_DETAILS, selectCertificates } from "../src/data/certificates";

function renderDesktop(onOpenRecruiterView = vi.fn()) {
  return render(<StrictMode><ToastProvider><SystemProvider><WindowManagerProvider>
    <Desktop ready onOpenRecruiterView={onOpenRecruiterView} />
  </WindowManagerProvider></SystemProvider></ToastProvider></StrictMode>);
}

beforeEach(() => {
  localStorage.clear();
  history.replaceState({}, "", "/");
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1024 });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("pointer: coarse") && window.innerWidth < 640,
    media: query, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
  window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(Date.now()), 0);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("desktop welcome and navigation", () => {
  it("shows a first-visit guide, opens a shortcut, and persists dismissal", async () => {
    const user = userEvent.setup();
    const view = renderDesktop();
    const welcome = screen.getByRole("dialog", { name: /Hey, I'm Kartik/ });
    expect(within(welcome).getByText("Interactive desktop")).toBeTruthy();
    expect(within(welcome).getByText("Quick portfolio")).toBeTruthy();
    expect(within(welcome).queryByText("Motion view")).toBeNull();
    await user.click(within(welcome).getByRole("button", { name: /Projects/ }));
    expect(screen.queryByRole("dialog", { name: /Hey, I'm Kartik/ })).toBeNull();
    expect(localStorage.getItem("mac-portfolio-welcome-seen-v1")).toBe("1");
    expect(await screen.findByRole("button", { name: "Roll up My Projects" })).toBeTruthy();
    view.unmount();
    renderDesktop();
    expect(screen.queryByRole("dialog", { name: /Hey, I'm Kartik/ })).toBeNull();
  });

  it("keeps Quick portfolio available from the guide and Apple menu", async () => {
    const user = userEvent.setup();
    const openQuick = vi.fn();
    renderDesktop(openQuick);
    await user.click(within(screen.getByRole("dialog", { name: /Hey, I'm Kartik/ })).getByRole("button", { name: /Quick portfolio/ }));
    expect(openQuick).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Apple menu" }));
    expect(screen.queryByRole("menuitem", { name: /motion view/i })).toBeNull();
    await user.click(screen.getByRole("menuitem", { name: /Quick portfolio/ }));
    expect(openQuick).toHaveBeenCalledTimes(2);
  });

  it("can return from Quick portfolio to the interactive desktop", async () => {
    const user = userEvent.setup();
    const onReturn = vi.fn();
    render(<RecruiterPortfolio onReturnToDesktop={onReturn} />);
    expect(screen.queryByRole("link", { name: /motion view/i })).toBeNull();
    await user.click(screen.getAllByRole("button", { name: /Interactive desktop/ })[0]);
    expect(onReturn).toHaveBeenCalledOnce();
  });

  it("does not interrupt a direct app link and can reopen the guide", async () => {
    const user = userEvent.setup();
    history.replaceState({}, "", "/#/app/contact");
    renderDesktop();
    expect(screen.queryByRole("dialog", { name: /Hey, I'm Kartik/ })).toBeNull();
    expect(await screen.findByRole("button", { name: "Close Contact Me" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Apple menu" }));
    await user.click(screen.getByRole("menuitem", { name: /Welcome & choose a view/ }));
    expect(screen.getByRole("dialog", { name: /Hey, I'm Kartik/ })).toBeTruthy();
  });

  it("gives a deep link priority over a saved active window in Strict Mode", async () => {
    localStorage.setItem("mac-portfolio-workspace-v1", JSON.stringify({ version: 1, activeWindowId: "win-1", windows: [{
      id: "win-1", appId: "projects", title: "My Projects", rect: { x: 30, y: 40, width: 480, height: 360 },
      zIndex: 10, isMinimized: false, isMaximized: false, minWidth: 260, minHeight: 180,
    }] }));
    history.replaceState({}, "", "/#/app/contact");
    renderDesktop();
    const contact = await screen.findByRole("dialog", { name: "Contact Me" });
    await waitFor(() => expect(contact.className).toContain("is-active"));
    expect(location.hash).toBe("#/app/contact");
    expect(screen.queryByRole("dialog", { name: /Hey, I'm Kartik/ })).toBeNull();
  });

  it("restores a rolled-up window from the Windows menu and focuses it", async () => {
    const user = userEvent.setup();
    renderDesktop();
    await user.click(within(screen.getByRole("dialog", { name: /Hey, I'm Kartik/ })).getByRole("button", { name: /Contact/ }));
    await user.click(await screen.findByRole("button", { name: "Roll up Contact Me" }));
    await user.click(screen.getByRole("button", { name: "Windows" }));
    await user.click(screen.getByRole("menuitem", { name: /Contact Me \(rolled up\)/ }));
    expect(await screen.findByRole("button", { name: "Roll up Contact Me" })).toBeTruthy();
    await waitFor(() => expect(document.activeElement?.getAttribute("data-window-id")).toBeTruthy());
  });

  it("offers other mobile apps in My Computer and opens them with the keyboard", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 390 });
    const user = userEvent.setup();
    renderDesktop();
    await user.click(screen.getByRole("button", { name: "Close welcome guide" }));
    const apps = screen.getByRole("group", { name: "Desktop applications" });
    expect(within(apps).getByRole("button", { name: "Open Achievements" }).parentElement?.className).toContain("max-sm:hidden");
    fireEvent.keyDown(within(apps).getByRole("button", { name: "Open My Computer" }), { key: " " });
    const finder = await screen.findByRole("dialog", { name: "Macintosh HD" });
    expect(await within(finder).findByRole("button", { name: "Open Achievements" })).toBeTruthy();
    expect(within(finder).getByRole("button", { name: "Open Proof of Work" })).toBeTruthy();
    expect(within(finder).getByRole("button", { name: "Open Terminal.exe" })).toBeTruthy();
    fireEvent.keyDown(within(finder).getByRole("button", { name: "Open Achievements" }), { key: "Enter" });
    expect(await screen.findByRole("heading", { name: /Proof,.*framed/ })).toBeTruthy();
  });
});

describe("certificate wall", () => {
  it("filters and sorts the verified metadata without changing its input", () => {
    const items = Object.entries(CERTIFICATE_DETAILS).map(([filename, details]) => ({
      filename, category: details.category ?? "uncategorized" as const, sortDate: details.sortDate,
    }));
    expect(selectCertificates(items, "events", "newest")).toHaveLength(9);
    expect(selectCertificates(items, "workshops", "newest")).toHaveLength(1);
    expect(selectCertificates(items, "achievements", "newest").map((item) => item.filename)).toEqual(["certificate6.webp"]);
    expect(selectCertificates(items, "all", "newest")[0].filename).toBe("certificate6.webp");
    expect(selectCertificates(items, "all", "archive")[0].filename).toBe("certificate1.webp");
    expect(items[0].filename).toBe("certificate1.webp");
    expect(CERTIFICATE_DETAILS["certificate7.webp"].outcome).toBe("Participation");
    expect(CERTIFICATE_DETAILS["certificate6.webp"].outcome).toBe("Top 50");
    expect(CERTIFICATE_DETAILS["certificate10.webp"]).toMatchObject({ category: "events", outcome: "Participation" });
    expect(CERTIFICATE_DETAILS["certificate10.webp"].sortDate).toBeUndefined();
    expect(CERTIFICATE_DETAILS["certificate11.webp"]).toMatchObject({ title: "Codex 48 · National-Level Hackathon", issuer: "WeCodeCoders", category: "events", outcome: "Participation" });
    expect(CERTIFICATE_DETAILS["certificate11.webp"].sortDate).toBeUndefined();
    expect(selectCertificates(items, "all", "newest").slice(-2).map((item) => item.filename)).toEqual(["certificate10.webp", "certificate11.webp"]);
  });

  it("changes the displayed results and order with accessible controls", async () => {
    const user = userEvent.setup();
    renderDesktop();
    await user.click(screen.getByRole("button", { name: "Close welcome guide" }));
    await user.click(within(screen.getByRole("navigation", { name: "Quick launch" })).getByRole("button", { name: "Open Achievements" }));
    await screen.findByRole("heading", { name: /Proof,.*framed/ });
    await user.click(screen.getByRole("button", { name: "Achievements", exact: true }));
    expect(screen.getByText("Showing 1 of 11")).toBeTruthy();
    expect(screen.getByText("Top 50", { exact: true })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Events", exact: true }));
    expect(screen.getByText("Showing 9 of 11")).toBeTruthy();
    expect(screen.getByText("Code star 30 · National-Level Hackathon")).toBeTruthy();
    expect(screen.getByText("Codex 48 · National-Level Hackathon")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "View Codex 48 · National-Level Hackathon full size" }));
    const preview = screen.getByRole("dialog", { name: "Codex 48 · National-Level Hackathon" });
    expect(within(preview).getByText("Participation · WeCodeCoders")).toBeTruthy();
    await user.click(within(preview).getByRole("button", { name: "Close certificate preview" }));
    expect(screen.queryByText("Top 50", { exact: true })).toBeNull();
    await user.click(screen.getByRole("button", { name: "All", exact: true }));
    await user.selectOptions(screen.getByLabelText("Sort"), "archive");
    expect(document.querySelector(".cert-caption h2")?.textContent).toBe("GitHub Hands-On Workshop");
    await user.selectOptions(screen.getByLabelText("Sort"), "newest");
    expect(document.querySelector(".cert-caption h2")?.textContent).toBe("Code Variant · Top 50 Achievers");
  });
});


describe("Campus+ analytics snapshot", () => {
  it("shows the captured numbers and cropped chart in the case study without traffic sources", () => {
    render(<ProjectDetailApp payload={{ id: "campus-plus" }} />);
    const section = screen.getByRole("region", { name: /A snapshot of usage/ });
    expect(within(section).getByText("1,522")).toBeTruthy();
    expect(within(section).getByText("6,665")).toBeTruthy();
    expect(within(section).getByText("38%")).toBeTruthy();
    expect(within(section).getByText(/30-day snapshot.*Nov 21, 2026/)).toBeTruthy();
    expect(within(section).getByText(/not a live counter/i)).toBeTruthy();
    expect(within(section).getByRole("img", { name: /Vercel analytics snapshot/ })).toBeTruthy();
    expect(section.textContent).not.toMatch(/referr?ers|reddit|instagram/i);
  });

  it("includes the same historical metrics in the quick portfolio", () => {
    render(<RecruiterPortfolio onReturnToDesktop={() => {}} />);
    const snapshot = screen.getByLabelText("Campus+ usage snapshot");
    expect(within(snapshot).getByText("1,522")).toBeTruthy();
    expect(within(snapshot).getByText("6,665")).toBeTruthy();
    expect(within(snapshot).getByText("38%")).toBeTruthy();
    expect(snapshot.textContent).not.toMatch(/referr?ers|reddit|instagram/i);
  });
});
