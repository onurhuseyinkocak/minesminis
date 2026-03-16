import { describe, it, expect } from 'vitest';
import { GLINTS, GLINT_IDS, DEFAULT_MASCOT, type GlintConfig } from '../../config/GlintsConfig';

describe('GLINTS', () => {
  it('should have exactly 4 entries', () => {
    expect(Object.keys(GLINTS)).toHaveLength(4);
  });

  it('should contain mimi_dragon', () => {
    expect(GLINTS).toHaveProperty('mimi_dragon');
  });

  it('should contain nova_fox', () => {
    expect(GLINTS).toHaveProperty('nova_fox');
  });

  it('should contain bubbles_octo', () => {
    expect(GLINTS).toHaveProperty('bubbles_octo');
  });

  it('should contain sparky_alien', () => {
    expect(GLINTS).toHaveProperty('sparky_alien');
  });

  const requiredFields: (keyof GlintConfig)[] = [
    'id', 'name', 'title', 'titleEn', 'lore', 'loreEn',
    'story', 'storyEn', 'trait', 'traitEn', 'benefit', 'benefitEn',
    'power', 'powerEn', 'color', 'secondaryColor', 'accentColor', 'glowColor',
    'type', 'behaviorPattern', 'element', 'powerMultiplier',
  ];

  for (const glintKey of ['mimi_dragon', 'nova_fox', 'bubbles_octo', 'sparky_alien']) {
    describe(`${glintKey}`, () => {
      for (const field of requiredFields) {
        it(`should have required field: ${field}`, () => {
          expect(GLINTS[glintKey]).toHaveProperty(field);
        });
      }
    });
  }

  it('should have id matching the key for each entry', () => {
    for (const [key, config] of Object.entries(GLINTS)) {
      expect(config.id).toBe(key);
    }
  });

  it('should have type matching the key for each entry', () => {
    for (const [key, config] of Object.entries(GLINTS)) {
      expect(config.type).toBe(key);
    }
  });
});

describe('GLINTS elements', () => {
  const validElements = ['fire', 'cosmic', 'water', 'electric'];

  it('mimi_dragon element should be fire', () => {
    expect(GLINTS.mimi_dragon.element).toBe('fire');
  });

  it('nova_fox element should be cosmic', () => {
    expect(GLINTS.nova_fox.element).toBe('cosmic');
  });

  it('bubbles_octo element should be water', () => {
    expect(GLINTS.bubbles_octo.element).toBe('water');
  });

  it('sparky_alien element should be electric', () => {
    expect(GLINTS.sparky_alien.element).toBe('electric');
  });

  it('all elements should be valid', () => {
    for (const config of Object.values(GLINTS)) {
      expect(validElements).toContain(config.element);
    }
  });
});

describe('GLINTS powerMultiplier', () => {
  const multiplierKeys = ['words', 'listening', 'grammar', 'stories', 'games'];

  it('all power multipliers should be numbers > 0', () => {
    for (const config of Object.values(GLINTS)) {
      for (const key of multiplierKeys) {
        const val = config.powerMultiplier[key as keyof typeof config.powerMultiplier];
        expect(typeof val).toBe('number');
        expect(val).toBeGreaterThan(0);
      }
    }
  });

  it('mimi_dragon should have balanced multipliers (all 1.2)', () => {
    const pm = GLINTS.mimi_dragon.powerMultiplier;
    expect(pm.words).toBe(1.2);
    expect(pm.listening).toBe(1.2);
    expect(pm.grammar).toBe(1.2);
    expect(pm.stories).toBe(1.2);
    expect(pm.games).toBe(1.2);
  });

  it('nova_fox should have 2.0 words multiplier', () => {
    expect(GLINTS.nova_fox.powerMultiplier.words).toBe(2.0);
  });

  it('bubbles_octo should have 2.0 listening multiplier', () => {
    expect(GLINTS.bubbles_octo.powerMultiplier.listening).toBe(2.0);
  });

  it('sparky_alien should have 2.0 grammar multiplier', () => {
    expect(GLINTS.sparky_alien.powerMultiplier.grammar).toBe(2.0);
  });

  it('each multiplier key should exist for every glint', () => {
    for (const config of Object.values(GLINTS)) {
      for (const key of multiplierKeys) {
        expect(config.powerMultiplier).toHaveProperty(key);
      }
    }
  });
});

describe('GLINTS behaviorPattern', () => {
  const validPatterns = ['harmonic', 'energetic', 'zen', 'erratic'];

  it('all behavior patterns should be valid', () => {
    for (const config of Object.values(GLINTS)) {
      expect(validPatterns).toContain(config.behaviorPattern);
    }
  });

  it('mimi_dragon should be harmonic', () => {
    expect(GLINTS.mimi_dragon.behaviorPattern).toBe('harmonic');
  });

  it('nova_fox should be energetic', () => {
    expect(GLINTS.nova_fox.behaviorPattern).toBe('energetic');
  });

  it('bubbles_octo should be zen', () => {
    expect(GLINTS.bubbles_octo.behaviorPattern).toBe('zen');
  });

  it('sparky_alien should be erratic', () => {
    expect(GLINTS.sparky_alien.behaviorPattern).toBe('erratic');
  });
});

describe('GLINT_IDS', () => {
  it('should have length 4', () => {
    expect(GLINT_IDS).toHaveLength(4);
  });

  it('should contain all glint keys', () => {
    expect(GLINT_IDS).toContain('mimi_dragon');
    expect(GLINT_IDS).toContain('nova_fox');
    expect(GLINT_IDS).toContain('bubbles_octo');
    expect(GLINT_IDS).toContain('sparky_alien');
  });
});

describe('DEFAULT_MASCOT', () => {
  it('should be mimi_dragon', () => {
    expect(DEFAULT_MASCOT).toBe('mimi_dragon');
  });

  it('should be a valid GLINT key', () => {
    expect(GLINTS).toHaveProperty(DEFAULT_MASCOT);
  });
});
