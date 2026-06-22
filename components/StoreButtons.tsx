import { BRAND } from "@/lib/brand";

export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={BRAND.appStore}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 rounded-2xl bg-ink px-5 py-3 text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.89-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.84 1.31 10.41.87 1.26 1.9 2.67 3.26 2.62 1.31-.05 1.8-.85 3.38-.85 1.58 0 2.02.85 3.4.82 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.88 1.42-2.95-.03-.01-2.72-1.04-2.75-4.14M14.5 4.4c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45" />
        </svg>
        <span className="text-left leading-tight">
          <span className="block text-[10px] opacity-70">Download on the</span>
          <span className="block text-sm font-semibold">App Store</span>
        </span>
      </a>

      <a
        href={BRAND.playStore}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 rounded-2xl bg-ink px-5 py-3 text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path fill="#00D9FF" d="M3.6 2.2c-.3.3-.5.7-.5 1.3v17c0 .6.2 1 .5 1.3l.1.1L13 12.6v-.2L3.7 2.1z" />
          <path fill="#00F076" d="M16.4 15.8 13 12.4v-.2l3.4-3.4.1.1 4 2.3c1.2.6 1.2 1.7 0 2.4z" />
          <path fill="#FF3A44" d="M16.5 15.7 13 12.3 3.6 21.8c.4.4 1 .5 1.8.1z" />
          <path fill="#FFC400" d="M16.5 8.9 5.4 2.1c-.8-.4-1.4-.4-1.8.1l9.4 9.4z" />
        </svg>
        <span className="text-left leading-tight">
          <span className="block text-[10px] opacity-70">Get it on</span>
          <span className="block text-sm font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
