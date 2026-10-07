import type { ReactNode } from "react";
import type { IconName } from "../types";

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Icon({ name }: { name: IconName }) {
  switch (name) {
    case "skin":
      return (
        <Glyph>
          <path d="M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10z" />
        </Glyph>
      );
    case "makeup":
      return (
        <Glyph>
          <path d="M9 8V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V8" />
          <rect x="8" y="8" width="8" height="4" rx="1" />
          <path d="M8 12h8v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-6z" />
        </Glyph>
      );
    case "perfume":
      return (
        <Glyph>
          <rect x="10" y="3" width="4" height="3" rx="0.6" />
          <path d="M9 8h6" />
          <path d="M8 10h8l1 2v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-6l1-2z" />
        </Glyph>
      );
    case "hair":
      return (
        <Glyph>
          <path d="M8 4c.8 5 .6 9 2.5 16" />
          <path d="M12 4c.8 5 .6 9 2.5 16" />
          <path d="M16 4c.6 5 .4 9 1.8 16" />
        </Glyph>
      );
    case "body":
      return (
        <Glyph>
          <rect x="10" y="3" width="4" height="4" rx="1" />
          <rect x="9" y="8" width="6" height="12" rx="2" />
        </Glyph>
      );
    case "gift":
      return (
        <Glyph>
          <rect x="4" y="10" width="16" height="9" rx="1.5" />
          <path d="M4 14h16M12 10v9" />
          <path d="M12 10c-1.6-3.2-5.2-2.6-4.2.4" />
          <path d="M12 10c1.6-3.2 5.2-2.6 4.2.4" />
        </Glyph>
      );
    case "brush":
      return (
        <Glyph>
          <path d="M15 4l5 5" />
          <path d="M14 7l4 4-7.2 7.2H7v-3.8L14 7z" />
        </Glyph>
      );
    case "reward":
      return (
        <Glyph>
          <circle cx="12" cy="14" r="5" />
          <path d="M9.2 4.5 12 10l2.8-5.5" />
        </Glyph>
      );
    case "crown":
      return (
        <Glyph>
          <path d="M4 16 6.2 8 12 13l5.8-5L20 16H4z" />
          <path d="M6 19h12" />
        </Glyph>
      );
    case "cake":
      return (
        <Glyph>
          <path d="M12 5c.7.9.1 2 .1 2S11.2 6 12 5z" />
          <path d="M12 8v3" />
          <rect x="4" y="11" width="16" height="8" rx="1.5" />
          <path d="M4 15h16" />
        </Glyph>
      );
    case "points":
      return (
        <Glyph>
          <circle cx="12" cy="12" r="8" />
          <path
            d="m12 8 1.1 2.3 2.5.3-1.8 1.7.5 2.4L12 13.5 9.7 14.7l.5-2.4-1.8-1.7 2.5-.3L12 8z"
            fill="currentColor"
            stroke="none"
          />
        </Glyph>
      );
    case "user":
      return (
        <Glyph>
          <circle cx="12" cy="8" r="3" />
          <path d="M5.5 19c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
        </Glyph>
      );
    case "truck":
      return (
        <Glyph>
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h4l3 3v2h-7z" />
          <circle cx="7" cy="17.5" r="1.4" />
          <circle cx="17" cy="17.5" r="1.4" />
        </Glyph>
      );
    case "shield":
      return (
        <Glyph>
          <path d="M12 3 19 6v6c0 4.2-2.8 6.5-7 8-4.2-1.5-7-3.8-7-8V6l7-3z" />
          <path d="m9 12 2 2 4-4" />
        </Glyph>
      );
    case "refresh":
      return (
        <Glyph>
          <path d="M20 12a8 8 0 1 1-2.3-5.6" />
          <path d="M20 4v5h-5" />
        </Glyph>
      );
    case "apple":
      return (
        <Glyph>
          <path d="M16 7c-1 .1-2.2.7-2.8 1.6-.6.8-1 1.9-.8 3 .9.1 2-.4 2.6-1.1C16.4 9.6 16.8 8.2 16 7z" />
          <path d="M12.2 8.2c-2.2 0-4.2 1.8-4.2 4.6 0 3.4 1.8 6.2 3.6 6.2 1.1 0 1.5-.7 2.6-.7s1.6.7 2.7.7c1.6 0 3.3-2.6 3.3-5.6 0-2.4-1.5-4-3.2-4.3-.8-.2-1.6.1-2.2.4-.5.2-1.2.3-1.6.1-.6-.3-1.1-.4-1-.4z" />
        </Glyph>
      );
    case "play":
      return (
        <Glyph>
          <path d="M9 7.5v9l8-4.5-8-4.5z" fill="currentColor" stroke="none" />
        </Glyph>
      );
    case "instagram":
      return (
        <Glyph>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </Glyph>
      );
    case "tiktok":
      return (
        <Glyph>
          <path d="M14 6v8.2a3.2 3.2 0 1 1-2.2-3" />
          <path d="M14 8.2c.8 1.6 2.2 2.6 4 2.8" />
        </Glyph>
      );
    case "facebook":
      return (
        <Glyph>
          <path
            d="M14 8h2V5h-2c-2.2 0-3.4 1.3-3.4 3.2V10H9v2.6h1.6V19H14v-6.4h2.1L17 10h-3V8.4c0-.3.2-.4.5-.4z"
            fill="currentColor"
            stroke="none"
          />
        </Glyph>
      );
    case "snap":
      return (
        <Glyph>
          <path d="M12 4.5c2.6 0 4.4 1.8 4.4 4.4 0 1 .3 1.6.7 2.1.3.4 0 .9-.5 1-.6.1-.8.6-.8 1.2 0 .7-.7 1.3-1.4 1.5-.6.2-1 .7-1.4.7s-.8-.5-1.4-.7c-.7-.2-1.4-.8-1.4-1.5 0-.6-.2-1.1-.8-1.2-.5-.1-.8-.6-.5-1 .4-.5.7-1.1.7-2.1 0-2.6 1.8-4.4 4.4-4.4z" />
        </Glyph>
      );
    case "search":
      return (
        <Glyph>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </Glyph>
      );
    case "bag":
      return (
        <Glyph>
          <path d="M6.5 8h11l-.8 11H7.3L6.5 8z" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </Glyph>
      );
    case "menu":
      return (
        <Glyph>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </Glyph>
      );
    case "close":
      return (
        <Glyph>
          <path d="M6 6l12 12M18 6 6 18" />
        </Glyph>
      );
    case "card":
      return (
        <Glyph>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </Glyph>
      );
    case "home":
      return (
        <Glyph>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M7 10.5V20h10v-9.5" />
        </Glyph>
      );
    case "grid":
      return (
        <Glyph>
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" />
        </Glyph>
      );
    case "bell":
      return (
        <Glyph>
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </Glyph>
      );
    case "pin":
      return (
        <Glyph>
          <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
          <circle cx="12" cy="11" r="2" />
        </Glyph>
      );
    case "box":
      return (
        <Glyph>
          <path d="M3 8l9-4 9 4-9 4-9-4z" />
          <path d="M3 8v8l9 4 9-4V8" />
          <path d="M12 12v8" />
        </Glyph>
      );
    default: {
      const missed: never = name;
      return missed;
    }
  }
}

export function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconStar({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" className={on ? "star on" : "star"}>
      <path d="M10 1.8 12.2 6.4l5 .7-3.6 3.5.9 5L10 13.4 5.5 15.6l.9-5L2.8 7.1l5-.7L10 1.8z" />
    </svg>
  );
}
