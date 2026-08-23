"use client";

import { ReactNode } from "react";

/**
 * Scroll-pin wrapper — the same "lock into the centre" beat the Certifications
 * section uses: the <section> is taller than the viewport, and its content is
 * sticky, so it holds centred on screen while the extra height scrolls past.
 *
 * `hold` is that extra height (how long the pin lasts). Keep it well under
 * 100vh: the Header scroll-spy observes these sections at threshold 0.5, and a
 * section of height 100vh + hold can only ever reach a visible ratio of
 * 100 / (100 + hold), so a hold of 100vh would cap at 0.5 and make the active
 * dock icon flicker.
 */
export default function PinnedSection({
    id,
    children,
    hold = "25vh",
    className = "",
}: {
    id: string;
    children: ReactNode;
    hold?: string;
    className?: string;
}) {
    return (
        <section
            id={id}
            className={`relative z-10 w-full ${className}`}
            style={{ height: `calc(100vh + ${hold})` }}
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {children}
            </div>
        </section>
    );
}
