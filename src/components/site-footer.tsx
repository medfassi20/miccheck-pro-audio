export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} MicCheck AI. Audio QA for people who publish.</p>
        <p>Built for podcasters, creators and voice-over artists.</p>
      </div>
    </footer>
  );
}
