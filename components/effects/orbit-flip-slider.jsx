// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useSyncExternalStore } from "react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/dist/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQueryList.addEventListener("change", callback);
      return () => mediaQueryList.removeEventListener("change", callback);
    },
    () =>
      typeof window === "undefined"
        ? false
        : window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
    () => false
  );
}

const MODES = [
  { key: "flat", label: "Flat" },
  { key: "tilt", label: "Tilt" },
  { key: "ring", label: "Ring" },
  { key: "gallery", label: "Gallery" },
];

const degToRad = (deg) => (deg * Math.PI) / 180;

const MOBILE_BREAKPOINT = 768;
const MOBILE_FLAT_RADIUS_X_SCALE = 0.55;
const MOBILE_TILT_RADIUS_X_SCALE = 0.6;
const MOBILE_TILT_RADIUS_Y_SCALE = 0.8;
const MOBILE_RING_SCALE = 0.6;
const MOBILE_GALLERY_SCALE = 0.6;

const getBaseOrbitRadius = (count, cardWidth, cardHeight, imageGap) => {
  const baseSpan = Math.max(cardWidth, cardHeight) + imageGap;
  return Math.max(((count * baseSpan) / (2 * Math.PI)) * 0.62, baseSpan * 0.9);
};

const buildCoverflowLayout = (count, containerW, containerH, sizes, params) => {
  const cx = containerW / 2;
  const camDist = params.radius * params.camDistFactor;
  const tilt = degToRad(params.tiltDeg);
  const positionScaleStrength = params.positionScaleStrength ?? 1;
  const sizeScaleStrength = params.sizeScaleStrength ?? 0.42;
  return sizes.map((size, i) => {
    const thetaDeg = params.offsetDeg + (i / count) * 360;
    const theta = degToRad(thetaDeg);
    const px = params.radius * Math.sin(theta);
    const pz0 = -params.radius * Math.cos(theta);
    const py = -pz0 * Math.sin(tilt);
    const pz = pz0 * Math.cos(tilt);
    const scale = Math.max(camDist / (camDist + pz), 0.05);
    const positionScale = 1 + (scale - 1) * positionScaleStrength;
    const sizeScale = 1 + (scale - 1) * sizeScaleStrength;
    return {
      x: cx + px * positionScale,
      y: containerH * params.anchorY + py * positionScale,
      width: size.w * sizeScale,
      height: size.h * sizeScale,
      zIndex: Math.round(scale * 1000) + 1,
    };
  });
};

