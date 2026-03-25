/**
 * STORY COVER GENERATOR — Canvas API based cover image generator
 * Produces 400x280px PNG data URLs for story cards
 */

import { STORY_CHARACTERS } from '../data/storyAssets';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface StoryCoverParams {
  title: string;
  locationId: string;
  characterIds: string[];
  mood?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCATION GRADIENT PALETTES
// ─────────────────────────────────────────────────────────────────────────────

interface GradientPalette {
  top: string;
  bottom: string;
  accent: string;
}

function getLocationPalette(locationId: string): GradientPalette {
  const id = locationId.toLowerCase();

  if (id.includes('forest') || id.includes('tree') || id.includes('meadow') || id.includes('flower')) {
    return { top: '#1B5E20', bottom: '#4CAF50', accent: '#A5D6A7' };
  }
  if (id.includes('ocean') || id.includes('coral') || id.includes('sea') || id.includes('deep')) {
    return { top: '#01579B', bottom: '#0288D1', accent: '#4FC3F7' };
  }
  if (id.includes('space') || id.includes('star') || id.includes('galaxy') || id.includes('nebula') || id.includes('cosmic')) {
    return { top: '#0D0D2B', bottom: '#3F51B5', accent: '#7C4DFF' };
  }
  if (id.includes('desert') || id.includes('oasis') || id.includes('sand') || id.includes('dune')) {
    return { top: '#BF360C', bottom: '#FF8F00', accent: '#FFD54F' };
  }
  if (id.includes('mountain') || id.includes('peak') || id.includes('snowy') || id.includes('cave') || id.includes('crystal')) {
    return { top: '#311B92', bottom: '#7E57C2', accent: '#B0BEC5' };
  }
  if (id.includes('castle') || id.includes('cloud') || id.includes('ancient')) {
    return { top: '#1A237E', bottom: '#5C6BC0', accent: '#90CAF9' };
  }
  if (id.includes('farm') || id.includes('sunny')) {
    return { top: '#E65100', bottom: '#FFA726', accent: '#FFEE58' };
  }
  if (id.includes('rainbow') || id.includes('village') || id.includes('city')) {
    return { top: '#6A1B9A', bottom: '#AB47BC', accent: '#F48FB1' };
  }

  // Default warm gradient
  return { top: '#1A237E', bottom: '#283593', accent: '#7986CB' };
}

// ─────────────────────────────────────────────────────────────────────────────
// DECORATIVE ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────

function drawDecorations(ctx: CanvasRenderingContext2D, locationId: string, width: number, height: number): void {
  const id = locationId.toLowerCase();
  ctx.save();

  if (id.includes('space') || id.includes('star') || id.includes('galaxy') || id.includes('nebula') || id.includes('cosmic')) {
    // Stars
    for (let i = 0; i < 40; i++) {
      const x = (i * 97 + 13) % width;
      const y = (i * 61 + 7) % (height * 0.7);
      const r = (i % 3) * 0.7 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 5) * 0.12})`;
      ctx.fill();
    }
    // Large moon
    ctx.beginPath();
    ctx.arc(320, 50, 28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 216, 53, 0.85)';
    ctx.fill();
    // Planet
    ctx.beginPath();
    ctx.arc(60, 60, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(100, 181, 246, 0.6)';
    ctx.fill();
  } else if (id.includes('ocean') || id.includes('coral') || id.includes('sea') || id.includes('deep')) {
    // Sun
    ctx.beginPath();
    ctx.arc(340, 44, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 213, 79, 0.82)';
    ctx.fill();
    // Waves
    for (let w = 0; w < 3; w++) {
      ctx.beginPath();
      ctx.moveTo(0, height * 0.6 + w * 18);
      for (let x = 0; x <= width; x += 40) {
        ctx.quadraticCurveTo(x + 20, height * 0.6 + w * 18 - 10, x + 40, height * 0.6 + w * 18);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + w * 0.08})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Bubbles
    for (let b = 0; b < 5; b++) {
      const bx = 60 + b * 65;
      const by = height * 0.4 + b * 15;
      ctx.beginPath();
      ctx.arc(bx, by, 4 + b, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  } else if (id.includes('forest') || id.includes('tree') || id.includes('meadow') || id.includes('flower')) {
    // Sun
    ctx.beginPath();
    ctx.arc(60, 50, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 235, 59, 0.8)';
    ctx.fill();
    // Trees
    const treePairs: Array<[number, number, number]> = [[50, 200, 32], [120, 210, 26], [280, 195, 36], [360, 205, 28]];
    for (const [tx, ty, tr] of treePairs) {
      ctx.beginPath();
      ctx.arc(tx, ty, tr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 142, 60, 0.75)';
      ctx.fill();
      ctx.fillStyle = 'rgba(93, 64, 55, 0.6)';
      ctx.fillRect(tx - 5, ty + tr - 6, 10, 22);
    }
    // Flowers
    for (let f = 0; f < 6; f++) {
      const fx = 40 + f * 60;
      ctx.beginPath();
      ctx.arc(fx, height - 24, 5, 0, Math.PI * 2);
      ctx.fillStyle = f % 2 === 0 ? 'rgba(255, 107, 157, 0.7)' : 'rgba(255, 235, 59, 0.7)';
      ctx.fill();
    }
  } else if (id.includes('mountain') || id.includes('peak') || id.includes('snowy') || id.includes('crystal')) {
    // Mountains
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(100, 90);
    ctx.lineTo(200, height);
    ctx.fillStyle = 'rgba(94, 80, 120, 0.6)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(150, height);
    ctx.lineTo(270, 70);
    ctx.lineTo(390, height);
    ctx.fillStyle = 'rgba(120, 105, 150, 0.55)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(300, height);
    ctx.lineTo(400, 110);
    ctx.lineTo(500, height);
    ctx.fillStyle = 'rgba(94, 80, 120, 0.5)';
    ctx.fill();
    // Snow caps
    ctx.beginPath();
    ctx.moveTo(90, 106); ctx.lineTo(100, 90); ctx.lineTo(112, 106);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(258, 84); ctx.lineTo(270, 70); ctx.lineTo(282, 84);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
    // Sun
    ctx.beginPath();
    ctx.arc(350, 45, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 235, 59, 0.78)';
    ctx.fill();
  } else if (id.includes('desert') || id.includes('oasis') || id.includes('sand')) {
    // Big sun
    ctx.beginPath();
    ctx.arc(330, 50, 32, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 213, 79, 0.9)';
    ctx.fill();
    // Dunes
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(100, height * 0.62, 200, height * 0.68);
    ctx.quadraticCurveTo(300, height * 0.58, 400, height);
    ctx.fillStyle = 'rgba(195, 146, 12, 0.45)';
    ctx.fill();
    // Cactus
    ctx.fillStyle = 'rgba(45, 139, 63, 0.7)';
    ctx.fillRect(70, 155, 10, 50);
    ctx.fillRect(55, 168, 25, 8);
  } else {
    // Generic: scattered stars/dots
    for (let i = 0; i < 20; i++) {
      const x = (i * 73 + 11) % width;
      const y = (i * 53 + 9) % (height * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    }
    // Sun
    ctx.beginPath();
    ctx.arc(320, 45, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 235, 59, 0.7)';
    ctx.fill();
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTER CIRCLES
// ─────────────────────────────────────────────────────────────────────────────

function drawCharacterCircles(ctx: CanvasRenderingContext2D, characterIds: string[], width: number, height: number): void {
  if (characterIds.length === 0) return;

  const circleRadius = 28;
  const spacing = 68;
  const totalWidth = characterIds.length * spacing - (spacing - circleRadius * 2);
  const startX = (width - totalWidth) / 2 + circleRadius;
  const cy = height - circleRadius - 56;

  characterIds.forEach((charId, index) => {
    const char = STORY_CHARACTERS.find(c => c.id === charId);
    const color = char?.color ?? '#607D8B';
    const emoji = char?.emoji ?? '?';
    const cx = startX + index * spacing;

    // Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Circle background
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();

    // White border
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Emoji
    ctx.font = `${circleRadius}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, cx, cy + 2);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TITLE TEXT
