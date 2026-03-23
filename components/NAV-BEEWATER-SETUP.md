# Nav BeeWater — Webflow Setup Guide

Full-width nav bar with logo left, links (Work, Story, Services), and CTA right. Gold background.

---

## 1. Create the Nav Symbol in Webflow

1. Open **Components** panel → **+** → create a new **Navbar** component, or add a **Div Block** as a Symbol.
2. Name it something like `Nav BeeWater` or `Site Nav`.
3. Set the Symbol’s ID: select the root element → **Element Settings** (gear) → **ID**: `bw-nav-min`

---

## 2. Build the Structure Inside the Symbol

Use this structure. Webflow class names are yours; IDs/hooks below are for the component.

```
Nav Symbol (id="bw-nav-min")
└── Div (class: bw-nav__inner)  ← inner wrapper, max-width
    ├── Div (class: bw-nav__logo)
    │   └── Link block (href="/")
    │       └── [Logo image or text]
    │
    └── Div (class: bw-nav__right)
        ├── Nav Links (class: bw-nav__links)
        │   └── List
        │       ├── List Item
        │       │   └── Link "Work" (href="/work")
        │       ├── List Item
        │       │   └── Link "Story" (href="/story")
        │       └── List Item
        │           └── Link "Services" (href="/services")
        │
        └── CTA (class: bw-nav__cta)
            └── Link or Button (e.g. "Start a Project")
```

**Required classes (create in Webflow):**
- `bw-nav__inner`
- `bw-nav__logo`
- `bw-nav__right`
- `bw-nav__links`
- `bw-nav__cta`

---

## 3. Add the Symbol to Pages

- Add the Symbol to your **Page Template** (so it appears on all pages), or
- Add it to each page’s Navbar area.

---

## 4. Load the CSS and JS

**Site Settings → Custom Code**

**Head Code** (before `</head>`):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dustin-schmieding/beewater-webflow@main/components/nav-beewater.css">
```

**Footer Code** (before `</body>`):
```html
<script src="https://cdn.jsdelivr.net/gh/dustin-schmieding/beewater-webflow@main/components/nav-beewater.js"></script>
```

Replace `dustin-schmieding` and `beewater-webflow` with your GitHub username and repo name if different.

---

## 5. Hero Scroll State

On the homepage, `hero-beewater-v2.js` also adds the `bw-scrolled` class to `#bw-nav-min`. The nav JS runs site-wide and does the same on other pages.

If you want different styles when scrolled, add in Webflow or in custom CSS:

```css
#bw-nav-min.bw-scrolled {
  /* e.g. add shadow, change opacity */
}
```

---

## Troubleshooting

- **Gold background not showing?** Ensure `--_beewater-colors---bw-gold` exists in your Webflow design. If it doesn’t, add a fallback in the nav CSS: `background: #F5A623;` (or your gold hex).
- **Nav not full width?** Make sure it’s not inside a container with padding that limits width. The nav should be at the top level of the page.
