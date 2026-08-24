---
name: mobile-ux-storytelling
description: >-
  Mobile-first UX patterns for interactive narrative experiences, scrapbooks,
  galleries, audio triggers, achievements, and emotional storytelling.
---

# Mobile UX & Interactive Storytelling Skill

This skill guides the implementation of delightful, fluid mobile storytelling experiences that guide the user through a narrative arc without feeling clunky or overwhelming.

---

## 1. Narrative Pacing & Scene Structure

1. **Scene Transitions:**
   - Keep each section focused on a single narrative beat (e.g. Boot -> File -> Anamnesis -> Evolution -> Vitals -> Gallery -> Team -> Scrapbook -> Quiz -> Achievements -> Epicrisis -> Finale).
   - Use subtle visual anchor points rather than forced page locking.

2. **Scrapbook Patterns on Mobile:**
   - **No Mandatory Drag:** Drag-and-drop is frustrating on small touchscreens.
   - **Guided Touch Composition:** Use vertical stacking with slight organic rotation (`rotate-1`, `-rotate-2`), overlapping tape stickers, and tap-to-expand modal / lightbox.
   - **Polaroid Cards:** Clean white borders, handwriting captions at the bottom, subtle paper elevation (`shadow-md shadow-stone-900/10`).

3. **Media & Lightbox Experience:**
   - Swipe gestures with CSS scroll snap for galleries.
   - Tap to open high-res view in accessible dialog/lightbox with swipe-down to dismiss.
   - Maintain aspect ratios with proper skeleton loaders to avoid Cumulative Layout Shift (CLS).

---

## 2. Audio & Ambient Sound Handling

1. **Strict User Consent:**
   - Zero autoplay with audio. Audio starts muted by default.
   - Floating discreet sound toggle with visual status (muted / playing animation).
   - Single audio stream at a time: playing a voice message automatically pauses background ambient music.

2. **Performance & Lazy Loading:**
   - Never bundle large audio files in the initial JS payload.
   - Stream or load audio buffers only upon explicit user play action.

---

## 3. Micro-Gamification: Achievements & Easter Eggs

1. **Non-Intrusive Toasts:**
   - Toast notification appears at top/bottom corner with playful unlock animation, staying for 3 seconds before sliding away.
   - Never block user interaction or cover primary action buttons.

2. **Persistence:**
   - Save unlocked achievements to `localStorage` safely with fallback if storage is disabled.
   - Ensure resetting local storage does not break the visual flow.
