"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Builds the displacement map for the refraction pass.
 *
 * feDisplacementMap reads the X offset from the red channel and Y from green,
 * where 128 means "no shift". The two gradients are screen-blended so the middle
 * of the surface lands on rgb(128,128,·) — flat and undistorted — while the outer
 * bands ramp toward 0/255. That edge-only falloff is what reads as a thick glass
 * rim rather than a uniformly smeared panel.
 *
 * Bands are passed in as percentages so they can track the element's real aspect
 * ratio: a wide, short dock needs a tall band and a narrow one, and vice versa.
 */
const buildDisplacementMap = (xBand: number, yBand: number) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" preserveAspectRatio="none">` +
        `<defs>` +
        `<linearGradient id="x" x1="0" y1="0" x2="1" y2="0">` +
        `<stop offset="0%" stop-color="#000000"/>` +
        `<stop offset="${xBand}%" stop-color="#800000"/>` +
        `<stop offset="${100 - xBand}%" stop-color="#800000"/>` +
        `<stop offset="100%" stop-color="#ff0000"/>` +
        `</linearGradient>` +
        `<linearGradient id="y" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0%" stop-color="#000000"/>` +
        `<stop offset="${yBand}%" stop-color="#008000"/>` +
        `<stop offset="${100 - yBand}%" stop-color="#008000"/>` +
        `<stop offset="100%" stop-color="#00ff00"/>` +
        `</linearGradient>` +
        `</defs>` +
        `<rect width="200" height="200" fill="url(#x)"/>` +
        `<rect width="200" height="200" fill="url(#y)" style="mix-blend-mode:screen"/>` +
        `</svg>`
    );

const FILTER_ID = "liquid-glass-refraction";

/** Width of the refracting rim, in CSS px, held constant across shapes. */
const BAND_PX = 24;

/** Max displacement is scale/2, so this bends the rim by up to ~17px. */
const DISPLACEMENT_SCALE = 34;

/**
 * Frosted-glass chrome that genuinely refracts the page content behind it.
 *
 * Unlike a WebGL transmission material, backdrop-filter composites against the
 * real DOM underneath, so this works as an overlay on top of arbitrary content.
 * The SVG displacement pass is progressive enhancement — Chromium supports
 * url() inside backdrop-filter, everything else falls back to a heavier blur.
 *
 * Drop it as the first child of a `relative rounded-*` container and give the
 * container's real content a `relative z-10` wrapper.
 */
export default function GlassSurface({ rounded = "rounded-full" }: { rounded?: string }) {
    const surfaceRef = useRef<HTMLDivElement>(null);
    const sheenRef = useRef<HTMLDivElement>(null);
    const [canRefract, setCanRefract] = useState(false);
    const [bands, setBands] = useState({ x: 30, y: 9 });

    useEffect(() => {
        setCanRefract(
            typeof CSS !== "undefined" &&
            typeof CSS.supports === "function" &&
            CSS.supports("backdrop-filter", `url(#${FILTER_ID})`)
        );
    }, []);

    // Keep the rim a constant physical width however the dock is laid out.
    useEffect(() => {
        const el = surfaceRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (!width || !height) return;
            setBands({
                x: Math.min(45, (BAND_PX / width) * 100),
                y: Math.min(45, (BAND_PX / height) * 100),
            });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Pointer-tracked specular highlight. Written straight to CSS custom
    // properties and rAF-throttled so dragging the cursor never re-renders React.
    useEffect(() => {
        let frame = 0;
        let pending: PointerEvent | null = null;

        const apply = () => {
            frame = 0;
            const surface = surfaceRef.current;
            const sheen = sheenRef.current;
            if (!pending || !surface || !sheen) return;

            const rect = surface.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const x = ((pending.clientX - rect.left) / rect.width) * 100;
            const y = ((pending.clientY - rect.top) / rect.height) * 100;
            sheen.style.setProperty("--spec-x", `${x}%`);
            sheen.style.setProperty("--spec-y", `${y}%`);
        };

        const onMove = (event: PointerEvent) => {
            pending = event;
            if (!frame) frame = requestAnimationFrame(apply);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    const backdrop = canRefract
        ? `blur(2px) url(#${FILTER_ID}) saturate(2) brightness(1.12)`
        : "blur(16px) saturate(2) brightness(1.12)";

    return (
        <>
            <svg aria-hidden className="absolute w-0 h-0 pointer-events-none">
                <filter
                    id={FILTER_ID}
                    x="-25%"
                    y="-25%"
                    width="150%"
                    height="150%"
                    colorInterpolationFilters="sRGB"
                >
                    <feImage
                        href={buildDisplacementMap(bands.x, bands.y)}
                        result="map"
                        preserveAspectRatio="none"
                    />
                    <feGaussianBlur in="map" stdDeviation="2" result="smoothMap" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="smoothMap"
                        scale={DISPLACEMENT_SCALE}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            {/* Refraction pass — bends whatever is behind the dock */}
            <div
                ref={surfaceRef}
                aria-hidden
                className={`absolute inset-0 ${rounded} pointer-events-none`}
                style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
            />

            {/* Tint, rim light and pointer-tracked specular — the cues that sell "thick glass" */}
            <div
                ref={sheenRef}
                aria-hidden
                className={`absolute inset-0 ${rounded} pointer-events-none`}
                style={{
                    ["--spec-x" as string]: "50%",
                    ["--spec-y" as string]: "0%",
                    background: [
                        "radial-gradient(120px circle at var(--spec-x) var(--spec-y), rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)",
                        "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0) 52%, rgba(255,255,255,0.09) 100%)",
                    ].join(", "),
                    boxShadow: [
                        "inset 0 1px 1px rgba(255,255,255,0.65)",
                        "inset 0 -1px 1px rgba(255,255,255,0.22)",
                        "inset 1px 0 1px rgba(255,255,255,0.32)",
                        "inset -1px 0 1px rgba(255,255,255,0.32)",
                    ].join(", "),
                }}
            />
        </>
    );
}
