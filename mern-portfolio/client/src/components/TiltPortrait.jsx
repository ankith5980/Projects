import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'framer-motion';
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
 *
 * The frame is also graded into the page rather than floating over it: a
 * violet halo echoing the backdrop's wash, a patch of the backdrop's own grid
 * as a plinth, and scrims inside the frame that tint the photo's white studio
 * plate and dissolve its bottom edge. See the `.portrait-*` and `.grid-patch`
 * utilities in index.css — all token-driven, so both themes fall out of one
 * set of classes.
 *
 * `blend` goes a step further, for the Home hero: the hard frame (ring, corner
 * brackets, radius) is dropped and the photo is feathered on every edge with a
 * mask, so the giant DEVELOPER lettering and the page grid read *through* the
 * portrait's border instead of stopping at it.
 *
 * Everything here is input-driven — cursor, gyro, hover. The frame never moves
 * on its own: no idle drift, no scroll parallax. It sits still until touched.
 */
const MAX_TILT = 9;        // degrees, each axis
const GYRO_GAIN = 0.55;    // device degrees → tilt degrees
const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };
// Slower and softer than the tilt: this one drives the light, and a highlight
// that snaps as fast as the geometry reads as a cursor, not as a lamp.
const LIGHT_SPRING = { stiffness: 70, damping: 22, mass: 0.8 };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const TiltPortrait = ({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  imgClassName = 'h-full w-full object-cover object-center',
  blend = false,
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

  // Specular sheen. Rides the existing rotateY spring — no extra state, no
  // per-frame JS of its own — and sweeps against the turn, the way a highlight
  // tracks across glass held under a fixed light.
  const sheenX = useTransform(rotateY, [-MAX_TILT, MAX_TILT], ['140%', '-40%']);

  /*
    Light source. Normalised cursor position over the frame, lagging the tilt —
    it positions a soft key light on the photo and drags the halo behind the
    frame the opposite way, so the glow always sits on the far side of the
    subject from the light. Idles at the top-centre, i.e. the same place the
    backdrop's violet wash comes from.
  */
  const lightX = useSpring(50, LIGHT_SPRING);
  const lightY = useSpring(18, LIGHT_SPRING);
  const keyLight = useMotionTemplate`radial-gradient(ellipse 70% 60% at ${lightX}% ${lightY}%, rgb(255 255 255 / 0.22) 0%, rgb(var(--accent-soft) / 0.10) 42%, transparent 72%)`;
  const haloX = useTransform(lightX, [0, 100], [26, -26]);
  const haloY = useTransform(lightY, [0, 100], [18, -18]);

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

      lightX.set((px + 0.5) * 100);
      lightY.set((py + 0.5) * 100);
    },
    [tiltEnabled, isTouch, rotateX, rotateY, lightX, lightY]
  );

  const resetTilt = useCallback(() => {
    if (isTouch) return; // the gyro owns the values on touch devices
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(50);
    lightY.set(18);
  }, [isTouch, rotateX, rotateY, lightX, lightY]);

  /* ---- Gyroscope tilt (touch devices) ---- */

  const applyOrientation = useCallback(
    (e) => {
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;

      if (!baselineRef.current) baselineRef.current = { beta, gamma };
      const base = baselineRef.current;

      const ry = clamp((gamma - base.gamma) * GYRO_GAIN, -MAX_TILT, MAX_TILT);
      const rx = clamp(-(beta - base.beta) * GYRO_GAIN, -MAX_TILT, MAX_TILT);
      rotateY.set(ry);
      rotateX.set(rx);

      // Same mapping as the cursor path, so the key light tracks the handset's
      // attitude: tip the phone and the highlight runs across the photo.
      lightX.set(50 + (ry / MAX_TILT) * 50);
      lightY.set(clamp(18 - (rx / MAX_TILT) * 40, 0, 100));
    },
    [rotateX, rotateY, lightX, lightY]
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

  // In blend mode the frame itself is gone, so the plate is the photo — the
  // mask does the containing that `overflow-hidden` + radius used to.
  // The radius is what gives the plate its shape in blend mode — the mask only
  // softens the edge, so the corners have to be rounded here or the feather
  // reads as a torn rectangle.
  const plateClass = blend
    ? 'portrait-blend relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem]'
    : 'ring-gradient-violet relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] shadow-soft-lg';

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
        {/*
          Ambient halo — the same recipe as the backdrop's top violet wash
          (GridBackdrop), so the portrait reads as sitting *in* that light
          rather than in front of it. Pushed well behind the frame in Z so the
          tilt parallaxes it, and slid opposite the key light so the glow
          always spills from the shadow side.
        */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 rounded-[3rem] blur-[60px]"
          style={{
            opacity: 'var(--portrait-halo)',
            background:
              'radial-gradient(ellipse at 50% 30%, rgb(var(--accent) / 0.30) 0%, rgb(var(--accent-soft) / 0.14) 45%, transparent 72%)',
            translateZ: -60,
            x: tiltEnabled ? haloX : 0,
            y: tiltEnabled ? haloY : 0,
          }}
        />

        {/*
          Grid plinth. Offset down-and-right only — the left edge is the tight
          one, since About's hero clips at the section bounds and already
          spends its padding budget on the corner brackets.
        */}
        <span
          aria-hidden="true"
          className="grid-patch pointer-events-none absolute -bottom-5 -right-5 h-2/3 w-2/3 rounded-[2rem]"
          style={{ transform: 'translateZ(-30px)' }}
        />

        {/* `isolation` is load-bearing: it keeps the scrims' blend modes
            composited against the photo and never against the page. */}
        <div className={plateClass} style={{ isolation: 'isolate' }}>
          <img
            src={src}
            alt={alt}
            className={`portrait-grade ${imgClassName}`}
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

          <span aria-hidden="true" className="portrait-scrim" />
          {!blend && <span aria-hidden="true" className="portrait-floor" />}

          {/* Key light. Soft-light keeps it inside the photo's own tonal
              range — it lifts and cools the lit side instead of laying a
              white film over the face. */}
          {tiltEnabled && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: keyLight, mixBlendMode: 'soft-light' }}
            />
          )}

          {tiltEnabled && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(105deg, transparent 35%, rgb(255 255 255 / 0.16) 50%, transparent 65%)',
                backgroundSize: '220% 100%',
                backgroundPositionX: sheenX,
                mixBlendMode: 'overlay',
              }}
            />
          )}
        </div>

        {/* Corner brackets — all four, lifted off the image plane so they
            separate from it as the frame turns. Dropped in blend mode: they
            are exactly the hard edge that variant exists to remove. */}
        {!blend && (
          <>
            <span aria-hidden="true" className={`${cornerBase} -left-3 -top-3 border-l-2 border-t-2`} style={{ transform: 'translateZ(36px)' }} />
            <span aria-hidden="true" className={`${cornerBase} -right-3 -top-3 border-r-2 border-t-2`} style={{ transform: 'translateZ(36px)' }} />
            <span aria-hidden="true" className={`${cornerBase} -bottom-3 -left-3 border-b-2 border-l-2`} style={{ transform: 'translateZ(36px)' }} />
            <span aria-hidden="true" className={`${cornerBase} -bottom-3 -right-3 border-b-2 border-r-2`} style={{ transform: 'translateZ(36px)' }} />
          </>
        )}

        {children}
      </motion.div>
    </div>
  );
};

export default React.memo(TiltPortrait);
