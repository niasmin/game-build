# Validation — expanded version0.2

- `npm test`:7passed,0failed,0skipped. Includes source starter/portrait identity, invalid-save rejection, exact reward parsing, first2battles and original hero unlocks, HP/termination, original costs/star ceilings. Added regression that reward unlocks remain unique and the resulting save reloads correctly.
- Recovery scripts rerun successfully:40/40JSC and161/161Thai config payloads.
- Chromium end-to-end passed:
- login/city original art
- 74 heroes and sanitized skill text
- original upgrade costs
- formation6
- original sprite animation changes pixels
- first two battles reward correct heroes/guards
- recruit250 original cost
- persistent save reload
- item inventory
- profile reset control
- responsive360/390/720/1440

No page errors occurred in the end-to-end run. Original animated canvas pixel changes were verified, beyond checking element presence. Screenshot artifacts are in `docs/screenshots`.

Separate authentic Cocos runtime rendered the original login screen locally; online gameplay was not validated and that research runtime is not the deployed offline website.

Not validated: original server/account integration, original authoritative damage/targeting/RNG behavior, payment, multiplayer, original save compatibility, all1837battles, or pixel-equivalence of every original screen.
