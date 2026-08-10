"use client";

/**
 * Copy text to the clipboard, with a fallback and an honest result.
 *
 * WHY THIS EXISTS
 * ---------------
 * Both copy buttons in the parent area called `navigator.clipboard.writeText`
 * inside a try/catch that swallowed the failure — one of them literally
 * commented "silently no-op". So on any browser where that call is
 * unavailable or rejected, tapping Copy did nothing at all: no copy, no error,
 * no explanation. Reported from an iPhone on the live site.
 *
 * `navigator.clipboard` is missing or restricted more often than people
 * expect: non-secure contexts, several in-app webviews (the browser inside
 * Instagram, Gmail, some banking apps), and older Safari. So:
 *
 *   1. Try the async Clipboard API when it exists.
 *   2. Fall back to a hidden textarea + `document.execCommand("copy")`, which
 *      still works in those webviews.
 *   3. Tell the truth if both fail, so the UI can say "select and copy
 *      manually" instead of pretending it worked.
 *
 * MUST be called directly from a user gesture. Browsers reject clipboard
 * writes that happen after an `await` in the same handler, so do any async
 * work (fetching the thing you want to copy) BEFORE calling this.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !text) return false;

  // 1 — modern API. `isSecureContext` matters: on http:// the property exists
  // but every write rejects.
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through — a rejection here is normal in restricted webviews
  }

  // 2 — legacy fallback. Deprecated, still the only thing that works in
  // several embedded browsers.
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    // Keep it off-screen but focusable. `readOnly` stops iOS opening the
    // keyboard; the tiny non-zero size keeps Safari from ignoring it.
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.padding = "0";
    ta.style.border = "none";
    ta.style.outline = "none";
    ta.style.boxShadow = "none";
    ta.style.background = "transparent";
    ta.style.opacity = "0";
    document.body.appendChild(ta);

    const selection = document.getSelection();
    const previous = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    ta.focus();
    ta.select();
    // iOS ignores select() on a readonly field unless the range is set too.
    ta.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(ta);

    // Restore whatever the user had selected before we hijacked it.
    if (previous && selection) {
      selection.removeAllRanges();
      selection.addRange(previous);
    }
    return ok;
  } catch {
    return false;
  }
}