// ─────────────────────────────────────────────────────────────────────────────

function drawTitle(ctx: CanvasRenderingContext2D, title: string, width: number, height: number): void {
  const maxWidth = width - 32;
  const fontSize = 22;
  const lineHeight = 30;

  ctx.font = `bold ${fontSize}px Nunito, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  // Word wrap
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Cap at 2 lines
  const displayLines = lines.slice(0, 2);
  if (lines.length > 2) {
    displayLines[1] = displayLines[1].replace(/\s?\S+$/, '…');
  }

  const totalTextHeight = displayLines.length * lineHeight;
  const startY = height - 18 - totalTextHeight;

  // Text shadow pass
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  displayLines.forEach((line, i) => {
    ctx.fillStyle = 'white';
    ctx.fillText(line, width / 2, startY + (i + 1) * lineHeight);
  });

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// MOOD OVERLAY
// ─────────────────────────────────────────────────────────────────────────────

function drawMoodOverlay(ctx: CanvasRenderingContext2D, mood: string | undefined, width: number, height: number): void {
  if (!mood) return;

  ctx.save();

  let overlayColor: string;

  switch (mood) {
    case 'happy':
      overlayColor = 'rgba(255, 214, 0, 0.12)';
      break;
    case 'mysterious':
      overlayColor = 'rgba(74, 20, 140, 0.18)';
      break;
    case 'adventurous':
      overlayColor = 'rgba(230, 81, 0, 0.14)';
      break;
    case 'exciting':
      overlayColor = 'rgba(244, 67, 54, 0.12)';
      break;
    case 'calm':
      overlayColor = 'rgba(76, 175, 80, 0.10)';
      break;
    case 'magical':
      overlayColor = 'rgba(156, 39, 176, 0.15)';
      break;
    case 'brave':
      overlayColor = 'rgba(198, 40, 40, 0.13)';
      break;
    case 'cozy':
      overlayColor = 'rgba(33, 33, 80, 0.16)';
      break;
    default:
      overlayColor = 'rgba(0, 0, 0, 0.05)';
  }

  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
  gradient.addColorStop(0, overlayColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function generateStoryCover(params: StoryCoverParams): Promise<string> {
  const { title, locationId, characterIds, mood } = params;
  const width = 400;
  const height = 280;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  const palette = getLocationPalette(locationId);

  // 1. Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, palette.top);
  bgGradient.addColorStop(1, palette.bottom);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative elements
  drawDecorations(ctx, locationId, width, height);

  // 3. Bottom gradient strip for text readability
  const bottomGradient = ctx.createLinearGradient(0, height * 0.55, 0, height);
  bottomGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGradient.addColorStop(1, 'rgba(0, 0, 0, 0.72)');
  ctx.fillStyle = bottomGradient;
  ctx.fillRect(0, 0, width, height);

  // 4. Character circles
  drawCharacterCircles(ctx, characterIds, width, height);

  // 5. Title text
  drawTitle(ctx, title, width, height);

  // 6. Mood overlay
  drawMoodOverlay(ctx, mood, width, height);

  return canvas.toDataURL('image/png');
}
