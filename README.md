# MicCheck AI — Live Voice Quality Audit Workspace

MicCheck AI provides podcasters, video creators, audio engineers, and content teams with instant, browser-based feedback on audio health. Instead of spending hours in a DAW or publishing sub-par recordings, users receive real-time metrics on SNR, voice activity, true peak, and LUFS loudness to make confident **publish-or-re-record** decisions in seconds.

---

## Key Capabilities

* **Instant Voice Quality Audits**: Analyze recorded or uploaded audio for essential standards (SNR, LUFS, True Peak, VAD).
* **Flexible Light / Dark Mode**: Adaptive, accessible user interface optimized for diverse lighting conditions and prolonged studio sessions.
* **Tiered Access Engine**: Seamless credit system for free-tier evaluation alongside instant Pro upgrades via URL parameters and persistent state management.
* **Client-Side First**: Fast analysis without mandatory server-side rendering delays, maintaining privacy and speed.

---

## Technical Stack

* **Framework**: [TanStack Start](https://tanstack.com/start) / React
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Icons & UI**: Lucide React, `next-themes`
* **Deployment**: Vercel

---

## Roadmap & Upcoming Features

To make MicCheck AI the end-to-end standard for vocal asset validation, the following features are currently under active development:

- [ ] **User Authentication & Cloud Persistence**: Dedicated creator profiles to access history across devices.
- [ ] **Multi-Language Support (i18n)**: Native UI support for global creators (French, English, Arabic, etc.).
- [ ] **Automated Audio Enhancement**: One-click background noise removal and automated LUFS normalization.

---

## Local Development Setup

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### Installation

1. **Clone the repository:**
```sh
   git clone <this-repository-url>
   cd <repository-name>
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Start the local development server:**
```bash
   npm run dev
```

### Project Structure

```plaintext
├── src/
│   ├── components/       # Reusable UI components (SiteHeader, ThemeToggle, AuditReport, etc.)
│   ├── routes/           # TanStack file-based routing system (/workspace, etc.)
│   └── lib/              # Audio processing and analysis algorithms
├── public/               # Static assets
└── tailwind.config.js    # Theme and dark mode configuration
```

Built with [Lovable](https://lovable.dev) and maintained for high-performance audio verification.
