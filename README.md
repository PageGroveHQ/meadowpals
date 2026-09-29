# Meadow Pals · Little Learners

A calm, mobile-first flash-card app designed for toddlers and their grown-ups.

## Learning center

- Numbers from 0 through 10
- All 26 letters with a picture-word association
- Nine colors: red, orange, yellow, pink, purple, green, blue, black, and brown
- 100 first words with picture cues
- Short rotating sets, large touch targets, swipe navigation, and built-in spoken labels
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

Pip the bear, Poppy the bunny, and Doodle the duck are original **Meadow Pals** characters created for this app. They intentionally avoid reliance on licensed entertainment characters. The primary character artwork is stored at `assets/meadow-pals/meadow-pals.png`; the installable app mark is `icon.svg`.

## Running locally

This is a static progressive web app. Serve the repository root with any local web server, or publish it with GitHub Pages. Service-worker caching makes the core app available offline after its first successful load.

## Music

The supplied tracks are bundled locally under `audio/meadow-pals/`. Music begins after the first user interaction, rotates automatically, lowers itself while a card name is spoken, and can be paused from the header or Parent Hub.
