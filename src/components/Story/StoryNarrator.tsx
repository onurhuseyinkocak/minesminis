/**
 * STORY NARRATOR - Typewriter text effect with glass panel
 */

import React, { useState, useEffect, useRef } from 'react';

interface StoryNarratorProps {
  text: string;
  npcName?: string;
  npcEmoji?: string;
  location: string;
  onComplete?: () => void;
}

const CHAR_DELAY = 25; // ms per character

const StoryNarrator: React.FC<StoryNarratorProps> = ({
  text,
  npcName,
  npcEmoji,
  location,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Reset on new text
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    const typeNext = () => {
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        setDisplayedText(text.slice(0, indexRef.current));
        timeoutRef.current = setTimeout(typeNext, CHAR_DELAY);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(typeNext, 300); // Initial delay

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, onComplete]);

  const handleSkip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayedText(text);
    setIsComplete(true);
    onComplete?.();
  };

  return (
    <div className="story-narrator" onClick={!isComplete ? handleSkip : undefined}>
      {/* Location badge */}
      <div className="story-narrator__location">
        <span className="story-narrator__location-dot" />
        {location}
      </div>

      {/* NPC indicator */}
      {npcName && (
        <div className="story-narrator__npc">
          <span className="story-narrator__npc-emoji">{npcEmoji}</span>
          <span className="story-narrator__npc-name">{npcName}</span>
        </div>
      )}

      {/* Text */}
      <p className="story-narrator__text">
        {displayedText}
        {!isComplete && <span className="story-narrator__cursor">|</span>}
      </p>

      {/* Skip hint */}
      {!isComplete && (
        <div className="story-narrator__hint">Tap to skip</div>
      )}
    </div>
  );
};

export default StoryNarrator;
