/**
 * CAMERA ANGLES — Cinematic camera system for StoryScene
 * 8 angles with CSS transforms, SVG viewBox adjustments, and parallax strengths
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SvgViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CameraAngle {
  id: string;
  label: string;
  cssTransform: string;
  transitionDuration: string;
  svgTransform: SvgViewBox;
  parallaxStrength: number;
}

export type CameraAngleId =
  | 'wide'
  | 'closeUp'
  | 'lowAngle'
  | 'birdEye'
  | 'sidePan'
  | 'sidePanLeft'
  | 'dutch'
  | 'dramatic';

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA ANGLES DATA
// ─────────────────────────────────────────────────────────────────────────────

export const CAMERA_ANGLES: Record<CameraAngleId, CameraAngle> = {
  wide: {
    id: 'wide',
    label: 'Wide Shot',
    cssTransform: 'none',
    transitionDuration: '0.8s',
    svgTransform: { x: 0, y: 0, width: 1200, height: 600 },
    parallaxStrength: 0.2,
  },

  closeUp: {
    id: 'closeUp',
    label: 'Close Up',
    cssTransform: 'scale(1.0)',
    transitionDuration: '1.2s',
    svgTransform: { x: 300, y: 100, width: 600, height: 300 },
    parallaxStrength: 0.5,
  },

  lowAngle: {
    id: 'lowAngle',
    label: 'Low Angle',
    cssTransform: 'perspective(800px) rotateX(4deg)',
    transitionDuration: '0.9s',
    svgTransform: { x: 0, y: 200, width: 1200, height: 400 },
    parallaxStrength: 0.35,
  },

  birdEye: {
    id: 'birdEye',
    label: "Bird's Eye",
    cssTransform: 'perspective(900px) rotateX(-6deg)',
    transitionDuration: '1.1s',
    svgTransform: { x: 0, y: 50, width: 1200, height: 350 },
    parallaxStrength: 0.6,
  },

  sidePan: {
    id: 'sidePan',
    label: 'Side Pan Right',
    cssTransform: 'translateX(-8%)',
    transitionDuration: '1.0s',
    svgTransform: { x: 400, y: 0, width: 800, height: 600 },
    parallaxStrength: 0.4,
  },

  sidePanLeft: {
    id: 'sidePanLeft',
    label: 'Side Pan Left',
    cssTransform: 'translateX(8%)',
    transitionDuration: '1.0s',
    svgTransform: { x: 0, y: 0, width: 800, height: 600 },
    parallaxStrength: 0.4,
  },

  dutch: {
    id: 'dutch',
    label: 'Dutch Angle',
    cssTransform: 'rotate(2deg)',
    transitionDuration: '0.8s',
    svgTransform: { x: 0, y: 0, width: 1200, height: 600 },
    parallaxStrength: 0.3,
  },

  dramatic: {
    id: 'dramatic',
    label: 'Dramatic Low',
    cssTransform: 'perspective(600px) rotateX(8deg) scale(1.05)',
    transitionDuration: '1.3s',
    svgTransform: { x: 0, y: 300, width: 1200, height: 300 },
    parallaxStrength: 0.8,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const CAMERA_ANGLE_IDS: CameraAngleId[] = [
  'wide',
  'closeUp',
  'lowAngle',
  'birdEye',
  'sidePan',
  'sidePanLeft',
  'dutch',
  'dramatic',
];
