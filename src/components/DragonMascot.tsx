import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import './DragonMascot.css';

interface DragonMascotProps {
  state: 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love';
  onClick?: () => void;
  isHovered?: boolean;
}

const dragonAnimation = {
  "v": "5.7.8",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Cute Dragon",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Dragon Body",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { 
          "a": 1, 
          "k": [
            { "t": 0, "s": [0], "e": [3] },
            { "t": 15, "s": [3], "e": [0] },
            { "t": 30, "s": [0], "e": [-3] },
            { "t": 45, "s": [-3], "e": [0] },
            { "t": 60, "s": [0] }
          ]
        },
        "p": { 
          "a": 1,
          "k": [
            { "t": 0, "s": [100, 105], "e": [100, 100] },
            { "t": 15, "s": [100, 100], "e": [100, 105] },
            { "t": 30, "s": [100, 105], "e": [100, 100] },
            { "t": 45, "s": [100, 100], "e": [100, 105] },
            { "t": 60, "s": [100, 105] }
          ]
        },
        "a": { "a": 0, "k": [100, 100, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [0, 20] },
              "s": { "a": 0, "k": [80, 90] },
              "nm": "Body"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.30, 0.70, 0.40, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 100] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [0, 10] },
              "s": { "a": 0, "k": [60, 65] },
              "nm": "Belly"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.60, 0.90, 0.65, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 110] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [55, 50] },
              "nm": "Head"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.35, 0.75, 0.45, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 55] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-12, 0] },
              "s": { "a": 0, "k": [22, 26] },
              "nm": "Left Eye White"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 1, 1, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 50] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [12, 0] },
              "s": { "a": 0, "k": [22, 26] },
              "nm": "Right Eye White"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 1, 1, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 50] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-10, 2] },
              "s": { "a": 0, "k": [12, 14] },
              "nm": "Left Pupil"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.1, 0.1, 0.1, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 50] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [14, 2] },
              "s": { "a": 0, "k": [12, 14] },
              "nm": "Right Pupil"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.1, 0.1, 0.1, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 50] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-8, -1] },
              "s": { "a": 0, "k": [4, 4] },
              "nm": "Left Sparkle"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 1, 1, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 50] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [16, -1] },
              "s": { "a": 0, "k": [4, 4] },
              "nm": "Right Sparkle"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 1, 1, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 50] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-25, 5] },
              "s": { "a": 0, "k": [14, 10] },
              "nm": "Left Cheek"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 0.6, 0.7, 1] },
              "o": { "a": 0, "k": 60 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 55] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [25, 5] },
              "s": { "a": 0, "k": [14, 10] },
              "nm": "Right Cheek"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 0.6, 0.7, 1] },
              "o": { "a": 0, "k": 60 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 55] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-20, -28] },
              "s": { "a": 0, "k": [16, 24] },
              "nm": "Left Horn"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 0.85, 0.4, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 55] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": -20 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [20, -28] },
              "s": { "a": 0, "k": [16, 24] },
              "nm": "Right Horn"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 0.85, 0.4, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 55] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 20 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-30, 50] },
              "s": { "a": 0, "k": [18, 30] },
              "nm": "Left Arm"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.30, 0.70, 0.40, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 80] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 15 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [30, 50] },
              "s": { "a": 0, "k": [18, 30] },
              "nm": "Right Arm"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.30, 0.70, 0.40, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 80] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": -15 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [-18, 75] },
              "s": { "a": 0, "k": [22, 28] },
              "nm": "Left Leg"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.30, 0.70, 0.40, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 80] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "p": { "a": 0, "k": [18, 75] },
              "s": { "a": 0, "k": [22, 28] },
              "nm": "Right Leg"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.30, 0.70, 0.40, 1] },
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [100, 80] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

const DragonMascot: React.FC<DragonMascotProps> = ({ 
  state, 
  onClick,
  isHovered = false
}) => {
  const lottieRef = useRef<any>(null);
  const [showEmoji, setShowEmoji] = useState<string | null>(null);

  useEffect(() => {
    if (state === 'love') {
      setShowEmoji('❤️');
    } else if (state === 'celebrating') {
      setShowEmoji('🎉');
    } else if (state === 'thinking') {
      setShowEmoji('💭');
    } else if (state === 'sleeping') {
      setShowEmoji('💤');
    } else {
      setShowEmoji(null);
    }
  }, [state]);

  useEffect(() => {
    if (lottieRef.current) {
      if (state === 'sleeping') {
        lottieRef.current.setSpeed(0.3);
      } else if (state === 'dancing' || state === 'celebrating') {
        lottieRef.current.setSpeed(2);
      } else {
        lottieRef.current.setSpeed(1);
      }
    }
  }, [state]);

  return (
    <div 
      className={`dragon-mascot-container state-${state} ${isHovered ? 'is-hovered' : ''}`}
      onClick={onClick}
    >
      <div className="dragon-animation-wrapper">
        <Lottie
          lottieRef={lottieRef}
          animationData={dragonAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {showEmoji && (
        <div className="dragon-emoji-bubble">
          <span className="emoji-float">{showEmoji}</span>
        </div>
      )}
      
      <div className="dragon-shadow"></div>
    </div>
  );
};

export default DragonMascot;