const applyZRotation = (boxes, cx, cy, zDeg) => {
  if (!zDeg) return boxes;
  const rad = degToRad(zDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return boxes.map((box) => {
    const dx = box.x - cx;
    const dy = box.y - cy;
    return {
      ...box,
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    };
  });
};

const applyRadiusScale = (boxes, cx, cy, baseRadius, radiusX, radiusY) => {
  const sx = radiusX / baseRadius;
  const sy = radiusY / baseRadius;
  if (sx === 1 && sy === 1) return boxes;
  return boxes.map((box) => ({
    ...box,
    x: cx + (box.x - cx) * sx,
    y: cy + (box.y - cy) * sy,
  }));
};

const applyUniformScale = (boxes, cx, cy, scale) => {
  if (scale === 1) return boxes;
  return boxes.map((box) => ({
    ...box,
    x: cx + (box.x - cx) * scale,
    y: cy + (box.y - cy) * scale,
    width: box.width * scale,
    height: box.height * scale,
  }));
};

const applyTransform = (boxes, cx, cy, baseRadius, t) => {
  const radiusScaled = applyRadiusScale(
    boxes,
    cx,
    cy,
    baseRadius,
    baseRadius * t.radiusX,
    baseRadius * t.radiusY
  );
  const scaled = applyUniformScale(radiusScaled, cx, cy, t.scale);
  return applyZRotation(scaled, cx, cy, t.z);
};

const buildLayout = (
  mode,
  count,
  containerW,
  containerH,
  sizes,
  transforms,
  imageGap,
  rotationOffsetDeg = 0
) => {
  const cx = containerW / 2;
  const cy = containerH / 2;
  const cardWidth = sizes[0]?.w ?? 140;
  const cardHeight = sizes[0]?.h ?? 200;
  const baseRadius = getBaseOrbitRadius(count, cardWidth, cardHeight, imageGap);

  if (mode === "flat") {
    const f = transforms.flat;
    const rx = baseRadius * f.radiusX;
    const ry = baseRadius * f.radiusY;
    const boxes = sizes.map((size, i) => {
      const angle =
        (i / count) * Math.PI * 2 - Math.PI / 2 + degToRad(rotationOffsetDeg);
      return {
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        width: size.w,
        height: size.h,
        zIndex: i + 1,
      };
    });
    return applyUniformScale(boxes, cx, cy, f.scale);
  }

  const t = transforms[mode];
  const radius = mode === "gallery" ? baseRadius * 1.55 : baseRadius * 1.12;
  const anchorY = 0.5;
  const camDistFactor = mode === "gallery" ? 1.55 : 1.75;
  const positionScaleStrength = mode === "gallery" ? 0.28 : 0.45;
  const sizeScaleStrength = mode === "gallery" ? 0.16 : 0.42;
  const boxes = buildCoverflowLayout(count, containerW, containerH, sizes, {
    radius,
    tiltDeg: t.x,
    camDistFactor,
    offsetDeg: -90 + t.y + rotationOffsetDeg,
    anchorY,
    positionScaleStrength,
    sizeScaleStrength,
  });
  const transformed = applyTransform(boxes, cx, containerH * anchorY, radius, t);
  if (!t.moveY) return transformed;
  return transformed.map((box) => ({ ...box, y: box.y + t.moveY }));
};

export const OrbitFlipSliderComp = ({
  items = [],
  backgroundColor = "transparent",
  containerHeight = "h-[540px]",
  imageWidth = 110,
  imageHeight = 150,
  imageGap = 4,
  rounded = "rounded-2xl",
  enableHoverMovement = true,
  hoverMoveY = -8,
  perspectiveRotateValue = 45,
  perspectiveRotateDirection = "right",
  rotate = true,
  rotateSpeed = 4,
  stopRotationOnHover = true,
  flatRadiusX = 1,
  flatRadiusY = 1,
  flatScale = 0.95,
  ringRotateX = 31,
  ringRotateY = 56,
  ringRotateZ = -25,
  ringRadiusX = 1.35,
  ringRadiusY = 0.65,
  ringScale = 0.65,
  tiltRotateX = 65,
  tiltRotateY = 0,
  tiltRotateZ = 0,
  tiltRadiusX = 1.15,
  tiltRadiusY = 0.9,
  tiltScale = 0.95,
  tiltMoveY = 160,
  galleryRotateX = 10,
  galleryRotateY = 0,
  galleryRotateZ = 0,
  galleryRadiusX = 1,
  galleryRadiusY = 1,
  galleryScale = 0.95,
}) => {
  const FLIP_DURATION_SECONDS = 0.9;
  const trackRef = useRef(null);
  const modeRef = useRef("flat");
  const isFlipAnimatingRef = useRef(false);
  const flipResumeTimeoutRef = useRef(null);
  const rotationOffsetRef = useRef(0);
  const hoveredCardCountRef = useRef(0);
  const [activeMode, setActiveMode] = useState("flat");
  const reducedMotion = usePrefersReducedMotion();
  const sizes = items.map(() => ({ w: imageWidth, h: imageHeight }));

  const transforms = {
    flat: {
      radiusX: flatRadiusX,
      radiusY: flatRadiusY,
      scale: flatScale,
    },
    tilt: {
      x: tiltRotateX,
      y: tiltRotateY,
      z: tiltRotateZ,
      radiusX: tiltRadiusX,
      radiusY: tiltRadiusY,
      scale: tiltScale,
      moveY: tiltMoveY,
    },
    ring: {
      x: ringRotateX,
      y: ringRotateY,
      z: ringRotateZ,
      radiusX: ringRadiusX,
      radiusY: ringRadiusY,
      scale: ringScale,
      moveY: 0,
    },
    gallery: {
      x: galleryRotateX,
      y: galleryRotateY,
      z: galleryRotateZ,
      radiusX: galleryRadiusX,
      radiusY: galleryRadiusY,
      scale: galleryScale,
      moveY: 0,
    },
  };

  const applyLayout = useCallback(
    (mode, animate) => {
      const track = trackRef.current;
      if (!track) return;
      const cards = gsap.utils.toArray(".orbit-flip-slider-card", track);
      if (!cards.length) return;
      const { width, height } = track.getBoundingClientRect();
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const responsiveTransforms = isMobile
        ? {
            ...transforms,
            flat: {
              ...transforms.flat,
              radiusX: transforms.flat.radiusX * MOBILE_FLAT_RADIUS_X_SCALE,
            },
            tilt: {
              ...transforms.tilt,
              radiusX: transforms.tilt.radiusX * MOBILE_TILT_RADIUS_X_SCALE,
              radiusY: transforms.tilt.radiusY * MOBILE_TILT_RADIUS_Y_SCALE,
            },
            ring: {
              ...transforms.ring,
              scale: transforms.ring.scale * MOBILE_RING_SCALE,
            },
            gallery: {
              ...transforms.gallery,
              scale: transforms.gallery.scale * MOBILE_GALLERY_SCALE,
            },
          }
        : transforms;
      const layout = buildLayout(
        mode,
        cards.length,
        width,
        height,
        sizes,
        responsiveTransforms,
        imageGap,
        rotationOffsetRef.current
      );
      const commit = () => {
        cards.forEach((card, i) => {
          const box = layout[i];
          gsap.set(card, {
            x: box.x,
            y: box.y,
            xPercent: -50,
            yPercent: -50,
            width: box.width,
            height: box.height,
            zIndex: box.zIndex,
          });
        });
      };
      if (!animate || reducedMotion) {
        commit();
        return;
      }
      const state = Flip.getState(cards);
      commit();
      isFlipAnimatingRef.current = true;
      if (flipResumeTimeoutRef.current !== null)
        window.clearTimeout(flipResumeTimeoutRef.current);
      flipResumeTimeoutRef.current = window.setTimeout(() => {
        isFlipAnimatingRef.current = false;
        flipResumeTimeoutRef.current = null;
      }, FLIP_DURATION_SECONDS * 1000);
      Flip.from(state, {
        duration: FLIP_DURATION_SECONDS,
        ease: "power3.inOut",
        stagger: 0.015,
        absolute: true,
      });
    },
    [
      sizes,
      reducedMotion,
      imageWidth,
      imageHeight,
      imageGap,
      flatRadiusX,
      flatRadiusY,
      flatScale,
      ringRotateX,
      ringRotateY,
      ringRotateZ,
      ringRadiusX,
      ringRadiusY,
      ringScale,
      tiltRotateX,
      tiltRotateY,
      tiltRotateZ,
      tiltRadiusX,
      tiltRadiusY,
      tiltScale,
      tiltMoveY,
      galleryRotateX,
      galleryRotateY,
      galleryRotateZ,
      galleryRadiusX,
      galleryRadiusY,
      galleryScale,
    ]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      applyLayout(modeRef.current, false);
      const handleResize = () => applyLayout(modeRef.current, false);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, trackRef);
    return () => ctx.revert();
  }, [items.length]);

  const didMountTransforms = useRef(false);
  useEffect(() => {
    if (!didMountTransforms.current) {
      didMountTransforms.current = true;
      return;
    }
    applyLayout(modeRef.current, true);
  }, [
    imageWidth,
    imageHeight,
    imageGap,
    flatRadiusX,
    flatRadiusY,
    flatScale,
    ringRotateX,
    ringRotateY,
    ringRotateZ,
    ringRadiusX,
    ringRadiusY,
    ringScale,
    tiltRotateX,
    tiltRotateY,
    tiltRotateZ,
    tiltRadiusX,
    tiltRadiusY,
    tiltScale,
    tiltMoveY,
    galleryRotateX,
    galleryRotateY,
    galleryRotateZ,
    galleryRadiusX,
    galleryRadiusY,
    galleryScale,
  ]);

  const handleModeChange = (mode) => {
    if (mode === modeRef.current) return;
    modeRef.current = mode;
    setActiveMode(mode);
    applyLayout(mode, true);
  };

  useEffect(() => {
    if (!rotate || reducedMotion) return;
    let rafId;
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const paused =
        isFlipAnimatingRef.current ||
        (stopRotationOnHover && hoveredCardCountRef.current > 0);
      if (!paused) {
        rotationOffsetRef.current += rotateSpeed * dt;
        applyLayout(modeRef.current, false);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rotate, rotateSpeed, stopRotationOnHover, reducedMotion, applyLayout]);

  const handleCardEnter = useCallback(
    (e) => {
      hoveredCardCountRef.current += 1;
      if (
        reducedMotion ||
        !enableHoverMovement ||
        window.innerWidth < MOBILE_BREAKPOINT
      )
        return;
      const card = e.currentTarget;
      const inner = card.querySelector(".orbit-flip-slider-card-inner");
      if (!inner) return;
      const rotateY =
        perspectiveRotateDirection === "left"
          ? -Math.abs(perspectiveRotateValue)
          : Math.abs(perspectiveRotateValue);
      gsap.killTweensOf(inner);
      gsap.to(inner, {
        y: hoverMoveY,
        rotateY,
        boxShadow: "0 14px 26px rgba(0,0,0,0.4), 0 0 20px rgba(200,243,29,0.25)",
        duration: 0.8,
        ease: "back.out(2.2)",
      });
    },
    [
      enableHoverMovement,
      hoverMoveY,
      perspectiveRotateDirection,
      perspectiveRotateValue,
      reducedMotion,
    ]
  );

  const handleCardLeave = useCallback(
    (e) => {
      hoveredCardCountRef.current = Math.max(
        0,
        hoveredCardCountRef.current - 1
      );
      if (
        reducedMotion ||
        !enableHoverMovement ||
        window.innerWidth < MOBILE_BREAKPOINT
      )
        return;
      const card = e.currentTarget;
      const inner = card.querySelector(".orbit-flip-slider-card-inner");
      if (!inner) return;
      gsap.killTweensOf(inner);
      gsap.to(inner, {
        y: 0,
        rotateY: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        duration: 0.7,
        ease: "back.out(2.2)",
      });
    },
    [enableHoverMovement, reducedMotion]
  );

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden ${containerHeight}`}
      style={{ backgroundColor }}
    >
      {/* Top Mode Selection Pills */}
      <div className="relative z-20 flex items-center justify-between px-2 mb-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Orbit Perspective:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => handleModeChange(m.key)}
              className={`rounded-full px-3 py-1 text-[11px] font-mono transition-all duration-300 cursor-pointer ${
                activeMode === m.key
                  ? "bg-accent text-background font-semibold shadow-md shadow-accent/20"
                  : "border border-border/70 bg-surface/70 text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orbit Canvas Track */}
      <div ref={trackRef} className="relative w-full flex-1 overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="orbit-flip-slider-card absolute left-0 top-0 cursor-pointer"
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
            style={{ perspective: "600px" }}
          >
            <div
              className={`orbit-flip-slider-card-inner relative h-full w-full overflow-hidden border border-white/15 bg-black/70 shadow-2xl transition-colors hover:border-accent/80 ${rounded}`}
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={item.image}
                alt={item.alt ?? item.title ?? `Tech ${i + 1}`}
                fill
                sizes={`${imageWidth}px`}
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

              {/* Card Label / Badge */}
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-black/80 border border-accent/40 text-accent">
                  {item.badge ?? "Stack"}
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
                <p className="text-[11px] font-bold text-white truncate drop-shadow-sm">
                  {item.title}
                </p>
                {item.category && (
                  <p className="text-[9px] font-mono text-muted truncate">
                    {item.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default Curated Tech Stack for Manpreet
export const DEFAULT_TECH_ORBIT_ITEMS = [
  {
    id: "rn",
    title: "React Native",
    category: "Cross-Platform Mobile",
    image: "/projects/ai-voice.jpg",
    badge: "Core",
  },
  {
    id: "skia",
    title: "React Native Skia",
    category: "GPU 120 FPS Shaders",
    image: "/projects/voice-visualizer.jpg",
    badge: "120 FPS",
  },
  {
    id: "reanimated",
    title: "Reanimated 3",
    category: "Fluid Gestures",
    image: "/projects/kids-quest.jpg",
    badge: "Worklets",
  },
  {
    id: "ble",
    title: "Bluetooth LE",
    category: "IoT Collar Telemetry",
    image: "/projects/dog-telemetry.jpg",
    badge: "BLE GATT",
  },
  {
    id: "watermelon",
    title: "WatermelonDB",
    category: "Offline-First SQLite",
    image: "/projects/paw-pulse.jpg",
    badge: "Offline",
  },
  {
    id: "hermes",
    title: "Hermes & JSI",
    category: "Zero Bridge Latency",
    image: "/projects/pulsepay.jpg",
    badge: "Bytecode",
  },
  {
    id: "audio",
    title: "Native Audio Engine",
    category: "Realtime Voice Stream",
    image: "/projects/lumina-kids.jpg",
    badge: "<150ms",
  },
  {
    id: "haptics",
    title: "Biometric Haptics",
    category: "CoreHaptics & HAL",
    image: "/projects/aura-haptics.jpg",
    badge: "Tactile",
  },
];

export const OrbitFlipSlider = ({
  items = DEFAULT_TECH_ORBIT_ITEMS,
  backgroundColor = "transparent",
  containerHeight = "h-[540px]",
  imageWidth = 110,
  imageHeight = 150,
  imageGap = 4,
  rounded = "rounded-2xl",
  enableHoverMovement = true,
  hoverMoveY = -8,
  perspectiveRotateValue = 45,
  perspectiveRotateDirection = "right",
  rotate = true,
  rotateSpeed = 4,
  stopRotationOnHover = true,
  flatRadiusX = 1,
  flatRadiusY = 1,
  flatScale = 0.95,
  ringRotateX = 31,
  ringRotateY = 56,
  ringRotateZ = -25,
  ringRadiusX = 1.35,
  ringRadiusY = 0.65,
  ringScale = 0.65,
  tiltRotateX = 65,
  tiltRotateY = 0,
  tiltRotateZ = 0,
  tiltRadiusX = 1.15,
  tiltRadiusY = 0.9,
  tiltScale = 0.95,
  tiltMoveY = 160,
  galleryRotateX = 10,
  galleryRotateY = 0,
  galleryRotateZ = 0,
  galleryRadiusX = 1,
  galleryRadiusY = 1,
  galleryScale = 0.95,
}) => {
  return (
    <OrbitFlipSliderComp
      items={items}
      backgroundColor={backgroundColor}
      containerHeight={containerHeight}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      imageGap={imageGap}
      rounded={rounded}
      enableHoverMovement={enableHoverMovement}
      hoverMoveY={hoverMoveY}
      perspectiveRotateValue={perspectiveRotateValue}
      perspectiveRotateDirection={perspectiveRotateDirection}
      rotate={rotate}
      rotateSpeed={rotateSpeed}
      stopRotationOnHover={stopRotationOnHover}
      flatRadiusX={flatRadiusX}
      flatRadiusY={flatRadiusY}
      flatScale={flatScale}
      ringRotateX={ringRotateX}
      ringRotateY={ringRotateY}
      ringRotateZ={ringRotateZ}
      ringRadiusX={ringRadiusX}
      ringRadiusY={ringRadiusY}
      ringScale={ringScale}
      tiltRotateX={tiltRotateX}
      tiltRotateY={tiltRotateY}
      tiltRotateZ={tiltRotateZ}
      tiltRadiusX={tiltRadiusX}
      tiltRadiusY={tiltRadiusY}
      tiltScale={tiltScale}
      tiltMoveY={tiltMoveY}
      galleryRotateX={galleryRotateX}
      galleryRotateY={galleryRotateY}
      galleryRotateZ={galleryRotateZ}
      galleryRadiusX={galleryRadiusX}
      galleryRadiusY={galleryRadiusY}
      galleryScale={galleryScale}
    />
  );
};

export default OrbitFlipSlider;
