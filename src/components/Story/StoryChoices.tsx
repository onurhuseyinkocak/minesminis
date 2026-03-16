/**
 * STORY CHOICES - Animated choice buttons with trait indicators
 */

import React, { useState } from 'react';
import type { StoryChoice } from '../../data/storyTemplates';
import type { TraitId } from '../../data/storyWorlds';
import { TRAIT_NAMES } from '../../data/storyWorlds';

interface StoryChoicesProps {
  choices: StoryChoice[];
  onChoose: (choice: StoryChoice) => void;
  disabled?: boolean;
}

const StoryChoices: React.FC<StoryChoicesProps> = ({ choices, onChoose, disabled = false }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (choice: StoryChoice) => {
    if (disabled || selectedId) return;
    setSelectedId(choice.id);
    // Small delay for animation before resolving
    setTimeout(() => onChoose(choice), 400);
  };

  const getDominantTrait = (effects: Partial<Record<TraitId, number>>): TraitId | null => {
    let max: TraitId | null = null;
    let maxVal = 0;
    for (const [trait, val] of Object.entries(effects)) {
      if (val && val > maxVal) {
        maxVal = val;
        max = trait as TraitId;
      }
    }
    return max;
  };

  return (
    <div className="story-choices">
      {choices.map((choice, i) => {
        const dominantTrait = getDominantTrait(choice.traitEffects);
        const traitInfo = dominantTrait ? TRAIT_NAMES[dominantTrait] : null;
        const isSelected = selectedId === choice.id;
        const isOther = selectedId && !isSelected;

        return (
          <button
            key={choice.id}
            className={`story-choice ${isSelected ? 'story-choice--selected' : ''} ${isOther ? 'story-choice--faded' : ''}`}
            onClick={() => handleClick(choice)}
            disabled={disabled || !!selectedId}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <span className="story-choice__emoji">{choice.emoji}</span>
            <span className="story-choice__text">{choice.text}</span>

            {/* Trait & XP badges */}
            <div className="story-choice__badges">
              {traitInfo && (
                <span
                  className="story-choice__trait"
                  style={{ color: traitInfo.color }}
                >
                  {traitInfo.emoji} {traitInfo.name}
                </span>
              )}
              <span className="story-choice__xp">+{choice.xpReward} XP</span>
            </div>

            {/* Item reward indicator */}
            {choice.itemReward && (
              <span className="story-choice__item">New item!</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StoryChoices;
