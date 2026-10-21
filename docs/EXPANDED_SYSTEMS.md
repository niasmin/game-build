# Web systems 0.4

This release adds connected offline UX, not complete APK parity.

- System hub connects daily tasks, daily shop, equipment, stars and existing screens. Arena, guild and events report unavailable original services; they do not fabricate opponents, members or rewards.
- Daily shop uses all nine packaged shop101 offers, exact item quantities, costs, limits and level conditions. Purchase confirmation precedes atomic debit. UTC midnight reset is a web policy, not verified original server time. No VIP overrides or random refresh.
- Four of sixteen source daily tasks are supported: login, shop purchase, recruit and idle claim. Exact fixed normal_gain rewards; unsupported tasks listed separately. Progress starts in this release and resets daily, without retrospective grants. Activity chests and ratio rewards are not enabled.
- Twelve equipment positions use source subclass mappings. Wear, replace and remove conserve copies; replacement returns the old item. Base item HP/ATK/P.DEF/M.DEF affect detail, displayed team power and local battle. Forge, level upgrades, affixes and suit bonuses remain unavailable.
- Star UI shows source next-star conditions. Supported material paths use packaged same-hero item links and exact replacement-item conditions. One whole-hero token is reserved for an owned hero because the earlier reward model retains its unlock token. Other hero instances are never silently consumed. Higher-star duplicate conditions and leader conditions are blocked. Star advancement extends packaged level ceilings; star attribute bonuses are not yet applied, and this is stated in the UI.
- Existing version2 local saves migrate without resetting progress. Equipment and stars persist. Local browser data can be edited by its owner; no server trust or multiplayer economy is claimed.

Source tables are identified in `public/data/original-expanded-systems.json`. Only data required by this release is published; recovered service configuration is not included.

Validation: 21 model tests, browser purchase/claim/equipment/star/reload flows, four-screen viewport checks at360/390/720/1440, zero browser errors or failed requests. Browser screenshots and current run receipt are under docs. Production build and Pages artifact checks are recorded separately in release validation.
