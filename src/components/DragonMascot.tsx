import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './DragonMascot.css';

interface DragonMascotProps {
  state: 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love' | 'jumping' | 'surprised';
  onClick?: () => void;
  isHovered?: boolean;
  cursorPosition?: { x: number; y: number };
}

const DragonMascot: React.FC<DragonMascotProps> = ({ 
  state, 
  onClick,
  isHovered = false,
  cursorPosition
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelinesRef = useRef<Map<string, gsap.core.Timeline>>(new Map());
  const currentStateRef = useRef<string>('idle');

  const getElement = useCallback((selector: string) => {
    return svgRef.current?.querySelector(selector);
  }, []);

  const getElements = useCallback((selector: string) => {
    return svgRef.current?.querySelectorAll(selector);
  }, []);

  const createIdleTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(getElement('.dragon-body'), {
      scaleY: 1.02,
      y: -2,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-head'), {
      y: -3,
      rotation: 2,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: 8,
      duration: 1.25,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: -8,
      duration: 1.25,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 1.25)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 0.85,
      rotation: -5,
      duration: 1,
      ease: 'sine.inOut',
      transformOrigin: '55px 100px'
    }, 0)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 0.85,
      rotation: 5,
      duration: 1,
      ease: 'sine.inOut',
      transformOrigin: '145px 100px'
    }, 0.1)
    .to(getElement('.dragon-arm-left'), {
      rotation: -8,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '52px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: 8,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0.3);

    return tl;
  }, [getElement]);

  const createWalkingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(getElement('.dragon-body'), {
      y: -4,
      rotation: -2,
      duration: 0.15,
      ease: 'sine.out',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-body'), {
      y: 0,
      rotation: 0,
      duration: 0.15,
      ease: 'sine.in',
      transformOrigin: '100px 130px'
    }, 0.15)
    .to(getElement('.dragon-body'), {
      y: -4,
      rotation: 2,
      duration: 0.15,
      ease: 'sine.out',
      transformOrigin: '100px 130px'
    }, 0.3)
    .to(getElement('.dragon-body'), {
      y: 0,
      rotation: 0,
      duration: 0.15,
      ease: 'sine.in',
      transformOrigin: '100px 130px'
    }, 0.45)
    .to(getElement('.dragon-leg-left'), {
      rotation: 15,
      y: -8,
      duration: 0.15,
      ease: 'sine.out',
      transformOrigin: '72px 165px'
    }, 0)
    .to(getElement('.dragon-leg-left'), {
      rotation: -15,
      y: 0,
      duration: 0.15,
      ease: 'sine.in',
      transformOrigin: '72px 165px'
    }, 0.15)
    .to(getElement('.dragon-leg-left'), {
      rotation: 0,
      y: 0,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '72px 165px'
    }, 0.3)
    .to(getElement('.dragon-leg-right'), {
      rotation: 0,
      y: 0,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '128px 165px'
    }, 0)
    .to(getElement('.dragon-leg-right'), {
      rotation: 15,
      y: -8,
      duration: 0.15,
      ease: 'sine.out',
      transformOrigin: '128px 165px'
    }, 0.3)
    .to(getElement('.dragon-leg-right'), {
      rotation: -15,
      y: 0,
      duration: 0.15,
      ease: 'sine.in',
      transformOrigin: '128px 165px'
    }, 0.45)
    .to(getElement('.dragon-arm-left'), {
      rotation: 20,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '52px 110px'
    }, 0)
    .to(getElement('.dragon-arm-left'), {
      rotation: -20,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '52px 110px'
    }, 0.3)
    .to(getElement('.dragon-arm-right'), {
      rotation: -20,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: 20,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0.3)
    .to(getElement('.dragon-tail'), {
      rotation: 15,
      duration: 0.2,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: -15,
      duration: 0.2,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0.2)
    .to(getElement('.dragon-tail'), {
      rotation: 15,
      duration: 0.2,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0.4)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 0.7,
      rotation: -10,
      duration: 0.15,
      ease: 'sine.inOut',
      transformOrigin: '55px 100px'
    }, 0)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 1,
      rotation: 0,
      duration: 0.15,
      ease: 'sine.inOut',
      transformOrigin: '55px 100px'
    }, 0.15)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 0.7,
      rotation: 10,
      duration: 0.15,
      ease: 'sine.inOut',
      transformOrigin: '145px 100px'
    }, 0.15)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 1,
      rotation: 0,
      duration: 0.15,
      ease: 'sine.inOut',
      transformOrigin: '145px 100px'
    }, 0.3)
    .to(getElement('.dragon-head'), {
      x: 3,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-head'), {
      x: -3,
      duration: 0.3,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0.3);

    return tl;
  }, [getElement]);

  const createDancingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(getElement('.dragon-body'), {
      y: -10,
      rotation: -8,
      scaleX: 1.05,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-body'), {
      y: 0,
      rotation: 8,
      scaleX: 1.05,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: '100px 130px'
    }, 0.2)
    .to(getElement('.dragon-head'), {
      rotation: -12,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-head'), {
      rotation: 12,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: '100px 60px'
    }, 0.2)
    .to(getElement('.dragon-arm-left'), {
      rotation: -45,
      y: -15,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '52px 110px'
    }, 0)
    .to(getElement('.dragon-arm-left'), {
      rotation: 30,
      y: 0,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: '52px 110px'
    }, 0.2)
    .to(getElement('.dragon-arm-right'), {
      rotation: 45,
      y: -15,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: -30,
      y: 0,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: '148px 110px'
    }, 0.2)
    .to(getElement('.dragon-leg-left'), {
      y: -15,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '72px 165px'
    }, 0)
    .to(getElement('.dragon-leg-left'), {
      y: 0,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: '72px 165px'
    }, 0.2)
    .to(getElement('.dragon-leg-right'), {
      y: 0,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: '128px 165px'
    }, 0)
    .to(getElement('.dragon-leg-right'), {
      y: -15,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '128px 165px'
    }, 0.2)
    .to(getElement('.dragon-tail'), {
      rotation: 20,
      duration: 0.15,
      ease: 'power2.out',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: -20,
      duration: 0.15,
      ease: 'power2.in',
      transformOrigin: '145px 145px'
    }, 0.2)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 0.6,
      rotation: -15,
      duration: 0.1,
      ease: 'power2.out',
      transformOrigin: '55px 100px'
    }, 0)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 1.1,
      rotation: 5,
      duration: 0.1,
      ease: 'power2.in',
      transformOrigin: '55px 100px'
    }, 0.2)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 0.6,
      rotation: 15,
      duration: 0.1,
      ease: 'power2.out',
      transformOrigin: '145px 100px'
    }, 0)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 1.1,
      rotation: -5,
      duration: 0.1,
      ease: 'power2.in',
      transformOrigin: '145px 100px'
    }, 0.2);

    return tl;
  }, [getElement]);

  const createSleepingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(getElement('.dragon-body'), {
      scaleY: 0.97,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-head'), {
      y: 8,
      rotation: -8,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: 5,
      duration: 2.5,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 0.9,
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '55px 100px'
    }, 0)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 0.9,
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '145px 100px'
    }, 0)
    .to(getElement('.dragon-arm-left'), {
      y: 5,
      rotation: 5,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '52px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      y: 5,
      rotation: -5,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElements('.dragon-eye'), {
      scaleY: 0.1,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: 'center'
    }, 0);

    return tl;
  }, [getElement, getElements]);

  const createCelebratingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(getElement('.dragon-body'), {
      y: -15,
      scaleY: 1.1,
      scaleX: 1.1,
      duration: 0.15,
      ease: 'power2.out',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-body'), {
      y: 0,
      scaleY: 1,
      scaleX: 1,
      duration: 0.15,
      ease: 'bounce.out',
      transformOrigin: '100px 130px'
    }, 0.15)
    .to(getElement('.dragon-head'), {
      y: -12,
      rotation: 8,
      duration: 0.15,
      ease: 'power2.out',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-head'), {
      y: 0,
      rotation: 0,
      duration: 0.15,
      ease: 'bounce.out',
      transformOrigin: '100px 60px'
    }, 0.15)
    .to(getElement('.dragon-arm-left'), {
      rotation: -70,
      y: -20,
      duration: 0.15,
      ease: 'power2.out',
      transformOrigin: '52px 110px'
    }, 0)
    .to(getElement('.dragon-arm-left'), {
      rotation: -50,
      y: -10,
      duration: 0.15,
      ease: 'bounce.out',
      transformOrigin: '52px 110px'
    }, 0.15)
    .to(getElement('.dragon-arm-right'), {
      rotation: 70,
      y: -20,
      duration: 0.15,
      ease: 'power2.out',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: 50,
      y: -10,
      duration: 0.15,
      ease: 'bounce.out',
      transformOrigin: '148px 110px'
    }, 0.15)
    .to(getElement('.dragon-tail'), {
      rotation: 25,
      duration: 0.1,
      ease: 'power2.out',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: -25,
      duration: 0.1,
      ease: 'power2.out',
      transformOrigin: '145px 145px'
    }, 0.1)
    .to(getElement('.dragon-tail'), {
      rotation: 0,
      duration: 0.1,
      ease: 'power2.out',
      transformOrigin: '145px 145px'
    }, 0.2)
    .to(getElements('.dragon-sparkle'), {
      scale: 1.5,
      opacity: 1,
      duration: 0.15,
      ease: 'power2.out',
      stagger: 0.05
    }, 0)
    .to(getElements('.dragon-sparkle'), {
      scale: 1,
      opacity: 0.8,
      duration: 0.15,
      ease: 'power2.in',
      stagger: 0.05
    }, 0.15);

    return tl;
  }, [getElement, getElements]);

  const createWavingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(getElement('.dragon-arm-right'), {
      rotation: -30,
      duration: 0.25,
      ease: 'sine.out',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: -60,
      duration: 0.25,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0.25)
    .to(getElement('.dragon-arm-right'), {
      rotation: -40,
      duration: 0.25,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0.5)
    .to(getElement('.dragon-arm-right'), {
      rotation: -60,
      duration: 0.25,
      ease: 'sine.in',
      transformOrigin: '148px 110px'
    }, 0.75)
    .to(getElement('.dragon-body'), {
      x: 3,
      duration: 0.5,
      ease: 'sine.inOut',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-body'), {
      x: 0,
      duration: 0.5,
      ease: 'sine.inOut',
      transformOrigin: '100px 130px'
    }, 0.5)
    .to(getElement('.dragon-head'), {
      rotation: 8,
      duration: 0.4,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-head'), {
      rotation: 0,
      duration: 0.4,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0.5)
    .to(getElement('.dragon-tail'), {
      rotation: 10,
      duration: 0.5,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px',
      yoyo: true,
      repeat: 1
    }, 0);

    return tl;
  }, [getElement]);

  const createLaughingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(getElement('.dragon-body'), {
      scaleY: 1.05,
      scaleX: 1.02,
      duration: 0.1,
      ease: 'power2.out',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-body'), {
      scaleY: 0.98,
      scaleX: 1,
      duration: 0.1,
      ease: 'power2.in',
      transformOrigin: '100px 130px'
    }, 0.1)
    .to(getElement('.dragon-head'), {
      y: -5,
      duration: 0.075,
      ease: 'power2.out',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-head'), {
      y: 0,
      duration: 0.075,
      ease: 'power2.in',
      transformOrigin: '100px 60px'
    }, 0.075)
    .to(getElement('.dragon-mouth'), {
      attr: { d: 'M 85 85 Q 100 105 115 85' },
      duration: 0.1,
      ease: 'power2.out'
    }, 0)
    .to(getElement('.dragon-tongue'), {
      opacity: 1,
      y: 3,
      duration: 0.1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1
    }, 0)
    .to(getElements('.dragon-cheek'), {
      scale: 1.2,
      opacity: 0.9,
      duration: 0.1,
      ease: 'power2.out',
      stagger: 0.02
    }, 0);

    return tl;
  }, [getElement, getElements]);

  const createThinkingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(getElement('.dragon-head'), {
      rotation: 12,
      x: 8,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElements('.dragon-pupil'), {
      x: 5,
      y: -3,
      duration: 1,
      ease: 'sine.inOut'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: -25,
      y: -15,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElement('.dragon-body'), {
      rotation: 3,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: 5,
      duration: 2,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0);

    return tl;
  }, [getElement, getElements]);

  const createLoveTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(getElement('.dragon-body'), {
      scale: 1.08,
      duration: 0.5,
      ease: 'sine.inOut',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElements('.dragon-eye'), {
      scale: 1.15,
      duration: 0.5,
      ease: 'sine.inOut'
    }, 0)
    .to(getElements('.dragon-cheek'), {
      scale: 1.25,
      opacity: 1,
      duration: 0.4,
      ease: 'sine.inOut'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: 15,
      duration: 0.25,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: -15,
      duration: 0.25,
      ease: 'sine.inOut',
      transformOrigin: '145px 145px'
    }, 0.25)
    .to(getElements('.dragon-sparkle'), {
      scale: 1.5,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.1
    }, 0);

    return tl;
  }, [getElement, getElements]);

  const createJumpingTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(getElement('.dragon-body'), {
      scaleY: 0.85,
      y: 5,
      duration: 0.15,
      ease: 'power2.in',
      transformOrigin: '100px 180px'
    }, 0)
    .to(getElement('.dragon-body'), {
      scaleY: 1.1,
      y: -25,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '100px 180px'
    }, 0.15)
    .to(getElement('.dragon-body'), {
      scaleY: 1,
      y: 0,
      duration: 0.25,
      ease: 'bounce.out',
      transformOrigin: '100px 180px'
    }, 0.35)
    .to(getElement('.dragon-head'), {
      y: 3,
      duration: 0.15,
      ease: 'power2.in',
      transformOrigin: '100px 60px'
    }, 0)
    .to(getElement('.dragon-head'), {
      y: -20,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '100px 60px'
    }, 0.15)
    .to(getElement('.dragon-head'), {
      y: 0,
      duration: 0.25,
      ease: 'bounce.out',
      transformOrigin: '100px 60px'
    }, 0.35)
    .to(getElement('.dragon-leg-left'), {
      rotation: 20,
      duration: 0.15,
      ease: 'power2.in',
      transformOrigin: '72px 165px'
    }, 0)
    .to(getElement('.dragon-leg-left'), {
      rotation: -30,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '72px 165px'
    }, 0.15)
    .to(getElement('.dragon-leg-left'), {
      rotation: 0,
      duration: 0.25,
      ease: 'bounce.out',
      transformOrigin: '72px 165px'
    }, 0.35)
    .to(getElement('.dragon-leg-right'), {
      rotation: -20,
      duration: 0.15,
      ease: 'power2.in',
      transformOrigin: '128px 165px'
    }, 0)
    .to(getElement('.dragon-leg-right'), {
      rotation: 30,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '128px 165px'
    }, 0.15)
    .to(getElement('.dragon-leg-right'), {
      rotation: 0,
      duration: 0.25,
      ease: 'bounce.out',
      transformOrigin: '128px 165px'
    }, 0.35)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 1.2,
      rotation: -20,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '55px 100px'
    }, 0.15)
    .to(getElement('.dragon-wing-left'), {
      scaleY: 1,
      rotation: 0,
      duration: 0.25,
      ease: 'power2.in',
      transformOrigin: '55px 100px'
    }, 0.35)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 1.2,
      rotation: 20,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '145px 100px'
    }, 0.15)
    .to(getElement('.dragon-wing-right'), {
      scaleY: 1,
      rotation: 0,
      duration: 0.25,
      ease: 'power2.in',
      transformOrigin: '145px 100px'
    }, 0.35)
    .to(getElement('.dragon-tail'), {
      rotation: 30,
      duration: 0.2,
      ease: 'power2.out',
      transformOrigin: '145px 145px'
    }, 0.15)
    .to(getElement('.dragon-tail'), {
      rotation: 0,
      duration: 0.25,
      ease: 'bounce.out',
      transformOrigin: '145px 145px'
    }, 0.35)
    .to(getElement('.dragon-shadow'), {
      scale: 0.5,
      opacity: 0.1,
      duration: 0.2,
      ease: 'power2.out'
    }, 0.15)
    .to(getElement('.dragon-shadow'), {
      scale: 1,
      opacity: 0.2,
      duration: 0.25,
      ease: 'bounce.out'
    }, 0.35);

    return tl;
  }, [getElement]);

  const createSurprisedTimeline = useCallback(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    
    tl.to(getElement('.dragon-body'), {
      y: -8,
      scaleY: 1.1,
      duration: 0.15,
      ease: 'power3.out',
      transformOrigin: '100px 130px'
    }, 0)
    .to(getElement('.dragon-body'), {
      y: 0,
      scaleY: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)',
      transformOrigin: '100px 130px'
    }, 0.15)
    .to(getElements('.dragon-eye'), {
      scale: 1.3,
      duration: 0.15,
      ease: 'power3.out'
    }, 0)
    .to(getElements('.dragon-eye'), {
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)'
    }, 0.15)
    .to(getElement('.dragon-mouth'), {
      attr: { d: 'M 90 88 Q 100 98 110 88' },
      duration: 0.1,
      ease: 'power2.out'
    }, 0)
    .to(getElement('.dragon-arm-left'), {
      rotation: -20,
      y: -10,
      duration: 0.15,
      ease: 'power3.out',
      transformOrigin: '52px 110px'
    }, 0)
    .to(getElement('.dragon-arm-right'), {
      rotation: 20,
      y: -10,
      duration: 0.15,
      ease: 'power3.out',
      transformOrigin: '148px 110px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: 25,
      duration: 0.1,
      ease: 'power3.out',
      transformOrigin: '145px 145px'
    }, 0)
    .to(getElement('.dragon-tail'), {
      rotation: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
      transformOrigin: '145px 145px'
    }, 0.1);

    return tl;
  }, [getElement, getElements]);

  const resetAllParts = useCallback(() => {
    const parts = [
      '.dragon-body', '.dragon-head', '.dragon-tail',
      '.dragon-wing-left', '.dragon-wing-right',
      '.dragon-arm-left', '.dragon-arm-right',
      '.dragon-leg-left', '.dragon-leg-right',
      '.dragon-eye', '.dragon-pupil', '.dragon-cheek',
      '.dragon-sparkle', '.dragon-tongue', '.dragon-mouth',
      '.dragon-shadow'
    ];
    
    parts.forEach(selector => {
      const el = selector.includes('eye') || selector.includes('pupil') || 
                 selector.includes('cheek') || selector.includes('sparkle')
        ? getElements(selector) : getElement(selector);
      if (el) {
        gsap.set(el, { clearProps: 'all' });
      }
    });

    gsap.set(getElement('.dragon-mouth'), { attr: { d: 'M 88 88 Q 100 100 112 88' } });
    gsap.set(getElement('.dragon-tongue'), { opacity: 0 });
  }, [getElement, getElements]);

  useEffect(() => {
    if (!svgRef.current) return;

    timelinesRef.current.forEach(tl => tl.kill());
    timelinesRef.current.clear();
    resetAllParts();

    let newTimeline: gsap.core.Timeline | null = null;

    switch (state) {
      case 'idle':
        newTimeline = createIdleTimeline();
        break;
      case 'walking':
        newTimeline = createWalkingTimeline();
        break;
      case 'dancing':
        newTimeline = createDancingTimeline();
        break;
      case 'sleeping':
        newTimeline = createSleepingTimeline();
        break;
      case 'celebrating':
        newTimeline = createCelebratingTimeline();
        break;
      case 'waving':
        newTimeline = createWavingTimeline();
        break;
      case 'laughing':
        newTimeline = createLaughingTimeline();
        break;
      case 'thinking':
        newTimeline = createThinkingTimeline();
        break;
      case 'love':
        newTimeline = createLoveTimeline();
        break;
      case 'jumping':
        newTimeline = createJumpingTimeline();
        break;
      case 'surprised':
        newTimeline = createSurprisedTimeline();
        break;
    }

    if (newTimeline) {
      timelinesRef.current.set(state, newTimeline);
    }
    currentStateRef.current = state;

    return () => {
      timelinesRef.current.forEach(tl => tl.kill());
    };
  }, [state, createIdleTimeline, createWalkingTimeline, createDancingTimeline, 
      createSleepingTimeline, createCelebratingTimeline, createWavingTimeline,
      createLaughingTimeline, createThinkingTimeline, createLoveTimeline,
      createJumpingTimeline, createSurprisedTimeline, resetAllParts]);

  useEffect(() => {
    if (!svgRef.current || !isHovered) return;

    const cheeks = getElements('.dragon-cheek');
    const sparkles = getElements('.dragon-sparkle');
    
    gsap.to(cheeks, {
      scale: 1.2,
      opacity: 0.9,
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(sparkles, {
      scale: 1.4,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.05
    });

    return () => {
      gsap.to(cheeks, {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(sparkles, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };
  }, [isHovered, getElements]);

  useEffect(() => {
    if (!svgRef.current || !cursorPosition) return;

    const pupils = getElements('.dragon-pupil');
    const head = getElement('.dragon-head');
    
    if (pupils && head) {
      const maxPupilMove = 4;
      const maxHeadRotate = 8;
      
      const dx = (cursorPosition.x - 50) / 50;
      const dy = (cursorPosition.y - 50) / 50;
      
      gsap.to(pupils, {
        x: dx * maxPupilMove,
        y: dy * maxPupilMove * 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });

      if (currentStateRef.current === 'idle') {
        gsap.to(head, {
          rotation: dx * maxHeadRotate,
          duration: 0.5,
          ease: 'power2.out',
          transformOrigin: '100px 60px'
        });
      }
    }
  }, [cursorPosition, getElement, getElements]);

  const handleClick = useCallback(() => {
    if (!svgRef.current) return;

    gsap.to(containerRef.current, {
      scale: 1.15,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });

    const sparkles = getElements('.ambient-sparkle');
    gsap.to(sparkles, {
      scale: 2,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
      onComplete: () => {
        gsap.set(sparkles, { scale: 1, opacity: 0.8 });
      }
    });

    onClick?.();
  }, [onClick, getElements]);

  const getEmoji = () => {
    switch (state) {
      case 'love': return '❤️';
      case 'celebrating': return '🎉';
      case 'thinking': return '💭';
      case 'sleeping': return '💤';
      case 'surprised': return '❗';
      default: return null;
    }
  };

  const emoji = getEmoji();

  return (
    <div 
      ref={containerRef}
      className={`dragon-mascot-container state-${state} ${isHovered ? 'is-hovered' : ''}`}
      onClick={handleClick}
    >
      <div className="dragon-animation-wrapper">
        <svg 
          ref={svgRef}
          viewBox="0 0 200 220" 
          className="dragon-svg"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ED957"/>
              <stop offset="50%" stopColor="#5BC236"/>
              <stop offset="100%" stopColor="#4AAE2B"/>
            </linearGradient>
            <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C5F5A8"/>
              <stop offset="100%" stopColor="#A8E88A"/>
            </linearGradient>
            <linearGradient id="hornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFB347"/>
              <stop offset="100%" stopColor="#FFD93D"/>
            </linearGradient>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#98E87A"/>
              <stop offset="100%" stopColor="#7ED957"/>
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g className="dragon-tail" style={{ transformOrigin: '145px 145px' }}>
            <path 
              d="M 145 145 Q 175 140 185 155 Q 195 175 175 185 Q 160 190 165 175 Q 170 165 155 160"
              fill="url(#bodyGrad)"
              stroke="#4AAE2B"
              strokeWidth="1"
            />
            <circle cx="185" cy="165" r="7" fill="url(#hornGrad)"/>
            <circle cx="175" cy="182" r="5" fill="url(#hornGrad)"/>
            <circle cx="162" cy="185" r="4" fill="url(#hornGrad)"/>
          </g>

          <g className="dragon-wing dragon-wing-left" style={{ transformOrigin: '55px 100px' }}>
            <path 
              d="M 50 90 Q 20 60 25 85 Q 15 75 22 95 Q 10 90 25 105 Q 35 115 55 110"
              fill="url(#wingGrad)"
              stroke="#5BC236"
              strokeWidth="1.5"
              opacity="0.9"
            />
          </g>

          <g className="dragon-wing dragon-wing-right" style={{ transformOrigin: '145px 100px' }}>
            <path 
              d="M 150 90 Q 180 60 175 85 Q 185 75 178 95 Q 190 90 175 105 Q 165 115 145 110"
              fill="url(#wingGrad)"
              stroke="#5BC236"
              strokeWidth="1.5"
              opacity="0.9"
            />
          </g>

          <g className="dragon-leg dragon-leg-left" style={{ transformOrigin: '72px 165px' }}>
            <ellipse cx="72" cy="175" rx="16" ry="22" fill="url(#bodyGrad)"/>
            <ellipse cx="72" cy="192" rx="14" ry="8" fill="#4AAE2B"/>
          </g>

          <g className="dragon-leg dragon-leg-right" style={{ transformOrigin: '128px 165px' }}>
            <ellipse cx="128" cy="175" rx="16" ry="22" fill="url(#bodyGrad)"/>
            <ellipse cx="128" cy="192" rx="14" ry="8" fill="#4AAE2B"/>
          </g>

          <g className="dragon-body" filter="url(#softShadow)" style={{ transformOrigin: '100px 130px' }}>
            <ellipse cx="100" cy="130" rx="50" ry="55" fill="url(#bodyGrad)"/>
            <ellipse cx="100" cy="140" rx="38" ry="42" fill="url(#bellyGrad)"/>
          </g>

          <g className="dragon-arm dragon-arm-left" style={{ transformOrigin: '52px 110px' }}>
            <ellipse cx="52" cy="120" rx="14" ry="22" fill="url(#bodyGrad)" transform="rotate(25 52 120)"/>
            <ellipse cx="45" cy="138" rx="10" ry="8" fill="#4AAE2B"/>
          </g>

          <g className="dragon-arm dragon-arm-right" style={{ transformOrigin: '148px 110px' }}>
            <ellipse cx="148" cy="120" rx="14" ry="22" fill="url(#bodyGrad)" transform="rotate(-25 148 120)"/>
            <ellipse cx="155" cy="138" rx="10" ry="8" fill="#4AAE2B"/>
          </g>

          <g className="dragon-head" style={{ transformOrigin: '100px 60px' }}>
            <ellipse cx="100" cy="60" rx="42" ry="38" fill="url(#bodyGrad)" filter="url(#softShadow)"/>
            <ellipse cx="100" cy="78" rx="18" ry="12" fill="#6BCB55"/>
            
            <g className="dragon-horn dragon-horn-left">
              <ellipse cx="68" cy="28" rx="8" ry="20" fill="url(#hornGrad)" transform="rotate(-15 68 28)"/>
            </g>
            
            <g className="dragon-horn dragon-horn-right">
              <ellipse cx="132" cy="28" rx="8" ry="20" fill="url(#hornGrad)" transform="rotate(15 132 28)"/>
            </g>

            <path d="M 58 45 Q 45 35 50 50 Q 48 55 58 55" fill="#7ED957" className="dragon-ear-left"/>
            <path d="M 142 45 Q 155 35 150 50 Q 152 55 142 55" fill="#7ED957" className="dragon-ear-right"/>

            <g className="dragon-eyes">
              <g className="dragon-eye dragon-eye-left" style={{ transformOrigin: '78px 52px' }}>
                <ellipse cx="78" cy="52" rx="16" ry="18" fill="white" stroke="#E8E8E8" strokeWidth="1"/>
                <ellipse cx="80" cy="54" rx="10" ry="12" fill="#2D1B14" className="dragon-pupil"/>
                <circle cx="84" cy="48" r="4" fill="white" className="dragon-sparkle"/>
                <circle cx="76" cy="58" r="2" fill="white" className="dragon-sparkle"/>
              </g>
              
              <g className="dragon-eye dragon-eye-right" style={{ transformOrigin: '122px 52px' }}>
                <ellipse cx="122" cy="52" rx="16" ry="18" fill="white" stroke="#E8E8E8" strokeWidth="1"/>
                <ellipse cx="124" cy="54" rx="10" ry="12" fill="#2D1B14" className="dragon-pupil"/>
                <circle cx="128" cy="48" r="4" fill="white" className="dragon-sparkle"/>
                <circle cx="120" cy="58" r="2" fill="white" className="dragon-sparkle"/>
              </g>
            </g>

            <ellipse cx="55" cy="68" rx="12" ry="8" fill="#FFB6C1" opacity="0.6" className="dragon-cheek dragon-cheek-left"/>
            <ellipse cx="145" cy="68" rx="12" ry="8" fill="#FFB6C1" opacity="0.6" className="dragon-cheek dragon-cheek-right"/>

            <circle cx="93" cy="78" r="3" fill="#4AAE2B" className="dragon-nostril"/>
            <circle cx="107" cy="78" r="3" fill="#4AAE2B" className="dragon-nostril"/>

            <path 
              d="M 88 88 Q 100 100 112 88" 
              stroke="#4AAE2B" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
              className="dragon-mouth"
            />

            <path 
              d="M 100 92 Q 100 102 95 105 Q 100 103 105 105 Q 100 102 100 92" 
              fill="#FF7B9C"
              className="dragon-tongue"
              opacity="0"
            />
          </g>

          <g className="dragon-sparkles">
            <circle cx="40" cy="40" r="3" fill="#FFD93D" className="ambient-sparkle"/>
            <circle cx="160" cy="35" r="2" fill="#FFD93D" className="ambient-sparkle"/>
            <circle cx="25" cy="100" r="2.5" fill="#FF6B9D" className="ambient-sparkle"/>
            <circle cx="175" cy="95" r="2" fill="#74B9FF" className="ambient-sparkle"/>
          </g>
        </svg>
      </div>
      
      {emoji && (
        <div className="dragon-emoji-bubble">
          <span className="emoji-float">{emoji}</span>
        </div>
      )}
      
      <div className="dragon-shadow"></div>
    </div>
  );
};

export default DragonMascot;
