import Link from 'next/link';

/**
 * The header component for the Asteroid Launcher page.
 * It is a fixed bar at the top of the screen with a dark background.
 * It contains the site logo, a central call-to-action button, and navigation toggles.
 * This is implemented as a server component as it contains no client-side interactivity.
 */
export default function Header() {
  return (
    <header 
      className="fixed top-0 left-0 z-50 flex h-[60px] w-full items-center justify-between bg-secondary px-6 text-secondary-foreground"
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Left side: Logo */}
      <Link 
        href="/" 
        className="font-sans text-[24px] font-normal italic tracking-[0.5px]"
      >
        NEAL.FUN
      </Link>

      {/* Center: CTA Button, absolutely positioned for correct centering */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          className="h-auto rounded-full border-2 border-border bg-primary px-8 py-3 font-sans text-[14px] font-medium uppercase tracking-[0.5px] text-primary-foreground transition-all duration-200 hover:bg-button-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        >
          CLICK IMPACT LOCATION
        </button>
      </div>

      {/* Right side: Navigation Links */}
      <div className="flex items-center space-x-6">
        <button 
          className="font-sans text-[13px] font-normal tracking-[0.3px] underline underline-offset-4 transition-opacity duration-200 hover:opacity-80"
          aria-current="page"
        >
          Local
        </button>
        <button 
          className="font-sans text-[13px] font-normal tracking-[0.3px] opacity-80 transition-opacity duration-200 hover:opacity-100"
        >
          Use metric
        </button>
      </div>
    </header>
  );
}