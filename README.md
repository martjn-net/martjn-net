# martjn.net

New hub website for martjn.net — plain static HTML/CSS, no build step.

**Live:** [https://martjn.net](https://martjn.net) (after cutover from the
interactive SQL experiment, which lives on in
[martjn-net-interactive-sql-engine](../martjn-net-interactive-sql-engine)).

## Structure

- `index.html` — hub page (projects)
- `playlist-warden/` — product page for the Playlist Warden browser extension
  - `index.html` — application home page (required for Google OAuth verification)
  - `privacy.html` — privacy policy (same domain, required for OAuth/CWS)
- `style.css` — shared minimal stylesheet

## Notes

- Content is English by design (Google OAuth review reads these pages).
- No cookies, no analytics, no JS needed.
- Deployment: static files to the martjn.net host (Hetzner).
