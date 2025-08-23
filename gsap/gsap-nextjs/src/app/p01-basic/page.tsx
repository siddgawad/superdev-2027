"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// IMPORTANT: register the React plugin
gsap.registerPlugin(useGSAP);

export default function P01Basic() {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.fromTo(
      boxRef.current,
      { x: -600, opacity: 0 },
      { x: 0, opacity: 1, duration: 5, ease: "power3.out" }
    );
  }, []);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div
        ref={boxRef}
        className="w-28 h-28 rounded-lg bg-indigo-500 shadow-xl"
      />
    </main>
  );
}
