# Project Structure

This file documents the current project layout.

## Folders

```text
css/
  style.css

html/
  about.html
  about_loggedin.html
  admin.html
  admin_login.html
  firebase.js
  index.html
  index_loggedin.html
  login.html
  profile.html
  reward.html
  reward_loggedin.html
  settings.html
  signup.html

images/
  bin.webp
  castres.webp
  grocerypack.webp
  lucbani.webp
  matillano.webp
  miming.gif
  miming.webp
  notebook.webp
  osorio.webp
  schoolkit.webp
  trash.webp
  user.jpg

includes/
  admin.js
  admin_login.js
  asd.js
  backtotop.js
  login.js
  menu.js
  modal.js
  profile.js
  profilerpage.js
  qrcode.js
  reward.js
  settings.js
  signup.js
```

## Entry Pages

- Public home: `html/index.html`
- Public rewards: `html/reward.html`
- Public about: `html/about.html`
- Login: `html/login.html`
- Sign up: `html/signup.html`
- Logged-in home: `html/index_loggedin.html`
- Logged-in rewards: `html/reward_loggedin.html`
- Logged-in about: `html/about_loggedin.html`
- Profile: `html/profile.html`
- Settings: `html/settings.html`
- Admin login: `html/admin_login.html`
- Admin dashboard: `html/admin.html`

## Deployment Files

- `index.html` redirects visitors from the site root to `html/index.html`.
- `vercel.json` maps root-level routes like `/login.html` and `/login` to the correct files in `html/`.
- `.gitignore` keeps local clutter out of Git.
- `.editorconfig` keeps editor formatting consistent.

