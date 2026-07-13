# PEXXORAA — Creative Digital Agency Website

A premium, responsive, multi-page website built with vanilla HTML5, CSS3, and ES6+ JavaScript. No frameworks, no build step — just open and go.

## Structure

```
PEXXORAA/
├── index.html          Home — hero, services, industries, process, portfolio preview, testimonials, FAQ
├── about.html           Story, mission, vision, values, milestones
├── services.html        Full service breakdown by category
├── portfolio.html       Filterable project grid
├── blog.html             Searchable article grid
├── contact.html          Validated contact form + business info
├── robots.txt / sitemap.xml
├── css/
│   └── style.css        Design tokens, layout, components, animations, dark mode
├── js/
│   ├── data.js           Sample content (portfolio, blog, testimonials, FAQ)
│   └── main.js           All interactivity: nav, theme, reveal, counters, filters,
│                          carousel, accordion, form validation, toasts, cookie banner
└── assets/               images / icons / illustrations / fonts (add your own media here)
```

## Design system

- **Colors**: Primary `#2563EB`, Secondary `#7C3AED`, Accent `#06B6D4`, plus a charcoal dark mode.
- **Type**: Space Grotesk (display), Inter (body/UI), loaded from Google Fonts.
- **Signature element**: the "Design · Develop · Elevate" constellation in the hero, visualizing the brand's three-pillar process as a connected triangle.

## Running locally

No build tools required. Open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```

## Extending

- Replace the sample arrays in `js/data.js` with real portfolio, blog, and testimonial content, or wire them up to a CMS/API.
- Add real photography to `assets/images` and swap the CSS gradient placeholders in `portfolio-thumb` / `blog-thumb`.
- The architecture (services, industries, process) is data-driven where possible, so new services or industries can be added as new cards without restructuring the layout.
