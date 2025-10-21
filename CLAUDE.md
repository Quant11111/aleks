# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio website for Alexandra, a creative designer specializing in graphic design, motion design, and event communication. The site is a single-page application with dark magazine-style design, serving content dynamically from JSON via CloudFront CDN.

**Tech Stack**: Vanilla JavaScript, HTML5, CSS3, Python HTTP server for development, PM2 for production

**Architecture**: Content-driven static site with no build process or npm dependencies. All media assets served from AWS CloudFront (`https://d5u195w6r6k85.cloudfront.net`).

## Development Commands

### Local Development
```bash
./start.sh                    # Start Python HTTP server on port 3002
# OR
npm run start                 # Alternative command (runs same Python server)
```
Access at: http://localhost:3002

### Production (PM2)
```bash
mkdir -p logs                 # Create logs directory (required for PM2)
npm run pm2:start             # Start PM2 instance named "aleks"
npm run pm2:restart           # Restart after changes
npm run pm2:stop              # Stop the instance
```

**PM2 Configuration**: Uses [ecosystem.config.js](ecosystem.config.js) with process name "aleks" on port 3002

### Deployment
GitHub Actions workflow automatically restarts PM2 on push to main branch (self-hosted runner).

## Core Architecture

### Content System
Portfolio content is managed through [content.json](content.json), which defines projects across four categories:
- `evenement` - Events section
- `communication` - Communication projects
- `graphisme` - Design/graphic work
- `motion-design` - Motion design projects

**Content Structure**:
```json
{
  "name": "Project name",
  "type": "communication|evenement|graphisme|motion-design",
  "description": "Project description",
  "format": "portrait|paysage",
  "hideText": true|false,
  "photos": [{"name": "path/file.jpg", "description": "..."}],
  "videos": [{"name": "path/file.MOV", "description": "..."}]
}
```

**Media Handling**:
- All media paths in `content.json` are relative and prefixed with `CLOUDFRONT_URL` constant in [script.js:2](script.js#L2)
- GIF files are treated as images (using `<img>` tags), not videos
- Videos support hover-to-play on grid items and autoplay in modals
- Multi-media projects display carousel with navigation controls

### JavaScript Architecture ([script.js](script.js))

**Key Functions**:
- `loadPortfolioData()` - Fetches content.json and populates sections
- `generatePortfolioSections()` - Filters content by type and creates DOM elements
- `createPortfolioItem(item)` - Builds individual portfolio grid items with media, content, and overlay
- `createMediaElement(item)` - Handles images/videos/GIFs with appropriate HTML elements
- `openModal(item)` / `closeModal()` - Full-screen media viewer with carousel for multi-media items
- `createCarousel(item, container)` - Multi-image/video carousel with keyboard navigation

**Navigation**:
- Sticky navbar with hide-on-scroll-down behavior
- Mobile hamburger menu
- Smooth scroll to sections with active state highlighting
- Section IDs: `#accueil`, `#evenements`, `#communication`, `#graphisme`, `#motion-design`, `#contact`

**Animations**:
- IntersectionObserver-based fade-in animations for sections and portfolio items
- Staggered children animation for grid items
- Video hover effects (play on mouseenter, pause on mouseleave)

### Styling ([styles.css](styles.css))

Dark magazine aesthetic with asymmetric grid layouts, optimized for mobile-first responsive design.

## Important Implementation Details

### Content Management
- Adding new projects: Edit [content.json](content.json) with proper type, format, and media paths
- Media must be uploaded to CloudFront; update paths in JSON accordingly
- Use `hideText: true` to exclude items from portfolio grids (e.g., hero video)
- Special handling exists for "Inauguration de la boutique mediumRARE" project (adds specific CSS class)

### Video/GIF Handling Logic
Files ending in `.gif` are rendered as `<img>` tags, not `<video>` tags. This is critical for proper display of animated GIFs. Real videos use `<video>` elements with:
- Grid items: muted, loop, preload="metadata", hover-to-play
- Modal: controls, autoplay, muted

### Modal System
- Displays single media or carousel for multi-media projects
- Keyboard controls: Escape to close, Arrow keys for carousel navigation
- Stops all videos when modal closes or carousel changes slides
- Prevents body scroll when modal is open

### No Build Process
This is a pure static site with no transpilation, bundling, or preprocessing. All code runs directly in the browser. Do not introduce build tools, package managers (beyond npm scripts wrapper), or compilation steps unless explicitly requested.

## File Structure

```
.
├── index.html              # Main HTML structure with sections
├── styles.css              # Dark magazine design system
├── script.js               # Vanilla JS application logic
├── content.json            # Portfolio content data (MODIFIED FREQUENTLY)
├── manifest.json           # PWA manifest
├── ecosystem.config.js     # PM2 process configuration
├── start.sh                # Development server script
├── package.json            # Minimal npm scripts (no dependencies)
├── .github/workflows/
│   └── deploy.yml          # Auto-restart PM2 on push to main
└── logs/                   # PM2 logs directory (git-ignored)
```

## Common Tasks

### Adding a New Portfolio Item
1. Upload media to CloudFront
2. Edit [content.json](content.json) with new entry
3. Set correct `type` field to match target section
4. Use relative CloudFront paths (e.g., `communication/project.jpg`)
5. Test locally, commit, push to auto-deploy

### Modifying Content Sections
Section rendering is controlled by the mapping in `generatePortfolioSections()` at [script.js:71-76](script.js#L71-L76). Section IDs in HTML must match grid IDs in this function.

### Debugging Content Loading
Check browser console for errors from `loadPortfolioData()`. Common issues:
- Invalid JSON syntax in content.json
- Missing or incorrect CloudFront paths
- Incorrect `type` values not matching section keys

### SEO/Metadata Updates
All meta tags, structured data, and OpenGraph tags are in [index.html](index.html) `<head>` section. Update there for SEO changes.
