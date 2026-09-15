"use client";

import * as React from "react";

/**
 * Film grain, as a tiled SVG rather than a bitmap: it is the one texture here
 * that has to sit over the whole frame.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='gamma' exponent='4'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

const BURN_AT = 0.62;
const BURN_SPAN = 0.38;
const LEAD = 0.7;
const DIM = 0.3;
const OPEN = 0.22;
const FAR = 4;
const NEAR = 0.25;
const RAMP = 0.09;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function useReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduce(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);
  return reduce;
}

export function ScrollBurnText({
  sections,
  hint = "scroll to ignite",
  runway = "140vh",
  container,
  className = "",
}) {
  const prefersReducedMotion = useReducedMotion();
  const runwayRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const blockRefs = React.useRef([]);

  const count = sections.length;
  const total = React.useRef(count);
  total.current = count;

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const el = runwayRef.current;
    if (!el) return;
    const containerEl = container?.current ?? null;
    const win = el.ownerDocument.defaultView ?? window;
    const scroller = containerEl ?? win;

    const measure = () => {
      blockRefs.current.forEach((block) => {
        if (!block) return;
        const w = block.offsetWidth || 1;
        const h = block.offsetHeight || 1;
        Array.from(block.children).forEach((node) => {
          const x = (node.offsetLeft + node.offsetWidth / 2) / w;
          const y = (node.offsetTop + node.offsetHeight / 2) / h;
          const blob =
            0.5 +
            0.28 * Math.sin(x * 11.3 + y * 6.1 + 1.7) +
            0.22 * Math.sin(x * 5.7 - y * 13.9 + 4.2);
          const middle = Math.hypot(x - 0.5, (y - 0.5) * 1.15) / 0.62;
          node.style.setProperty(
            "--t",
            `${clamp01(0.05 + 0.55 * middle + 0.45 * blob)}`
          );
        });
      });
    };

    const burnt = [];
    let active = -1;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewport = containerEl ? containerEl.clientHeight : win.innerHeight;
      const top = containerEl
        ? rect.top - containerEl.getBoundingClientRect().top
        : rect.top;
      const p = clamp01(-top / (rect.height - viewport || 1));

      const countVal = total.current;
      const t = -LEAD + p * (countVal - 1 + LEAD + BURN_AT);
      let front = 0;

      blockRefs.current.forEach((block, i) => {
        const wrap = block?.parentElement;
        if (!block || !wrap) return;
        const q = t - i;
        if (q > 1) front = Math.min(i + 1, countVal - 1);

        const alpha =
          clamp01((q + LEAD + OPEN) / 0.45) *
          (DIM + (1 - DIM) * clamp01(q / 0.45));

        if (alpha <= 0 || q > 1) {
          wrap.style.visibility = "hidden";
          return;
        }
        wrap.style.visibility = "visible";
        wrap.style.opacity = `${alpha}`;
        const depth = Math.max(
          FAR - ((FAR - NEAR) * (q + LEAD)) / (1 + LEAD),
          NEAR
        );
        wrap.style.transform = `scale(${1 / depth})`;

        const burn = clamp01((q - BURN_AT) / BURN_SPAN) * (1 + RAMP);
        if (burnt[i] !== burn) {
          burnt[i] = burn;
          block.style.setProperty("--b", `${burn}`);
          block.style.setProperty("--ab", `${0.35 + burn * 2.6}`);
        }
      });

      if (hintRef.current) {
        hintRef.current.style.opacity = `${clamp01(1 - p / 0.08)}`;
      }
      if (active !== front) {
        active = front;
      }
    };

    const onScroll = () => {
      if (!raf) raf = win.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onResize);
    const ro = containerEl ? new ResizeObserver(onResize) : null;
    if (containerEl && ro) ro.observe(containerEl);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      win.removeEventListener("resize", onResize);
      ro?.disconnect();
      if (raf) win.cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion, container]);

  const column =
    "relative w-[min(88vw,42rem)] text-center text-[clamp(1.4rem,5vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-[#E1E0CC]";

  if (prefersReducedMotion) {
    return (
      <div className={`w-full bg-background px-6 py-24 ${className}`}>
        <div className="mx-auto grid max-w-2xl gap-10">
          {sections.map((body, i) => (
            <p key={i} className={`${column} w-full text-left`}>
              {body}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-background relative z-20 ${className}`}>
      <div
        ref={runwayRef}
        style={{ height: `calc(${runway} * ${count})` }}
        className="w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background flex items-center justify-center">


          {/* Scroll Hint */}
          {hint ? (
            <div
              ref={hintRef}
              className="pointer-events-none absolute inset-x-0 bottom-16 z-10 text-center"
            >
              <span className="relative text-[0.65rem] font-mono font-medium uppercase tracking-[0.25em] text-muted after:absolute after:left-1/2 after:top-full after:mt-2 after:h-8 after:w-px after:bg-gradient-to-b after:from-accent/60 after:to-transparent after:content-['']">
                {hint}
              </span>
            </div>
          ) : null}

          {sections.map((body, i) => (
            <div
              key={i}
              style={{ visibility: "hidden" }}
              className="absolute inset-0 grid place-items-center will-change-transform"
              aria-hidden
            >
              <p
                ref={(node) => {
                  blockRefs.current[i] = node;
                }}
                className={column}
                style={{
                  "--b": 0,
                  "--ab": 0.35,
                  textShadow:
                    "calc(var(--ab) * -1px) 0 rgb(255 45 85 / 0.85), calc(var(--ab) * 1px) 0 rgb(0 225 255 / 0.85)",
                  fontFamily:
                    "var(--font-space-grotesk), var(--font-geist-sans), system-ui, sans-serif",
                }}
              >
                {Array.from(body).map((ch, k) =>
                  ch === " " ? (
                    " "
                  ) : (
                    <span
                      key={k}
                      className="opacity-[calc((var(--t,1)_+_0.09_-_var(--b,0))*11)] inline-block"
                      style={{
                        opacity: "calc((var(--t, 1) + 0.09 - var(--b, 0)) * 11)",
                      }}
                    >
                      {ch}
                    </span>
                  )
                )}
              </p>
            </div>
          ))}

          {/* Film Grain Layer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ backgroundImage: GRAIN, backgroundSize: "180px" }}
          />

          <p className="sr-only">{sections.join(" ")}</p>
        </div>
      </div>
    </div>
  );
}

export default ScrollBurnText;
