import Link from "next/link";

export default function Home() {
  const labs = [
    "p01-basic","p02-timeline","p03-easing","p04-pin","p05-progress",
    "p06-motionpath","p07-cycle","p08-sticky-orbit","p09-lenis","p10-spin-carousel",
  ];
  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">GSAP Lab</h1>
      <ul className="space-y-2">
        {labs.map((p) => (
          <li key={p}>
            <Link className="text-blue-600 underline" href={`/${p}`}>
              {p}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
