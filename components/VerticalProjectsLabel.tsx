"use client";

import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

// Inter, weight 900: of the three references named, Monument Extended isn't
// on Google Fonts (commercial/self-hosted only) and Syncopate tops out at 700
// — Inter Black is the one that's both freely available via next/font (same
// self-hosted, no-runtime-request pattern as Geist in app/layout.tsx) and
// genuinely reaches the "heavily weighted, wide" register asked for.
const inter = Inter({ subsets: ["latin"], weight: ["900"] });

const WORD = "PROJECTS";

/** Radius (px) of the cursor-revealed spotlight. Inside REVEAL_INNER it's
 *  fully opaque; from there out to REVEAL_RADIUS it fades smoothly; beyond
 *  that it's mask-transparent, i.e. truly invisible, not just dim. Sized
 *  generously now that tracking is global — the aura should start forming
 *  well before the cursor actually reaches the narrow letter column. */
const REVEAL_RADIUS = 380;
const REVEAL_INNER = 130;

/** Fine grey-foil grain, same feTurbulence technique as the page background
 *  in Background.tsx but at a higher baseFrequency for a tighter, denser
 *  grain that reads at glyph scale rather than across the whole viewport.
 *  Includes its own "0 0/70px 70px" position/size — that per-layer shorthand
 *  is only valid on the `background` shorthand property, not on
 *  `background-image` alone, so this constant is meant for `background`. */
const GRAIN_TEXTURE_LAYER =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\") 0 0/70px 70px";

/** Flat, muted grey — matte, no sheen, no colour — matching the Bugatti
 *  reference's dark grainy wordmark rather than a bright glow. */
const GREY_FILL = "linear-gradient(180deg, #474747 0%, #3a3a3a 100%)";

/** `var(--mx, -9999px)` supplies the "off-screen" default itself, so the mask
 *  is correctly fully-transparent before the very first pointer move — no
 *  initial-state bookkeeping needed. This string is static; only the two
 *  custom properties it reads change at runtime, and — critically — those
 *  coordinates are allowed to sit outside the element's own box entirely, so
 *  the circle can bleed in from a cursor that hasn't reached the column yet. */
const MASK_IMAGE = `radial-gradient(circle ${REVEAL_RADIUS}px at var(--mx, -9999px) var(--my, -9999px), black 0%, black ${(REVEAL_INNER / REVEAL_RADIUS) * 100}%, transparent 100%)`;

/**
 * "PROJECTS" set vertically in the empty space left of the projects grid,
 * styled and revealed the way the Bugatti reference does it: massive,
 * heavily-weighted, tightly-tracked letters in flat dark grey grain, with a
 * cursor-tracking spotlight that starts revealing them from a distance — no
 * glow, no colour shift, no per-letter brightening.
 *
 * Tracking is global (window-level pointermove, not scoped to this element)
 * so the reveal begins before the cursor ever reaches the narrow letter
 * column, matching the reference's "approaches from across the page"
 * behaviour. Position is written straight to two CSS custom properties via a
 * ref — a plain `element.style.setProperty()`, not a Framer MotionValue —
 * because there's no spring/interpolation needed on the raw coordinate (the
 * gradient's own falloff is what makes the reveal read as soft), and a
 * direct write means the browser recalculates the gradient itself on every
 * change with nothing routed through React or an animation-frame scheduler.
 */
export default function VerticalProjectsLabel() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const setPosition = (clientX: number, clientY: number) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            el.style.setProperty("--mx", `${clientX - rect.left}px`);
            el.style.setProperty("--my", `${clientY - rect.top}px`);
        };

        const handleMove = (e: PointerEvent) => setPosition(e.clientX, e.clientY);

        // Detect the cursor leaving the browser viewport entirely —
        // `relatedTarget` is null only when the pointer moves off the
        // document (out to the OS/another window), not when moving between
        // elements within the page — and snap the reveal back off-screen so
        // it doesn't stay lit at its last position.
        const handleWindowLeave = (e: MouseEvent) => {
            if (e.relatedTarget) return;
            const el = containerRef.current;
            if (!el) return;
            el.style.setProperty("--mx", "-9999px");
            el.style.setProperty("--my", "-9999px");
        };

        window.addEventListener("pointermove", handleMove);
        document.addEventListener("mouseout", handleWindowLeave);
        return () => {
            window.removeEventListener("pointermove", handleMove);
            document.removeEventListener("mouseout", handleWindowLeave);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ WebkitMaskImage: MASK_IMAGE, maskImage: MASK_IMAGE } as React.CSSProperties}
            className="hidden lg:flex absolute left-2 xl:left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center px-4 py-4 select-none"
        >
            {WORD.split("").map((char, i) => (
                <span
                    key={`${char}-${i}`}
                    style={{
                        background: `${GRAIN_TEXTURE_LAYER}, ${GREY_FILL}`,
                        backgroundBlendMode: "overlay",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                    className={`${inter.className} block text-7xl xl:text-8xl font-black tracking-[-0.02em] leading-[0.8]`}
                >
                    {char}
                </span>
            ))}
        </div>
    );
}
