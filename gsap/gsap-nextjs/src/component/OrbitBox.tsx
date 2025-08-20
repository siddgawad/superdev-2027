"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function OrbitBox() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapRef.current) return;

    // TIP: In a real app, init Lenis once at the app root.
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const r = 1000;
      const dot = wrapRef.current!.querySelector(".dot") as HTMLDivElement;

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top center",
        end: "bottom center",
        pin: true,
        scrub: 0.5,
        onUpdate(self) {
          const theta = self.progress * Math.PI * 2; // 0→2π
          gsap.set(dot, {
            x: Math.cos(theta) * r,
            y: Math.sin(theta) * r,
          });
        },
      });
    }, wrapRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-white">
      <div className="h-screen grid sticky place-items-center bg-gray-900">Scroll down</div>

      <div
        ref={wrapRef}
        className="relative h-screen grid place-items-center bg-gray-900"
        style={{ perspective: 1000 }}
      >
        <div className="absolute w-2 h-2 bg-white rounded-full" />
        <div className="dot absolute w-16 h-16 rounded-full bg-pink-500 will-change-transform" />
      </div>

      <div className="h-screen grid place-items-center bg-gray-800">End</div>
    </section>
  );
}
