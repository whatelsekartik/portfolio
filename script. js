gsap.registerPlugin(ScrollTrigger);

// 1. HEAD FOLLOWS MOUSE
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 25;
    const y = (e.clientY / window.innerHeight - 0.5) * 25;
    gsap.to("#head", { x: x, y: y, duration: 0.6, ease: "power2.out" });
});

// 2. SCROLL MASTER TIMELINE
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
    }
});

// Scene 1 -> 2: Move to Left for About Section
mainTl.to("#character-container", {
    left: "20%",
    scale: 0.8,
    duration: 2
})

// Scene 2 -> 3: The Desk Transition
.to("#desk-setup", { opacity: 1, duration: 0.5 })
.to("#monitor-glow", { 
    opacity: 0.5, 
    onStart: () => document.getElementById('monitor-glow').classList.add('glow-active'),
    onReverseComplete: () => document.getElementById('monitor-glow').classList.remove('glow-active'),
    duration: 0.5 
}, "<")
// Morph legs into sitting position
.to("#legs", { attr: { d: "M30,85 L50,70 L70,85" }, duration: 1 }, "<")
.to("#character-container", { left: "75%", duration: 2 })

// Scene 3 -> 4: Stand back up for Journey
.to("#desk-setup", { opacity: 0, duration: 0.5 })
.to("#monitor-glow", { opacity: 0, duration: 0.5 }, "<")
.to("#legs", { attr: { d: "M40,95 L50,70 L60,95" }, duration: 1 })
.to("#character-container", { left: "50%", scale: 1.2, duration: 2 });
