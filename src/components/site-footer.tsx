import React from "react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/20 py-8">
      <div className="mx-auto max-w-3xl px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} MicCheck AI. All rights reserved.</p>
        
        <div className="flex items-center gap-4">
          <a
            href="https://miccheckai.gumroad.com/frequently-asked-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            FAQ
          </a>
          <span>•</span>
          <a
            href="https://miccheckai.gumroad.com/terms-of-service-and-refund-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Terms & Refund Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
