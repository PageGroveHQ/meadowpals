# Meadow Pals · Little Learners

A calm, mobile-first flash-card app designed for toddlers and their grown-ups.

## Learning center

- Numbers from 0 through 10
- All 26 letters with a picture-word association
- Nine colors: red, orange, yellow, pink, purple, green, blue, black, and brown
- 100 first words with English and neutral Latin American Spanish labels, prompts, and character voices
- Complete category decks, large touch targets, swipe navigation, and built-in spoken labels
- Local learner profiles with separate progress
- No scores, streaks, timers, achievements, lives, or unlockables
- Four gentle background tracks that rotate automatically at a toddler-friendly volume

## Parent Hub

The Parent Hub is protected by a four-digit PIN created the first time it is opened. It includes:

- A learning snapshot for the active profile
- Unique cards seen and total exposure by category
- Approximate learning time and recent activity
- Profile switching and deletion
- Local JSON data export, voice settings, PIN change, and progress reset

All profile and reporting data remains in the browser's local storage. Nothing is uploaded.

## Characters and artwork

Pip the bear, Poppy the bunny, and Doodle the duck are original **Meadow Pals** characters created for this app. They intentionally avoid reliance on licensed entertainment characters. The primary character artwork is stored at `assets/meadow-pals/meadow-pals.png`, the custom 0–10 counting scenes are under `assets/meadow-pals/numbers/`, and the installable app mark is `icon.svg`.

## Running locally

This is a static progressive web app. Serve the repository root with any local web server, or publish it with GitHub Pages. Service-worker caching makes the core app available offline after its first successful load.

## Music

The supplied tracks are bundled locally under `audio/meadow-pals/`. Music begins after the first user interaction, rotates automatically, lowers itself while a card name is spoken, and can be paused from the header or Parent Hub.

## Generating Fish Audio voice packs

`tools/fish-voice-pack.mjs` generates individual MP3 files directly from the vocabulary in `data.js`, so the audio list cannot drift away from the cards. It supports three independent voices, can follow each First Word card's assigned character, retries temporary API errors, and skips files already generated so an interrupted batch can safely resume.

1. The approved Pip, Poppy, and Doodle voice IDs are stored in `tools/fish-voices.example.json`. Copy it to the ignored `tools/fish-voices.json` only when testing different voices locally.
2. For a safe 0–10 test, run `tools/run-fish-number-test.ps1`; it requests the API key through a hidden prompt and removes it when generation ends.
3. Run `tools/run-fish-learning-audio.ps1` to securely generate all 100 First Words with the character assigned to each card.
4. Run `tools/run-fish-spanish-audio.ps1` to securely generate the matching 100 Spanish First Words.
5. For manual generation, set the API key only for the current terminal and run `node tools/fish-voice-pack.mjs --config=tools/fish-voices.example.json --categories=words --assigned=true`. Add `--language=es` for Spanish.

Output is written under `audio/voice-packs/<voice>/<category>/`. Do not commit the API key or put it in the JSON file.

## Normalizing character voices

`tools/normalize-voice-pack.ps1` measures every MP3 below `audio/voice-packs/` and writes consistently leveled copies to a separate staging folder. The published voice pack targets -20 LUFS with a -1.5 dB true-peak ceiling. Always validate the staged files before replacing the originals; the script intentionally refuses to write inside the source folder.
