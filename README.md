# Abeeha Baig — portfolio

Personal site for [abeeha-baig.github.io](https://abeeha-baig.github.io/). Static HTML, CSS, and JavaScript. No framework and no build step.

## GitHub Pages

The repository is published from the **`main` branch, folder `/` (root)**. GitHub Pages is already set to the legacy branch source.

[`.nojekyll`](.nojekyll) tells Pages to skip Jekyll and serve the files as they are:

- `index.html` is the site
- `css/styles.css` and `js/main.js` are linked directly
- `Abeeha_resume.pdf` is the downloadable CV
- `assets/` holds the portrait, favicon, and Open Graph image

There is no compile step and no GitHub Actions workflow. Pushing to `main` is enough for Pages to update.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Content

Copy follows the current CV and the public GitHub READMEs for the linked repositories. The site does not include a phone number, home address, date of birth, or visa / relocation notes.
