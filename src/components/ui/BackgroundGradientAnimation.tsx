import React, { useEffect, useRef, useCallback } from 'react';

interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  interactive?: boolean;
  containerClassName?: string;
  children?: React.ReactNode;
}

const BackgroundGradientAnimation: React.FC<BackgroundGradientAnimationProps> = ({
  gradientBackgroundStart = 'rgb(12, 15, 26)',
  gradientBackgroundEnd = 'rgb(21, 25, 41)',
  firstColor = '232, 163, 23',
  secondColor = '26, 107, 90',
  thirdColor = '76, 175, 80',
  fourthColor = '139, 92, 246',
  fifthColor = '14, 165, 233',
  pointerColor = '232, 163, 23',
  size = '80%',
  blendingValue = 'hard-light',
  interactive = true,
  containerClassName = '',
  children,
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);
  const animationFrameId = useRef<number>();

  const move = useCallback(() => {
    if (!interactiveRef.current) return;
    curX.current += (tgX.current - curX.current) / 20;
    curY.current += (tgY.current - curY.current) / 20;
    interactiveRef.current.style.transform = `translate(${Math.round(curX.current)}px, ${Math.round(curY.current)}px)`;
    animationFrameId.current = requestAnimationFrame(move);
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(move);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [move]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    tgX.current = event.clientX - rect.left - rect.width / 2;
    tgY.current = event.clientY - rect.top - rect.height / 2;
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, handleMouseMove]);

  const gradientBlobBase: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    width: `calc(${size} * 1.2)`,
    height: `calc(${size} * 1.2)`,
    mixBlendMode: blendingValue as React.CSSProperties['mixBlendMode'],
    top: `calc(50% - ${size} / 2)`,
    left: `calc(50% - ${size} / 2)`,
    opacity: 0.35,
    filter: 'blur(40px)',
  };

  return (
    <>
      <style>{`
        @keyframes bgGradientMoveVertical {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(50%); }
        }
        @keyframes bgGradientMoveInCircle {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bgGradientMoveHorizontal {
          0%, 100% { transform: translateX(-50%) translateY(-10%); }
          50% { transform: translateX(50%) translateY(10%); }
        }
      `}</style>
      <div
        ref={containerRef}
        className={containerClassName}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
        }}
      >
        {/* SVG filter for gooey effect */}
        <svg style={{ display: 'none' }}>
          <defs>
            <filter id="bgGradientBlurFilter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        {/* Gradient blobs container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: 'url(#bgGradientBlurFilter) blur(40px)',
          }}
        >
          {/* First blob */}
          <div
            style={{
              ...gradientBlobBase,
              background: `radial-gradient(circle at center, rgba(${firstColor}, 0.8) 0%, rgba(${firstColor}, 0) 50%)`,
              animation: 'bgGradientMoveVertical 30s ease infinite',
              transformOrigin: 'center center',
            }}
          />
          {/* Second blob */}
          <div
            style={{
              ...gradientBlobBase,
              background: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0%, rgba(${secondColor}, 0) 50%)`,
              animation: 'bgGradientMoveInCircle 20s reverse infinite',
              transformOrigin: 'calc(50% - 200px)',
            }}
          />
          {/* Third blob */}
          <div
            style={{
              ...gradientBlobBase,
              background: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0%, rgba(${thirdColor}, 0) 50%)`,
              animation: 'bgGradientMoveInCircle 40s linear infinite',
              transformOrigin: 'calc(50% + 200px)',
            }}
          />
          {/* Fourth blob */}
          <div
            style={{
              ...gradientBlobBase,
              background: `radial-gradient(circle at center, rgba(${fourthColor}, 0.8) 0%, rgba(${fourthColor}, 0) 50%)`,
              animation: 'bgGradientMoveHorizontal 40s ease infinite',
              transformOrigin: 'calc(50% - 100px)',
              opacity: 0.3,
            }}
          />
          {/* Fifth blob */}
          <div
            style={{
              ...gradientBlobBase,
              background: `radial-gradient(circle at center, rgba(${fifthColor}, 0.8) 0%, rgba(${fifthColor}, 0) 50%)`,
              animation: 'bgGradientMoveInCircle 25s ease infinite',
              transformOrigin: 'calc(50% + 100px) calc(50% + 100px)',
              width: `calc(${size} * 1)`,
              height: `calc(${size} * 1)`,
              opacity: 0.25,
            }}
          />
          {/* Interactive pointer blob */}
          {interactive && (
            <div
              ref={interactiveRef}
              style={{
                ...gradientBlobBase,
                background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.8) 0%, rgba(${pointerColor}, 0) 50%)`,
                width: `calc(${size} * 0.8)`,
                height: `calc(${size} * 0.8)`,
                opacity: 0.3,
              }}
            />
          )}
        </div>

        {/* Content overlay */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default BackgroundGradientAnimation;
