# Verification
Serve the repository root over localhost (for example python3 -m http.server 4173), then run node tests/release.cjs.
Requires Playwright and Chrome. Override PLAYWRIGHT_MODULE and CHROME_PATH for another installation. Default fallback paths match the development machine.
GAME_URL targets another deployment. The upgrade test uses its own localhost server on 4175 and git fixtures from commit 31601a9; keep that history available.
The release runner stops at a failure and writes JSON to RELEASE_REPORT (default /tmp/animal-buddies-release.json). Correct issues, rerun affected tests, and record every result/limitation in docs/RELEASES.md.
Visual capture: node tests/visual.cjs writes screenshots into docs/evidence; inspect them, do not equate capture with approval.
Do not use a real child's browser profile for automated test data.
