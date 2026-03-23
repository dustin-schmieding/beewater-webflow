# Webflow Dev — Cursor Component Library

A personal library of Webflow-ready JavaScript components, CSS, animations,
and CMS automation scripts — built in Cursor and deployed via jsDelivr CDN.

---

## CDN Base URL

All files in this repo are served via jsDelivr:

```
https://cdn.jsdelivr.net/gh/[YOUR_GITHUB_USERNAME]/[YOUR_REPO_NAME]@main/
```

### How to Load a File in Webflow

**JavaScript component:**
```html
<script src="https://cdn.jsdelivr.net/gh/[USERNAME]/[REPO]@main/components/[filename].js"></script>
```

**CSS file:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/[USERNAME]/[REPO]@main/components/[filename].css">
```

### Force a Cache Purge (during development)
```
https://purge.jsdelivr.net/gh/[USERNAME]/[REPO]@main/[path/to/file.js]
```

---

## Folder Structure

```
webflow-dev/
├── components/       Self-contained UI components (JS + CSS)
├── interactions/     Scroll animations, GSAP, motion effects
├── cms-scripts/      Node.js scripts for Webflow API automation
└── utils/            Shared helper functions
```

---

## Local Setup (for CMS scripts)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then edit .env with your real Webflow API token and Site ID
```

---

## Component Index

> Update this table as you add components.

| File | Description | Load |
|------|-------------|-------|
| nav-beewater.css | Full-width nav bar — logo left, links + CTA right, gold background | Site-wide (Head) |
| nav-beewater.js | Scroll state (bw-scrolled class) for nav on all pages | Site-wide (Footer) |

---

## CMS Script Index

> Update this table as you add scripts.

| File | Description | Usage |
|------|-------------|-------|
| — | — | — |

---

## Key References

- [Webflow Data API v2 Docs](https://developers.webflow.com/data/reference)
- [jsDelivr CDN](https://www.jsdelivr.com/)
- [GSAP Docs](https://gsap.com/docs/v3/)
- [Webflow University](https://university.webflow.com/)

