document.addEventListener('DOMContentLoaded', function() {
    gsap.to("h1", { x: 500, ease: "linear" });        // Constant speed
    gsap.to("h2", { x: 500, ease: "power2.in" });     // Slow start, fast end
    gsap.to("h3", { x: 500, ease: "power2.inOut" });  // Slow-fast-slow
    gsap.to("h4", { x: 500, ease: "bounce.out" });    // Bouncy landing
    gsap.to("h5", { x: 500, ease: "elastic.out" });   // Springy effect
});