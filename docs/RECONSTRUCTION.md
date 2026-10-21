# APK reconstruction: recovered evidence and remaining gaps

## Original artifact

The supplied Google Drive file is `samkok-new-force-11-1-97.apk`, 153,360,028 bytes, SHA-256 `084f08627db63bb34a8b17408c9784f0af4158dc524694091994281a95d75732`.
REA6.7.0 inventoried8,063 members. Full Evidence: `/workspace/game-analysis/rea-artifact.json`, ID `ev_2fbb93bec1e996440fc83e92c4ffb824216445efe0f532955a855cdf324c1aeb`.

The package is `com.jsjssea.google`, launcher `com.cocos.game.AppActivity`. Packaged settings identify Cocos Creator3.4.1, Android, portrait720×1280 and `db://assets/scenes/game.scene`.

## Recovery completed after the first prototype

The initial prototype used newly invented six-hero gameplay. It was not a faithful port. The expanded reconstruction replaces that foundation with recovered configuration and artwork.

- All40 encrypted `.jsc` files were decoded to JavaScript, including the8.3MB main bundle and217KB battle renderer. ARM64 loader instructions reference an embedded16-byte asset-decryption key at virtual address `0x9ca6c9`; XXTEA decoding and gzip decompression recover UTF-8 scripts. The key is not printed or stored in this project. `docs/script-recovery-receipt.json` preserves source member names and decoded SHA-256 digests. Optional reproducible extractor: `scripts/recover-cocos-scripts.py` (Python `pyelftools` and `xxtea` required; exact APK only).
- Main bundle contains1,644 named SystemJS modules. Focused static REA analysis of `maincityview`, `mainlinectrl`, `configmgr`, `heroctrl` completed with Evidence ID `ev_8afad62f8a7ae034f5e5593e45cbd95e11678c6ffd4a0b00007fcc6dcf43680a`; full record `/workspace/game-analysis/rea-recovered-gameplay.json`. Analysis is limited to those four selected sources and does not prove execution or whole-game coverage.
- All161 Thai binary configuration payloads are decoded using their header and alternating XOR bytes. Portable curated records are in `public/data/`. Original hero IDs, Thai names, base attributes, skill descriptions and portrait mappings replace guessed equivalents. Attribute2=HP,3=attack,4=physical defense,5=magic defense is corroborated by the recovered `HeroAttrT` enum.
- Recovered configuration also includes4,795 item records,4,000 hero level-cost entries, star conditions, faction/synergy data and recruitment cost/pool metadata. Their presence does not establish server RNG probabilities.
- Original portrait mapping follows hero skin record → icon ID → Cocos UUID → native image. Correctly mapped portraits are in `public/assets/original/heroes/`. This supersedes the first prototype's unverified six illustrative portraits.
- Original city, login, battlefield and sliced UI atlas art is recovered to `public/assets/recovered/`; asset provenance records include logical Cocos names and source identities. Original maincity prefab node dimensions/positions are inspected as static layout evidence.

Recovered scripts remain in `/workspace/game-analysis/recovered-scripts` for local investigation. They are not copied wholesale to the public website: Android bindings and embedded platform/service configuration are not a runnable or appropriate browser bundle.

## What is not yet a complete port

The APK's bundled `cc.js` is a native JSB engine, not an HTML5 runtime. An official matching3.4.1 HTML5 engine was built from source commit `393bb3a3e70dc1cc9f81c791e4bdb24bd06bf9e6` under `/workspace/game-analysis/cocos-runtime`. A separate local harness at `/workspace/game-analysis/original-web` rendered the authentic original login screen with zero page errors. Narrow adaptations expose global engine exports, supply recovered custom AppMessage/Spine web behavior, materialize packaged config ZIPs, and select the original H5 adapter. This validates original frontend startup to login, not authenticated gameplay. Outbound original-service requests were blocked with CSP. See `docs/screenshots/authentic-cocos-login.png`. This experimental runtime and its full recovered scripts are not published as the playable web site.

Recovered `warctrl` receives network message30001, passes it to `recvWarData`, then `GWarMgr.startWar`. The shipped battle code plays server-provided data; that does not establish a recovered authoritative combat simulator. The offline website must distinguish recovered names/stats/descriptions/art from its local simulated effects and state.

No original server, official accounts, payment processing, multiplayer, official summon rates or authoritative server-side damage formulas are reconstructed merely by recovering the APK. No requests to original game services are made. Original account/save compatibility and gameplay/visual parity remain unverified without reference runtime captures and supported backend behavior.

Original artwork retains its original rights; no third-party relicensing is implied.

## Expanded website implementation and validation

The shipped website is the data-driven offline adaptation, not the full original Cocos runtime. It uses74 source-mapped heroes, source item names/factions, source guard order/rewards, source career level-cost/attribute tables and star ceilings, original backgrounds/menu art/font, and original starter-character animations rasterized offline into PNG sheets. `characters.js` draws those sheets without publishing a skeletal-animation runtime. Attack/hit/skill/idle/death clips now exist for13heroes whose complete native payloads were found. An all-native-bundle UUID search confirmed61other referenced models are not present as complete payloads. Four actual hero-card illustrations are also available. The browser normalizes per-character visible idle bounds and renders higher-resolution sprite sheets; unsupported heroes retain correctly mapped portrait fallbacks.

Starting purse, local enemy lineup/stat scaling, attack/energy/timing/target selection and deterministic recruitment outcomes remain local design choices. The first2guard reward IDs map to the original young GuanYu/ZhangFei heroes. Formation allows6standard slots, corroborated by recovered `dmblview`. No claim is made that1837battles were played or all original skill effects implemented.

## Version0.3 fidelity improvements

- Full-screen hero chamber uses original background, source rarity colors, actual artwork/animation, stat/skill tabs and a separate owned roster. It is a browser layout adaptation, not a claim of pixel-identical original UI.
- Formation preserves6explicit positions through swaps, placements, removals, rewards and save reloads. Local battle rendering uses these positions; local single-target simulation prioritizes the front row.
- Growth now respects `min(starCap,stageCap)` and exact breakthrough costs. Current cumulative stage attributes are added once. Legacy saves without stages infer the least required stage to preserve already-paid levels rather than resetting progress. Final server-stat parity remains unverified.
- Original item atlas was found across bundle boundaries: logical `jsres` mapping and native `jspre` PLIST/ASTC.190icons have exact numeric mappings and provenance.88whitelisted fixed-use recipes and74fragment recipes are available; the local unique-hero model rejects duplicate-hero fragment conversion. No selling command is invented.
- Idle income uses only the original displayed IDs2/3/4/5 and their per-minute rates with a720-minute base cap. Local timestamp accrual, integer payouts, fractional carry and stage-change checkpoints are explicitly an offline service adaptation. Original account privileges, authoritative server rounding and time validation are not reproduced.

Further evidence: `docs/APK_INVENTORY_IDLE_GROWTH.md` and `public/data/original-system-rules.json`.
