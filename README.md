# Mic Check AI

Act as an expert Full-Stack Engineer and UI/UX designer. Build a complete, modern SaaS web application called "MicCheck AI" using Next.js (App Router), TypeScript, Tailwind CSS, and Lucide React for icons. 

The application is an AI-powered audio analysis tool for content creators, podcasters, and voice-over artists to check audio file quality before publishing.

Please create the following structure and features:

1. Landing Page:

   - A clean, modern SaaS hero section with a dark mode aesthetic (slate/zinc colors with an accent of indigo or violet).

   - Clear value proposition: "Instantly analyze your audio for background noise, clipping, and loudness before you publish."

   - A clear "Try for Free / Upload" Call to Action.

2. Dashboard / Workspace (Protected route mockup or main interactive view):

   - A drag-and-drop file upload zone for audio files (MP3, WAV).

   - An interactive "Analyzing..." state simulating audio processing checks:

     * SNR (Signal-to-Noise Ratio)

     * VAD (Voice Activity Detection)

     * Peak Level & Loudness (LUFS)

   - A dynamic "Audit Report" results screen:

     * Status badge: Green ("Ready to Publish") or Red ("Needs Re-recording / Too much background noise").

     * Detailed breakdown metrics list with clean progress bars or badges (e.g., "Background noise detected at 02:14").

   - A freemium limitation notice: "3 free analyses remaining this month. Upgrade to Pro for unlimited checks."

3. Pricing Section:

   - Two clear pricing tiers: "Free Tier" (3 checks/month) and "Pro Tier" ($9/month for unlimited checks and advanced noise reports).

   - A "Subscribe with Lemon Squeezy" checkout trigger button mockup.

Ensure the code is fully modular, clean, with dummy state handling for file uploads so the UI is immediately interactive and visually stunning. Use modern Tailwind classes (flex, grid, transitions, glassmorphism effects).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://miccheck-pro-audio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e41f5291-0921-47a8-bfd7-03dfa77aa941).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
