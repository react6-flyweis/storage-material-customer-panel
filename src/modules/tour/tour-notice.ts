const VISIBLE_MS = 3500;

/** A short message in the corner; this panel has no toast library. */
export function showTourNotice(message: string) {
  document.querySelector(".tour-notice")?.remove();
  const notice = document.createElement("div");
  notice.className = "tour-notice";
  notice.setAttribute("role", "status");
  notice.textContent = message;
  document.body.appendChild(notice);
  window.setTimeout(() => notice.remove(), VISIBLE_MS);
}
