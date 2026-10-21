# Original inventory, idle income and growth rules

These findings are bounded to the supplied APK and the recovered client modules. `public/data/original-system-rules.json` exports the verified rows and source references. It does not reproduce unavailable authoritative server code.

## Inventory

`item_cfg.goodsData` has 4,795 rows. **None enables selling**: every `sell` is zero/empty and every `sell_price` is empty. A generic sell-for-gold action would be invented and should remain unavailable.

88 rows are ordinary items (`class=2`, `subclass=2`) with `use=1` and an explicit flat `use_gain` tuple list. These provide a conservative fixed-outcome use whitelist. For example, item 20210501 (`หยกมณีเรียกศักดิ์สิทธิ์`) has `use_gain={1,100}`: one item corresponds to 100 ตำลึง in its packaged metadata. Three additional items have `use_gain` but `use=0`; those are excluded. Other usable items may be random gifts, selectable gifts, timed/resource packs or dependent systems, so `use=1` alone is insufficient to infer their behavior.

The original `bagctrl.useItem` sends network request 11305 with bag type, server item instance ID, quantity and optional selection arguments. The response governs success. Applying the whitelisted fixed tuple locally is an explicit offline-service adaptation. Validate count and stock before any mutation; consume and grant atomically; reject unsupported actions unchanged.

Original `item_cfg[2]` supplies 74 exact complete-item/fragment/hero mappings. `globalfunc.getHeroDataByHeroItemId` matches `item_id`; `getHeroDtByPieceId` matches `change_id`. `comb_cfg[1]` contains 74 fixed fragment recipes plus random-rule recipes. For example, 50 of fragment 1105010 maps to hero 105010. `getPieceNeedCount` reads the recipe count. `bagctrl.useHeroPiece` sends request 11307 and processes the server hero list. Complete hero items have `class=4, subclass=2, use=0` and do not have a normal consumable use action. Immediate activation on local grant is a local service decision using the exact mapping, not recovered original server activation timing.

## Idle income

`mainlinemdl.getFixedHangIncome` reads `main_guard_cfg[3][guard_id].hang_up_normal`, uses tuple element 0 as the item ID and element 1 as its rate, and filters displayed fixed rates to IDs **2, 3, 4, 5**. It does **not** multiply by the third element. `hangdetail.upData` prints the rates with **`/m`**, confirming **per minute**, not per second.

Guard 101001's exact raw tuples include `{4,50,1},{3,100,1},{2,17,1},{5,2.5,1}`. Thus its displayed base rates are 50 player EXP/minute, 100 hero EXP medicine/minute, 17 coins/minute and 2.5 journey points/minute. Other raw tuple entries are not part of this displayed fixed-rate subset; their server accrual semantics are not inferred here.

The original status response 16400 supplies `sum_goods`, `gain_time`, `max_time` and rate-modifier `item_list`. `receHangUpData` converts `max_time/60` to the UI minute limit. `mlhangup` computes/clamps the **displayed elapsed time** as server time minus `gain_time`; its one-second timer only updates the clock and requests a refresh each minute. Claim request 16401 returns the actual goods and new timestamp. Quick claim 16402 likewise returns goods.

The packaged `hang_up_cfg[1][3].val=720` is the normal default cap in **minutes** (12 hours); row 6 is quick income duration 120 minutes. `mainlinectrl.openHangRwdSucc` multiplies these by 60 for its duration display. The actual cap remains the server-provided `max_time`, potentially affected by privileges. Without original server/entitlement state, a local model may explicitly choose the base 720-minute cap and no premium bonus. A formula such as `floor(rate * elapsedSeconds / 60)` is a reasonable local adaptation but **not recovered server rounding**. Keep fractional remainder if supporting repeated short claims; reject negative/future times and cap offline catch-up. Original random idle drops are not reproduced merely by this formula.

## Hero level and stage

The recovered `heromdl` establishes these lookups:

- `heroLvLoss(hero)`: `hero_cfg[3][career * 10000 + CURRENT level].loss`.
- `heroStageLoss(hero)`: `hero_cfg[16][career * 100 + CURRENT stage].loss`.
- `maxLevCheck(star,stage)`: minimum of `hero_cfg[9][star].level_max` and `hero_cfg[15][stage].level_max`.
- `getHrStageMax(star)`: minimum of the star row's `stage_max` and constant `hero_cfg[1][12].val` (5).
- Breakthrough is offered when `hero.lev == hero.maxLev` and `hero.stage < getHrStageMax(hero.star)`; exact required currencies/materials must also be available.

Stage level caps are 0→20, 1→40, 2→50, 3→60, 4→80, 5→1000. The star cap can be lower. All 24 stage cost rows and 4,000 level cost rows are exported.

Career 1, level 1 costs `{3,10},{2,200}` to advance. Career 1, stage 0 costs `{2,10000},{20110101,50}` to advance. The **current** row gives the transition cost. The **resulting** level/stage row gives that state's cumulative attribute add-on; do not add all earlier rows repeatedly. Original `countBookAttr` selects only one max-level row and one max-stage row for its book preview. That supports cumulative-record interpretation but does not establish a complete final player-stat formula including every star/equipment modifier; final live attributes are server state. `serHeroLvLoss`/`serHeroStageLoss` prefer matching server-supplied costs when present, with these tables as fallback.

## Recommended transaction tests

- Fixed use consumes exactly the requested positive integer count and grants exact tuple × count; insufficient stock, `use=0`, unsupported gift or zero/negative count leaves save unchanged.
- Selling any current original item is rejected unchanged.
- Fixed fragment conversion at 49/50/100 fragments rejects/grants one/grants two, with exact stock deductions and no duplicate unique-hero activation side effects unless explicitly modeled.
- Career/level keys select exact costs; a failed payment changes neither currency nor level.
- Stage 0 at level 19 cannot break through; at level 20 with exact materials it advances once, deducts exact costs, and raises the applicable cap to `min(star cap,40)`.
- Idle zero/negative elapsed grants nothing; 60 seconds at guard 101001 uses per-minute values, not ×60; long elapsed caps at 720 minutes in the local base mode. Repeated short claims preserve total fractional entitlement, and claims cannot duplicate already-credited intervals.
