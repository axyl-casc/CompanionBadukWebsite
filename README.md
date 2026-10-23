# Companion Baduk website

A responsive, dependency-free marketing and support website for [Companion Baduk on Steam](https://store.steampowered.com/app/4698830/Companion_Baduk/).

## Run locally

Requires Node.js 20 or newer. No package installation is needed.

```powershell
npm run dev
```

Open the printed address, usually `http://127.0.0.1:4173`.

```powershell
npm run check
npm run build
```

Deploy the contents of `dist/` to any static web host. The pages use relative links, so they also work under a GitHub Pages project path. Configure the host to serve `404.html` for missing pages. `.openai/hosting.json` records the associated Sites deployment identity.

## Deploy with GitHub Actions

1. In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
2. Commit and push the website source (`site/`, `scripts/`, and `package.json`) and `.github/workflows/jekyll.yml` to `main`. Generated `dist/` files do not need to be committed.
3. Open **Actions → Deploy website to GitHub Pages** to follow the deployment. Later pushes to `main` deploy automatically; **Run workflow** also starts a deployment manually.

The workflow uses Node.js 22 to generate and validate all pages with `npm run check`, builds `dist/` with Jekyll, and deploys the resulting `_site/` artifact. No Ruby installation or Jekyll theme is needed locally. See [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for repository setup details.

## Edit the website

- `site/index.html`: home page, feature tabs, screenshot gallery, and FAQ.
- `site/styles.css`: responsive visual design.
- `site/app.js`: accessible mobile navigation, feature tabs, and image dialog.
- `site/legal-content.mjs`: privacy, terms, support/refunds, accessibility, and notices. `scripts/build.mjs` generates full static HTML pages with navigation and page descriptions.
- `site/assets/`: optimized WebP copies of the supplied images. Originals remain in `img/`.
- `scripts/check.mjs`: validates internal links, resources, fragment destinations, page headings, and basic markup requirements.

No analytics, cookies, local storage, third-party fonts, remote media embeds, accounts, or forms are implemented in the website code. The host may process request/security logs or use necessary access cookies independently.

## Content and legal maintenance

Support contact: **companionbaduk@gmail.com**. Developer/publisher display name: **Companion Baduk**, matching Steam. The privacy policy reflects the developer's statement that nothing is automatically reported, diagnostic logs are emailed voluntarily, and there is no multiplayer.

The terms cover the website and support; Steam's agreements and any separately supplied game license govern game purchases and use. The site includes links to Valve's current refund and privacy policies, an accessibility statement, and the AI content disclosure from the Steam listing. These pages are a practical starting point, not a legal compliance certification. Have the operator review them before a public launch, especially if an individual or registered business must be named or an address is legally required.

When changing hosting, review the infrastructure-provider disclosures in the privacy policy. When using a custom domain, update the absolute `og:image` URL in `site/index.html`. If game data collection, cloud features, analytics, payments, release status, requirements, or Steam Deck compatibility change, update the relevant descriptions and policy dates. Do not describe the game as Steam Deck Verified unless Valve grants that rating.

The original screenshots are not regenerated during a build. Optimized assets are checked into the repository so Node.js is the only runtime dependency.

## Visual direction

Deep navy and blue surfaces, vermilion red actions, ivory text, and restrained gold details. There is no green in the website theme. The references are the Temple of Heaven’s blue tiles and red walls, and traditional black-and-white Go stones. See [Beijing’s Temple of Heaven feature](https://english.beijing.gov.cn/specials/beijingmagazine/list/202503/P020250326505054694939.pdf).
