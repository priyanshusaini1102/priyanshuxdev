# Resume admin

`/admin` edits the resume in the browser and publishes `src/data/resume.json` plus `public/resume.pdf` to `main`. Vercel redeploys from that commit, so [priyanshuxdev.vercel.app/resume.pdf](https://priyanshuxdev.vercel.app/resume.pdf) updates without a developer. The page is not linked from the public site, and it is `noindex`.

Set these three environment variables on the Vercel project before signing in. If either admin variable is missing, login stays disabled.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password checked only on the server. |
| `ADMIN_SESSION_SECRET` | HMAC key for the 7-day session cookie. Use a long random string. |
| `GITHUB_TOKEN` | Fine-grained personal access token used to commit the resume. |

Optional: `GITHUB_REPO` (default `priyanshusaini1102/priyanshuxdev`) and `GITHUB_BRANCH` (default `main`).

## GitHub token

1. GitHub → Settings → Developer settings → Fine-grained personal access tokens → Generate new token.
2. Resource owner: the account that owns this repo. Repository access: **Only select repositories** → `priyanshuxdev`.
3. Permissions: **Contents: Read and write**. Nothing else is required.
4. Copy the token into the Vercel `GITHUB_TOKEN` variable. Do not commit it.

The token identity becomes the author of the resume commit.

## How publishing works

1. Sign in at `/admin`. The password is compared on the server with a SHA-256 digest and `timingSafeEqual`. A matching login sets an `HttpOnly`, `Secure` (on HTTPS), `SameSite=Strict` cookie signed with `ADMIN_SESSION_SECRET`. It expires in 7 days. Failed attempts back off, and eight failures inside 15 minutes are blocked. The password and token never go into the client bundle.
2. The editor loads `src/data/resume.json` from GitHub through `GET /api/resume`, so a second edit sees the latest commit rather than the copy baked into the deploy.
3. **Download PDF** builds a text PDF in the browser. **Publish** sends that PDF and the JSON to `POST /api/resume`.
4. The API checks the session, the JSON shape, and the PDF size, then writes both files in one commit via the GitHub Git Data API. The message is `Update resume via admin`. If `main` moved, it retries from the new head.
5. The page shows “Published, live in about a minute” and a link to the commit. Vercel’s Git integration redeploys `main`, which replaces `/resume.pdf`.

Local `npm run dev` serves the same `/api` routes. On plain HTTP the session cookie omits `Secure` so a local browser can keep it; every Vercel deployment is HTTPS and sets `Secure`.
