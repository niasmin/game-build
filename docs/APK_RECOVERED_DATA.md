# Recovered original APK data

Source: the supplied `original.apk`, SHA-256 `084f08627db63bb34a8b17408c9784f0af4158dc524694091994281a95d75732`.

## Recovery and validation

`assets/areaCfg/config_th.zip` contains 161 binary tables and 161 Cocos BufferAsset metadata files. All 161 binary tables were decoded and parsed as JSON. For each payload, a four-byte XOR-obfuscated little-endian length declares the JSON byte count; the body alternates two XOR bytes. The declared byte count excludes a trailing terminator. Two common byte pairs are `0x16/0x23` and `0x42/0x63`; the decoder derives the bytes from the JSON prefix and validates the declared size by successful complete JSON parsing. An empty-object table requires its `}` prefix variant. This is data-format recovery, not recovery of server state.

Reproduction scripts and complete decoded local tables: `/workspace/game-analysis/recovery-data/` (`decode_config.py`, `export_portable.py`, `export_rules.py`). `thai-manifest.json` maps each original archive member to its SHA-256 and decoded table. These scripts do not contact original game services or execute native APK code.

## Portable exports

- `public/data/original-heroes.json`: 74 original hero records, initial hero ID 201010, original Thai names, camp/role markers, base attributes, normal/rage skill references and text, skin mappings, and portrait paths. Attribute IDs 2=HP max, 3=ATK, 4=physical defense and 5=spell defense are verified from the recovered `globalconst.ts` module's `HeroAttrT` enum.
- `public/assets/original/heroes/*.png`: 74 correctly mapped portraits. The original hero table section 11's skin row (`base_id * 100 + 1`) supplies `icon`; that icon is looked up as `hricon/{icon}` in `assets/assets/exresdir/cc.config.json`, resolving the image UUID to the native ASTC member. Conversion to PNG preserves logical identities; `provenance.json` records source/output hashes. This replaces the earlier unverified portrait-name assignments.
- `public/data/original-campaign.json`: all 1,837 guard records, 185 world-chapter records, and 27 Thai tutorial/dialogue records. These include original reward/condition and next-guard references; they are not original player progress or battle simulation.
- `public/data/original-skills.json`: original skill metadata, effects references, render hints and round-scaling descriptions.
- `public/data/original-items.json`: 4,795 original item records. Currency 1 is ตำลึง, 2 อีแปะ, 3 ยา EXP, 4 ประสบการณ์, 6 ญาณกล้าขุนพล, 7 แต้มมิตรภาพ and 8 ชื่อเสียงรับสมัคร. Original ticket 20210100 is ป้ายคัดขุนพล.
- `public/data/original-rules.json`: original hero level-up costs (4,000 rows), star/upgrade conditions, faction and synergy bonuses, recruitment mode costs and raw pool weights, skill-effect references and round scalars. These are packaged rules; they do not establish current server enforcement or live odds.

## Examples of corrected original identity

| Hero ID | Original Thai name | Base HP | Base ATK |
|---|---|---:|---:|
| 201010 | เล่าปี่วัยหนุ่ม (initial hero) | 485 | 65 |
| 104010 | โจโฉ | 2363 | 268 |
| 205010 | จูล่ง | 2363 | 378 |
| 205030 | กวนอู | 2363 | 378 |
| 204030 | เตียวหุย | 2194 | 249 |
| 204050 | เล่าปี่ | 2194 | 249 |
| 304040 | ซุนกวน | 2194 | 249 |

These are base config values, not final player stats after level/star/equipment modifiers.

## Remaining limits

The recovered original `warctrl.ts` module registers network message 30001 and hands its received data to `GWarMgr.startWar`. The `bcwar.js` library contains battle visuals/playback behavior. A full authoritative damage simulator has not been demonstrated by these files. The original server responses, live account inventory/progress, original random results, and online systems remain unavailable. Numeric fields such as `sminfo` and raw effect references must not be assigned invented target/damage semantics without further code evidence.

Some referenced currency/item native texture members are absent from this APK (the Cocos config declares them but the member does not exist). Those images were not fabricated or downloaded from game services. All 74 hero portrait members were present.
