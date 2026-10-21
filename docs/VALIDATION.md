# Validation — version0.3.0

`npm test`:17passed,0failed,0skipped. Tests include original source data, exact upgrade/breakthrough costs and caps, migration of previously paid levels, fixed item transactions, original fragment recipes, per-minute offline income/cap/fraction carry, guard checkpoints,6-slot preservation, source hero-reward mappings and local front-row targeting.

Chromium UI flows passed:
- original currency icons
- idle live timer/claim and original rates
- fullscreen hero detail, skill tabs, exact breakthrough
- new original character103010 animation
- six slots, swap/place and reload persistence
- fixed-use item transaction and original fragment recipe
- formation-driven combat positions and floating damage
- responsive360/390/720/1440 hero screen

Production `dist/` was served under `/game-build/` and tested at390×844 with device pixel ratio2. All13available original animated characters rendered; no page errors or failed asset responses occurred. Model and UI evidence is separate: original combat/server behavior is not validated by these tests.

All65sprite sheets were audited against metadata dimensions and SHA-256 digests. Their idle viewports were visually inspected together to prevent cropped heads/floating feet. Individual hit/skill/death effects for every hero have not received exhaustive visual parity checks.

See `docs/screenshots/release-0.3-hero.png`, `closer-formation.png`, `closer-idle.png`. Source APK evidence/recovery details remain in `RECONSTRUCTION.md` and `APK_INVENTORY_IDLE_GROWTH.md`.

Not validated: original account/server integration, authoritative combat/RNG results, all1837battles, multiplayer/payment, and pixel-equivalence of every APK screen. The13complete character payloads and4hero-card illustrations were confirmed by cross-bundle searches; other referenced payloads are missing from the supplied APK's native members.
