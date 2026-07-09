/**
 * Compute roster card object-position from portrait pixel dimensions.
 * Targets the face zone in media-day headshots (not the top of full-body frames).
 */

import { execSync } from 'child_process';

/**
 * Compute object-position for the Meet the Athletes grid (25 / 24 frame, object-fit: cover).
 * Portrait sources are anchored to the top so hair and helmets stay in frame.
 * Use PHOTO_POSITION_ROSTER_OVERRIDES when the face sits lower in a full-body shot.
 */
export function computeRosterGridFocus(width, height) {
  if (!width || !height) return 'center top';

  const imageAr = height / width;
  const frameAr = 24 / 25; // height / width for aspect-ratio: 25 / 24 (~20% taller than 5/4)

  if (imageAr <= frameAr) return 'center top';

  // Very tall full-body frames — nudge down slightly so the face zone stays visible.
  if (imageAr >= 1.85) return 'center 14%';
  if (imageAr >= 1.65) return 'center 12%';

  return 'center top';
}

/** @param {number} width @param {number} height @returns {string} */
export function computePortraitFocus(width, height) {
  if (!width || !height) return 'center 24%';

  const ar = height / width;

  // Bias upward so faces and helmets stay in frame inside portrait cards.
  if (ar < 0.85) return 'center 18%';
  if (ar < 0.95) return 'center 20%';
  if (ar < 1.12) return 'center 22%';
  if (ar < 1.32) return 'center 24%';
  if (ar < 1.5) return 'center 22%';
  if (ar < 1.7) return 'center 20%';
  if (ar < 2.0) return 'center 18%';
  return 'center 16%';
}

/** @param {string} filePath @returns {string} */
export function rosterGridFocusFromFile(filePath) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: 'utf8' });
    const width = Number(out.match(/pixelWidth: (\d+)/)?.[1]);
    const height = Number(out.match(/pixelHeight: (\d+)/)?.[1]);
    return computeRosterGridFocus(width, height);
  } catch {
    return 'center top';
  }
}

/** @param {string} filePath @returns {string} */
export function portraitFocusFromFile(filePath) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: 'utf8' });
    const width = Number(out.match(/pixelWidth: (\d+)/)?.[1]);
    const height = Number(out.match(/pixelHeight: (\d+)/)?.[1]);
    return computePortraitFocus(width, height);
  } catch {
    return 'center 24%';
  }
}
