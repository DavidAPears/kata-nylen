import type { MediaKind } from "@/content/facts";

/**
 * Icons for the media jump links.
 *
 * Inline, stroked, currentColor, on a shared 24 grid so they sit at the same
 * optical weight beside each other. Decorative: each one has its label right
 * next to it, so they are hidden from assistive technology rather than given
 * a second name for the same thing.
 */

const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: "false" as const,
};

function Tv({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="2.5" y="7" width="19" height="12.5" rx="2" />
      <path d="M8 3.5 12 7l4-3.5" />
    </svg>
  );
}

function Radio({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="2.5" y="8.5" width="19" height="11.5" rx="2" />
      <path d="M17 4 7.5 8.5" />
      <circle cx="16.5" cy="14.5" r="2.6" />
      <path d="M6 13h4.5M6 16.5h4.5" />
    </svg>
  );
}

function Press({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M4 5h12v14H5.5A1.5 1.5 0 0 1 4 17.5V5Z" />
      <path d="M16 9h3a1 1 0 0 1 1 1v7.5a1.5 1.5 0 0 1-3 0V9Z" />
      <path d="M7 8.5h6M7 12h6M7 15.5h4" />
    </svg>
  );
}

function Podcast({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
      <path d="M8.5 21h7" />
    </svg>
  );
}

function Online({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M2.5 8h19" />
      <path d="M5.5 6h.01M8 6h.01" />
      <path d="M8 20.5h8" />
      <path d="M12 17v3.5" />
    </svg>
  );
}

export const MEDIA_KIND_ICONS: Record<
  MediaKind,
  (props: { className?: string }) => React.ReactElement
> = {
  tv: Tv,
  radio: Radio,
  print: Press,
  podcast: Podcast,
  web: Online,
};
