# Kursat Kilic Premium GitHub Pages Portfolio

This is a no-terminal static website package for a premium academic publication portfolio.

It is designed for browser-only deployment to GitHub Pages. No Node, npm, Astro, Vite, terminal, or build step is required.

## What is inside

- `index.html` - the complete one-page portfolio
- `styles.css` - premium dark engineering visual design
- `script.js` - animations, filtering, copy citation buttons, and procedural 3D hero
- `data.js` - all editable profile, publication, project, and timeline content
- `assets/favicon.svg` - custom favicon
- `assets/og-image.svg` and `assets/og-image.png` - social preview image
- `.nojekyll` - tells GitHub Pages to publish the files directly
- `404.html` - fallback page for GitHub Pages
- `robots.txt` and `sitemap.xml` - basic search indexing helpers
- `SOURCES.md` - source notes for public profile information

## Browser-only upload instructions

1. Create a new GitHub repository named exactly:

   `kilickursat.github.io`

   For a personal GitHub Pages homepage, the repository name should match your GitHub username plus `.github.io`.

2. Unzip this package on your desktop.

3. Open the unzipped folder.

4. Select the files inside the folder, not the parent folder itself:

   - `index.html`
   - `styles.css`
   - `script.js`
   - `data.js`
   - `404.html`
   - `.nojekyll`
   - the `assets` folder
   - this `README.md`
   - `SOURCES.md`
   - `robots.txt`
   - `sitemap.xml`

5. In your GitHub repository page, click:

   `Add file` -> `Upload files`

6. Drag and drop the selected files/folder into the upload area.

7. Click `Commit changes`.

8. Go to:

   `Settings` -> `Pages`

9. Under `Build and deployment`, set:

   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`

10. Click `Save`.

Your site should publish at:

`https://kilickursat.github.io/`

If you upload the site to another repository, the URL will be:

`https://kilickursat.github.io/REPOSITORY-NAME/`

## How to edit content without terminal

Open `data.js` directly in GitHub and click the pencil edit icon.

You can edit:

- profile links
- Google Scholar / GitHub / ORCID links
- publication titles
- DOI links
- project cards
- research areas
- timeline text
- contact links

After editing, click `Commit changes`. GitHub Pages will republish automatically.

## How the 3D hero works

The hero section uses a procedural Three.js scene loaded from a CDN. It creates a rotating TBM cutterhead, tunnel lining rings, and animated data particles directly in the browser.

If the CDN is blocked, the site still shows a CSS-based animated fallback visual.

## How to add a real GLB TBM model later

1. Put your licensed `.glb` file into:

   `assets/models/tbm.glb`

2. Replace the procedural Three.js scene in `script.js` with a GLTFLoader-based scene.

3. Keep the file small. A good web target is under 3 to 5 MB after compression.

4. Only use assets you created yourself, purchased with a compatible license, or downloaded from sources that allow public web use.

## Important notes

- This package avoids Google Scholar scraping. It uses manually curated publication data in `data.js`.
- Citation numbers change over time. The included `119+` metric was based on the public Google Scholar search result available when this package was prepared.
- The email address included in `data.js` was visible on the public GitHub profile at preparation time. Remove or replace it if you prefer.
- Social preview is generated from `assets/og-image.png`.

## Suggested next upgrades

- Add a downloadable CV PDF.
- Add paper thumbnails or graphical abstracts.
- Add real GLB model assets from Blender.
- Add a custom domain such as `kursatkilic.com`.
- Add a publications update workflow using ORCID, Crossref, or OpenAlex later if you decide to use a build system.
