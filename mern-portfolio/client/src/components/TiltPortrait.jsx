import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import useMediaQuery, { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * The framed portrait used on Home and About.
 *
 * Adds a shallow 3D tilt on top of the existing violet-ringed frame:
 *   - pointer devices tilt toward the cursor's position over the frame;
 *   - touch devices use the gyroscope instead, so physically tilting the
 *     phone tilts the frame.
 *
 * The tilt is deliberately small (MAX_TILT) and spring-damped — enough to read
 * as a physical object catching the light, not a novelty card flip. Corner
 * brackets and any overlay children sit on a raised Z plane so they separate
 * from the image as it turns.
 *
 * Reduced-motion users get the flat frame with no listeners attached at all.
 */
const MAX_TILT = 9;        // degrees, each axis
const GYRO_GAIN = 0.55;    // device degrees → tilt degrees
const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const TiltPortrait = ({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  imgClassName = 'h-full w-full object-cover object-center',
  children,
  ...imgProps
}) => {
  const reduceMotion = usePrefersReducedMotion();
  // Coarse pointer with no hover — phones and tablets. These get the gyro
  // path; everything else gets the cursor path.
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');
  const tiltEnabled = !reduceMotion;

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const frameRef = useRef(null);
  // First gyro reading becomes the neutral pose, so the frame sits flat at
  // whatever angle the phone is already being held at.
  const baselineRef = useRef(null);
  const [needsGyroConsent, setNeedsGyroConsent] = useState(false);

  /* ---- Pointer tilt (mouse / trackpad / stylus) ---- */

  const handlePointerMove = useCallback(
    (e) => {
      if (!tiltEnabled || isTouch || e.pointerType === 'touch') return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const px = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 … 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      rotateY.set(px * 2 * MAX_TILT);
      rotateX.set(-py * 2 * MAX_TILT);
    },
    [tiltEnabled, isTouch, rotateX, rotateY]
  );

  const resetTilt = useCallback(() => {
    if (isTouch) return; // the gyro owns the values on touch devices
    rotateX.set(0);
    rotateY.set(0);
  }, [isTouch, rotateX, rotateY]);

  /* ---- Gyroscope tilt (touch devices) ---- */

  const applyOrientation = useCallback(
    (e) => {
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;

      if (!baselineRef.current) baselineRef.current = { beta, gamma };
      const base = baselineRef.current;

      rotateY.set(clamp((gamma - base.gamma) * GYRO_GAIN, -MAX_TILT, MAX_TILT));
      rotateX.set(clamp(-(beta - base.beta) * GYRO_GAIN, -MAX_TILT, MAX_TILT));
    },
    [rotateX, rotateY]
  );

  useEffect(() => {
    if (!tiltEnabled || !isTouch) return undefined;
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      return undefined;
    }

    // iOS 13+ gates the sensor behind an explicit grant that can only be
    // requested from a user gesture — flag it and let the tap handler ask.
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsGyroConsent(true);
      return undefined;
    }

    baselineRef.current = null;
    window.addEventListener('deviceorientation', applyOrientation, true);
    return () => window.removeEventListener('deviceorientation', applyOrientation, true);
  }, [tiltEnabled, isTouch, applyOrientation]);

  // Re-level when the device is rotated — the old baseline is meaningless once
  // beta/gamma swap roles.
  useEffect(() => {
    if (!tiltEnabled || !isTouch) return undefined;
    const onOrientationChange = () => { baselineRef.current = null; };
    window.addEventListener('orientationchange', onOrientationChange);
    return () => window.removeEventListener('orientationchange', onOrientationChange);
  }, [tiltEnabled, isTouch]);

  const requestGyroConsent = useCallback(async () => {
    if (!needsGyroConsent) return;
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result !== 'granted') return;
      baselineRef.current = null;
      window.addEventListener('deviceorientation', applyOrientation, true);
      setNeedsGyroConsent(false);
    } catch {
      // Declined or unavailable — the frame simply stays flat.
    }
  }, [needsGyroConsent, applyOrientation]);

  useEffect(() => () => {
    window.removeEventListener('deviceorientation', applyOrientation, true);
  }, [applyOrientation]);

  const cornerBase = 'pointer-events-none absolute z-20 h-6 w-6 border-accent/60';

  return (
    <div
      ref={frameRef}
      className={`relative ${className}`}
      style={{ perspective: 1000, ...style }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      // Only meaningful on iOS, where the sensor needs a gesture to unlock.
      onClick={needsGyroConsent ? requestGyroConsent : undefined}
    >
      <motion.div
        className="relative w-full"
        style={{
          rotateX: tiltEnabled ? rotateX : 0,
          rotateY: tiltEnabled ? rotateY : 0,
          transformStyle: 'preserve-3d',
          willChange: tiltEnabled ? 'transform' : undefined,
        }}
      >
        <div className="ring-gradient-violet aspect-[3/4] w-full overflow-hidden rounded-[2rem] shadow-soft-lg">
          <img
            src={src}
            alt={alt}
            className={imgClassName}
            width={width}
            height={height}
            draggable="false"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'flex';
              }
            }}
            {...imgProps}
          />
          <div className="hidden h-full w-full items-center justify-center bg-elev text-6xl text-muted">
            👤
          </div>
        </div>

        {/* Corner brackets — all four, lifted off the image plane so they
            separate from it as the frame turns. */}
        <span aria-hidden="true" className={`${cornerBase} -left-3 -top-3 border-l-2 border-t-2`} style={{ transform: 'translateZ(36px)' }} />
        <span aria-hidden="true" className={`${cornerBase} -right-3 -top-3 border-r-2 border-t-2`} style={{ transform: 'translateZ(36px)' }} />
        <span aria-hidden="true" className={`${cornerBase} -bottom-3 -left-3 border-b-2 border-l-2`} style={{ transform: 'translateZ(36px)' }} />
        <span aria-hidden="true" className={`${cornerBase} -bottom-3 -right-3 border-b-2 border-r-2`} style={{ transform: 'translateZ(36px)' }} />

        {children}
      </motion.div>
    </div>
  );
};

export default React.memo(TiltPortrait);
