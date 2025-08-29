# Repository Guidelines

## Project Structure & Module Organization
- `js/`: core library (`autocompleteBS.js`).
- `css/`: styles (`autocompleteBS.css`) using the `.autocompleteBS` prefix.
- `demo/`: runnable example (`autocompleteBS.html`) and config (`demo/js/autocompleteBSDemo.js`).
- `README.md` and `LICENSE`: overview and licensing.

## Build, Test, and Development Commands
- No build tooling required. Serve statically and open the demo.
- Example: `php -S 127.0.0.1:8000 -t .` then visit `/demo/autocompleteBS.html`.
- Any static server works (e.g., `python -m http.server`, nginx). No Node dependency.

## Coding Style & Naming Conventions
- JavaScript: ES5/ES6-compatible, single quotes, semicolons, 2-space indentation, camelCase for variables/functions.
- CSS: 2-space indentation; class names prefixed with `.autocompleteBS-` where applicable.
- IDs/data attributes used by the lib: `#autocompleteBS-list`, `data-forinputbs`, `data-current`, `data-results`.
- Keep the library dependency-free (vanilla JS). Avoid adding external frameworks.

## Testing Guidelines
- No automated tests currently. If contributing tests, prefer lightweight setup (e.g., Jest + JSDOM) and place alongside source with a `.test.js` suffix.
- Manual test plan via the demo: verify debounce, `minLength`, `maxResults`, keyboard navigation (Up/Down/Tab/Escape/Enter), selection populates target inputs, click-outside handling, and empty-results messaging.
- If changing API shape or defaults, update `demo/js/autocompleteBSDemo.js` and the README.

## Commit & Pull Request Guidelines
- Commits: concise imperative subject (≤72 chars) and rationale in the body. Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) for clarity.
- PRs: include description, linked issues, before/after screenshots or a short demo GIF, test plan, and any docs/demo updates. Keep scope focused and avoid unrelated refactors.

## Security & Configuration Tips
- Render untrusted strings safely (prefer `textContent` over `innerHTML` when possible) to reduce XSS risk.
- External APIs can change; keep `fetchMap` explicit and handle empty/error responses gracefully.
- Maintain consistent prefixes and DOM structure to avoid breaking existing integrations.

