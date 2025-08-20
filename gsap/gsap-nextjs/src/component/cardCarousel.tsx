"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type Card = { id: number; title: string; src?: string; bg?: string };

const DEFAULT_CARDS: Card[] = [
  { id: 1, title: "Card 1", src: "/assets/img1.jpg", bg: "#1f2937" },
  { id: 2, title: "Card 2", src: "/assets/img2.jpg", bg: "#0f172a" },
  { id: 3, title: "Card 3", src: "/assets/img3.jpg", bg: "#111827" },
  { id: 4, title: "Card 4", src: "/assets/img4.jpg", bg: "#1f2937" },
  { id: 5, title: "Card 5", src: "/assets/img5.jpg", bg: "#0f172a" },
];

interface Props {
  cards?: Card[];
  /** full rotations to complete while pinned */
  spins?: number;
  /** scroll px per "front" moment (affects pinned length if pinLength not provided) */
  pixelsPerFront?: number;
  /** explicit pin length in px (overrides pixelsPerFront formula) */
  pinLength?: number;
  /** enable snap to each front so user can’t leave mid-state */
  snapToFront?: boolean;
}

export default function CardCarousel({
  cards = DEFAULT_CARDS,
  spins = 1,
  pixelsPerFront = 340,
  pinLength,
  snapToFront = true,
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const anchor = anchorRef.current;
    if (!section || !anchor || cardsRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      const N = cardsRef.current.length;
      const spinsFinal = Math.max(1, spins);
      // Derive a pinned scroll length that guarantees all rotations complete:
      const derivedPin = N * spinsFinal * pixelsPerFront;
      const pinLengthPx = typeof pinLength === "number" ? pinLength : derivedPin;

      const FRONT = -Math.PI / 2; // "up" from O (bottom-center)

      // Distance helper
      const angleDist = (a: number, b: number) => {
        let d = Math.abs(a - b) % (Math.PI * 2);
        return d > Math.PI ? (Math.PI * 2 - d) : d;
      };

      // Radius: start so first card is exactly centered, then expand beyond viewport
      const stageH = () => section.getBoundingClientRect().height;
      const R0 = () => stageH() / 2; // puts first card dead-center (y = -R from bottom)
      const R1 = () => Math.max(window.innerWidth, window.innerHeight) * 0.85;

      // Initial placement using R0 so Card 1 starts at visual center
      cardsRef.current.forEach((el, i) => {
        const base = (i / N) * Math.PI * 2;
        const theta = base + FRONT;
        const r = R0();
        gsap.set(el, {
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
          opacity: i === 0 ? 1 : 0.5,
          scale: i === 0 ? 1.12 : 0.86,
          rotateY: i === 0 ? 0 : 30,
          zIndex: i === 0 ? 200 : 10,
          filter: i === 0 ? "blur(0px)" : "blur(4px)",
          transformStyle: "preserve-3d",
          willChange: "transform, filter, opacity",
        });
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinLengthPx}`, // stays pinned until rotations are done
        pin: true,
        scrub: 0.6,
        ...(snapToFront && {
          snap: {
            snapTo: (value: number) => {
              // value is 0..1 of the pinned progress. Create N*spins stops.
              const stops = N * spinsFinal;
              const step = 1 / stops;
              return Math.round(value / step) * step;
            },
            duration: 0.25,
            ease: "power1.out",
          },
        }),
        // markers: true,
        onUpdate(self) {
          const p = self.progress; // 0..1 across the ENTIRE pinned range

          // Rotation mapped to full [0..1] range → complete all rotations before release
          const rotationOffset = p * spinsFinal * Math.PI * 2;

          // Radius ramp in first ~25% of pinned progress (from centered to large)
          const rRamp = gsap.utils.clamp(0, 1, p / 0.25);
          const R = gsap.utils.interpolate(R0(), R1(), rRamp);

          cardsRef.current.forEach((el, i) => {
            const base = (i / N) * Math.PI * 2;
            const theta = base + rotationOffset + FRONT;

            const x = Math.cos(theta) * R;
            const y = Math.sin(theta) * R;

            const d = angleDist(theta, FRONT); // 0(front)..π(back)
            const t = d / Math.PI;
            const isFront = d < 0.22;

            const opacity = gsap.utils.clamp(0.2, 1, 1 - t * 0.75);
            const scale = gsap.utils.clamp(0.7, 1.18, 1.18 - t * 0.38);
            const rotY = isFront ? 0 : t * 60;
            const blur = isFront ? 0 : Math.min(8, t * 8);
            const zIndex = isFront ? 300 : Math.max(1, 120 - Math.round(t * 100));

            gsap.set(el, {
              x,
              y,
              opacity,
              scale,
              rotateY: rotY,
              filter: `blur(${blur}px)`,
              zIndex,
            });
          });
        },
      });

      // Keep geometry fresh on layout changes
      const handleRefresh = () => {
        // Using R0/R1 live in onUpdate; no state needed here.
      };
      ScrollTrigger.addEventListener("refreshInit", handleRefresh);

      // Kick a refresh after mount
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", handleRefresh);
        st.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [cards.length, pinLength, pixelsPerFront, snapToFront, spins]);

  return (
    <section className="bg-black text-white">
      {/* Pre content so you can reach the pin */}
      <div className="h-[120vh] grid place-items-center bg-neutral-950/60">
        <p className="opacity-70">Scroll down</p>
      </div>

      {/* Sticky stage (full viewport). Orbit center O is bottom-center. */}
      <div
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-neutral-900"
        style={{ perspective: 1000 }}
      >
        <div ref={anchorRef} className="absolute left-1/2 bottom-0 -translate-x-1/2">
          {cards.map((c, i) => (
            <div
              key={c.id}
              ref={setCardRef(i)}
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform-gpu"
              style={{
                width: "min(22vmin, 240px)",
                height: "min(22vmin, 240px)",
                background: c.bg ?? "#111827",
                display: "grid",
                placeItems: "center",
              }}
            >
              {c.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.src}
                  alt={c.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="px-3 text-sm font-semibold opacity-80">{c.title}</span>
              )}
            </div>
          ))}
        </div>

        {/* helper UI */}
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 text-center">
          <p className="text-sm opacity-70">Scroll to orbit</p>
          <div className="animate-bounce">⬇️</div>
        </div>
      </div>

      {/* Post content so you can confirm scroll is gated until rotation completes */}
      <div className="h-[160vh] grid place-items-center bg-neutral-950/60">
        <p className="opacity-70">…and continue</p>
      </div>
    </section>
  );
}
