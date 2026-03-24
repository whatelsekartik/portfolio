document.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap || !window.ScrollTrigger) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const cursorOrb = document.querySelector('.cursor-orb');
    const head = document.getElementById('head-group');
    const leftEye = document.getElementById('eye-l');
    const rightEye = document.getElementById('eye-r');
    const leftEyeWhite = document.getElementById('eye-l-white');
    const rightEyeWhite = document.getElementById('eye-r-white');
    const brows = [document.getElementById('brow-l'), document.getElementById('brow-r')];
    const character = document.getElementById('character-container');
    const deskSetup = document.getElementById('desk-setup');
    const screen = document.querySelector('#desk-setup .screen');

    gsap.set(character, { xPercent: -50, yPercent: -50 });

    window.addEventListener('mousemove', (event) => {
        gsap.to(cursorOrb, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.18,
            ease: 'power2.out'
        });

        const xOffset = (event.clientX / window.innerWidth - 0.5) * 14;
        const yOffset = (event.clientY / window.innerHeight - 0.5) * 10;

        gsap.to(head, {
            x: xOffset,
            y: yOffset,
            duration: 0.35,
            ease: 'power2.out'
        });

        gsap.to([leftEye, rightEye], {
            x: xOffset * 0.25,
            y: yOffset * 0.25,
            duration: 0.25,
            ease: 'power2.out'
        });
    });

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(character, { y: -14, duration: 1.8, ease: 'sine.inOut' })
        .to('#torso', { scaleY: 1.02, transformOrigin: '50% 50%', duration: 1.8, ease: 'sine.inOut' }, 0)
        .to('#arm-l', { attr: { d: 'M130 324 Q92 268 88 204' }, duration: 1.8, ease: 'sine.inOut' }, 0)
        .to('#arm-r', { attr: { d: 'M210 324 Q246 282 250 232' }, duration: 1.8, ease: 'sine.inOut' }, 0);

    gsap.timeline({ repeat: -1, repeatDelay: 2.3 })
        .to([leftEyeWhite, rightEyeWhite, leftEye, rightEye], {
            scaleY: 0.08,
            transformOrigin: 'center center',
            duration: 0.08,
            ease: 'power1.inOut'
        })
        .to([leftEyeWhite, rightEyeWhite, leftEye, rightEye], {
            scaleY: 1,
            duration: 0.12,
            ease: 'power1.inOut'
        });

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(brows, { y: -2, duration: 1.1, ease: 'sine.inOut' })
        .to('#mouth-line', { attr: { d: 'M142 198 Q170 208 198 198' }, duration: 1.1, ease: 'sine.inOut' }, 0);

    gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 82%'
            }
        });
    });

    const sceneTl = gsap.timeline({
        scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        }
    });

    sceneTl
        .to('#character-container', { left: '50%', top: '50%', scale: 1.05, duration: 1 })
        .to('#character-container', { left: '28%', top: '54%', scale: 0.96, duration: 1.2 })
        .to(deskSetup, { opacity: 1, duration: 0.5 }, '<')
        .to('#arm-l', { attr: { d: 'M132 324 Q152 286 194 240' }, duration: 0.7 }, '<')
        .to('#arm-r', { attr: { d: 'M210 324 Q248 288 252 230' }, duration: 0.7 }, '<')
        .to('#character-container', { left: '39%', top: '55%', scale: 0.92, duration: 1.2 })
        .to(screen, { attr: { width: 96, height: 64 }, duration: 0.4 }, '<')
        .to('#character-container', { left: '22%', top: '57%', scale: 0.86, duration: 1 })
        .to(deskSetup, { opacity: 0, duration: 0.4 })
        .to('#character-container', { left: '50%', top: '50%', scale: 1.06, duration: 1.2 })
        .to('#head-group', { scale: 1.12, transformOrigin: '50% 50%', duration: 0.8 }, '<')
        .to('#head-group', { scale: 1, duration: 0.8 });
});
