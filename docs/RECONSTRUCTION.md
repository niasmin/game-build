# APK investigation and browser reconstruction

The supplied Google Drive file is `samkok-new-force-11-1-97.apk` (153,360,028 bytes), not a source ZIP.
SHA-256: `084f08627db63bb34a8b17408c9784f0af4158dc524694091994281a95d75732`.

REA 6.7.0 `inspect-artifact` completed its package inspection. Its full Evidence is retained at `/workspace/game-analysis/rea-artifact.json`; the portable summary is `apk-evidence.json`.
Evidence ID: `ev_2fbb93bec1e996440fc83e92c4ffb824216445efe0f532955a855cdf324c1aeb`.

## Established from packaged files

- 8,063 APK members; manifest package `com.jsjssea.google`, launcher `com.cocos.game.AppActivity`.
- `assets/src/settings.json` reports Cocos Creator 3.4.1, Android, portrait design resolution 720 × 1280, and launch scene `db://assets/scenes/game.scene`.
- Main bundle configuration explicitly declares `encrypted: true`; `assets/assets/main/index.jsc` is 2,194,176 bytes. A browser cannot simply execute this file as JavaScript source.
- Four packaged `libcocos.so` architectures and Android SDK integrations are present. These Android native components are not browser modules.
- Selected original artwork is extracted and ASTC textures converted to PNG. `public/assets/original/provenance.json` records source members, logical Cocos paths and SHA-256 digests. Portrait identifiers were recovered, but their character-name mapping was not verified.
- Apktool 3.0.3 decoded the manifest/resources with original DEX files preserved. Its JAR was checked against the official GitHub release asset SHA-256, `dbf930b076c6b9be08d57c449cacefc3bdd6b71ebd59b3066fc0e1f5b14f9423`.

## What the web project implements

A standalone playable browser prototype with newly written combat rules, team selection, campaign progression and local browser saves. It uses selected supplied artwork for visual continuity. These mechanics, balance, characters and progression are design choices, not recovered original behavior. No account login, payment integration, multiplayer, original backend or original save compatibility is implemented. It makes no requests to original game services.

This is a starting reconstruction, not a complete or behavior-equivalent port. Matching the original requires accessible gameplay scripts or deeper native/runtime analysis, reference playthroughs/screens, and documentation or an authorized replacement for any required backend. No source-equivalence or gameplay-parity validation has occurred.

## Reproduce artwork extraction (optional)

The web game runs from the included PNG files and does not require these Python packages. To re-extract from your own copy of the same APK:

```sh
python -m venv /tmp/samkok-art-env
/tmp/samkok-art-env/bin/pip install Pillow texture2ddecoder==1.0.6
/tmp/samkok-art-env/bin/python scripts/extract-assets.py /absolute/path/to/original.apk
```

Extracted third-party artwork retains its original rights; it is not relicensed as project-authored code. Publication of artwork is separate from local analysis and has not been performed.
