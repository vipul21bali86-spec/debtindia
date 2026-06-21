# India Fiscal Pressure Tracker

A free GitHub Pages app that shows:
- live India central government debt estimate,
- debt per citizen,
- interest burden per second,
- interest vs capex,
- interest vs education,
- interest vs health,
- debt-to-GDP context.

## Why this version is better

Debt alone is abstract. Comparisons make it useful and shareable.

## Deploy on GitHub Pages

1. Create a new public repository on GitHub.
2. Upload `index.html`, `app.js`, and `debt.json` to the root.
3. Go to **Settings** > **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for the site URL to appear.

## Update data

Edit `debt.json` when you get newer official figures.

## Suggested next upgrades

- Add a debt-to-GDP trend chart.
- Add state debt and total public debt.
- Add taxpayer comparison if you bring in filer or direct taxpayer data.
- Add GitHub Actions to auto-refresh the JSON file.
