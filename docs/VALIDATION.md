# Validation

- `npm test`: 5 passed, 0 failed, 0 skipped. Save corruption, turn rules, healing/cooldowns, victory rewards and all five campaign chapters covered.
- Chromium end-to-end: changed roster, reloaded save, won battle using UI, received exactly 120 gold, unlocked chapter 2, retained progress on reload, kept chapter 3 locked, opened help.
- Responsive widths 390 and 720 CSS pixels: no horizontal overflow.
- Actual `npm start` server: HTML/modules/art images loaded, mobile battlefield rendered, no page errors.
- Static server blocks dotfiles and server source; selected routes verified after restart.
- Screenshots in `docs/screenshots` show the final UI.

Not validated: original-game behavior parity, original accounts/backend, Android execution, multiplayer, external hosting/deployment. Browser progress is local to its origin and browser profile.
