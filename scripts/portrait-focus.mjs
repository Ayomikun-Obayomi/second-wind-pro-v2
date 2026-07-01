/**
 * Compute roster card object-position from portrait pixel dimensions.
 * Targets the face zone in media-day headshots (not the top of full-body frames).
 */

import { execSync } from 'child_process';

/** @param {number} width @param {number} height @returns {string} */
export function computePortraitFocus(width, height) {
  if (!width || !height) return 'center 36%';

  const ar = height / width;

  // Wide action frames — face sits upper-center
  if (ar < 0.85) return 'center 30%';
  if (ar < 0.95) return 'center 34%';
  // Near-square headshots
  if (ar < 1.12) return 'center 38%';
  // Standard media-day (~3:4)
  if (ar < 1.32) return 'center 36%';
  // Three-quarter portraits
  if (ar < 1.5) return 'center 34%';
  // Tall full-body frames — bias up slightly but keep chin in frame
  if (ar < 1.7) return 'center 32%';
  if (ar < 2.0) return 'center 30%';
  return 'center 28%';
}

/** @param {string} filePath @returns {string} */
export function portraitFocusFromFile(filePath) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: 'utf8' });
    const width = Number(out.match(/pixelWidth: (\d+)/)?.[1]);
    const height = Number(out.match(/pixelHeight: (\d+)/)?.[1]);
    return computePortraitFocus(width, height);
  } catch {
    return 'center 36%';
  }
}
