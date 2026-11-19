# Brian's Boat Works & Marina (fan site)

A simple static site for the fictional business from *Grand Theft Auto VI*. Plain HTML, CSS and a little JS. No build step and no external dependencies. Fonts and icons are hosted locally.

## Structure

```
index.html      Home
services.html   Services: Repairs, Equipment, Storage, Rent a Rack
yard.html       The Yard (gallery)
about.html      About Brian and the crew
contact.html    Contact (demo form, sends nothing)
disclaimer.html About this site: parody, trademarks, privacy, credits
404.html        Page not found
.nojekyll       Tells GitHub Pages to skip Jekyll
assets/css/     style.css
assets/js/      main.js (mobile menu, demo form)
assets/img/     Original SVG illustrations, map, favicon
assets/fonts/   Oswald, Source Sans 3, Yellowtail (woff2)
```

All links are relative, except in `404.html`, which uses root paths (`/assets/...`) so the error page renders correctly at any URL depth on the custom domain.

## Publishing on GitHub Pages

1. Create a new repository and upload the contents of this folder to the root (not the folder itself).
2. Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save.
3. After a minute or two the site is live at `https://<username>.github.io/<repo>/`.

## Credits and licenses

- Icons: [Lucide](https://lucide.dev), ISC license (embedded as inline SVG).
- Fonts: Oswald, Source Sans 3 and Yellowtail, SIL Open Font License, via Fontsource.
- All illustrations were drawn for this site. No official Rockstar assets are used.

## Disclaimer

An unofficial fan-made parody project. Not affiliated with, endorsed by or connected to Rockstar Games or Take-Two Interactive. Prices, hours, reviews and copy are made up. 786-555-0109 is a fictional number and is shown only as part of the sign graphic.
