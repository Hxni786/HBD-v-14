/**
 * ==========================================================================
 * ROMANCE ENHANCEMENTS ENGINE
 * Audio Player + Stardust Trail Cursor + "Reasons I Love You" Love Capsules
 * Crafted for Lishy ❤️ | The Cipher Stack (@the.cipher.stack)
 * ==========================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. REASONS WHY I LOVE YOU (Personalized for Lishy)
    // --------------------------------------------------------------------------
    const reasonsForLishy = [
        "Because on May 13 at 6:13 PM, my whole universe quietly changed forever.",
        "Because your smile is the sweetest medicine to my hardest days.",
        "The way you look at me and make me feel completely at peace.",
        "Because in a world of billions of people, you are my favorite person.",
        "The kindness and gentleness you carry in your beautiful heart.",
        "Because every laugh we share becomes my new favorite memory.",
        "The way you make the simplest moments feel like pure magic.",
        "Because you are not just my love—you are my Queen, my partner, and my home.",
        "The gentle warmth of your hand when you hold mine.",
        "Because loving you is the easiest, most natural thing I have ever done.",
        "How you support my dreams and believe in me even when I doubt myself.",
        "The sparkle in your eyes when you get excited about little things.",
        "Because no matter how chaotic the world gets, you are my calm.",
        "The sweet way you say my name that always makes my heart skip a beat.",
        "Because my heart was built to protect, honor, and cherish yours forever.",
        "How incredibly smart, thoughtful, and wonderfully unique you are.",
        "Because you make me want to become the greatest version of myself every day.",
        "The late-night conversations where hours pass like seconds.",
        "Because every love song finally makes sense whenever I look at you.",
        "The way you light up any room simply by being in it.",
        "Because every single second spent with you is a gift I never take for granted.",
        "How safe and understood I feel whenever I am with you.",
        "Because you chose me, and I will choose you every single day of my life.",
        "Your beautiful, radiant soul that shines brighter than any star in the sky.",
        "Because my favorite place in this entire world is right beside you, Lishy."
    ];

    let openedReasonsCount = 0;
    let availableReasons = [...reasonsForLishy];

    // --------------------------------------------------------------------------
    // 2. DOM INITIALIZATION
    // --------------------------------------------------------------------------
    function init() {
        createMusicPlayer();
        createStardustCursor();
        createCapsuleModal();
    }

    // --------------------------------------------------------------------------
    // 3. BACKGROUND MUSIC PLAYER CONTROLLER
    // --------------------------------------------------------------------------
    function createMusicPlayer() {
        // Audio element
        const audio = new Audio('music.mp3');
        audio.loop = true;
        audio.preload = 'auto';

        // Floating player UI in bottom-left
        const playerPill = document.createElement('div');
        playerPill.className = 'music-player-pill';
        playerPill.id = 'musicPlayerPill';
        playerPill.title = 'Click to Play / Pause Music';
        playerPill.innerHTML = `
            <div class="player-disc" id="playerDisc">
                <span class="disc-center-heart">❤️</span>
            </div>
            <div class="player-details">
                <span class="player-song-title">
                    <span>I Love You Too Much</span>
                </span>
                <span class="player-subtitle">For Lishy • Me</span>
            </div>
            <div class="equalizer-bars" id="equalizerBars">
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
            </div>
            <button class="player-toggle-btn" id="playerToggleBtn" aria-label="Toggle music">
                ▶
            </button>
        `;
        document.body.appendChild(playerPill);

        const disc = document.getElementById('playerDisc');
        const eq = document.getElementById('equalizerBars');
        const toggleBtn = document.getElementById('playerToggleBtn');

        let isPlaying = false;

        function setPlayingState(playing) {
            isPlaying = playing;
            if (playing) {
                audio.play().then(() => {
                    disc.classList.add('spinning');
                    eq.classList.add('playing');
                    toggleBtn.innerHTML = '❚❚';
                }).catch(err => {
                    console.log('Autoplay waiting for user gesture:', err);
                });
            } else {
                audio.pause();
                disc.classList.remove('spinning');
                eq.classList.remove('playing');
                toggleBtn.innerHTML = '▶';
            }
        }

        playerPill.addEventListener('click', () => {
            setPlayingState(!isPlaying);
        });

        // Autoplay on first tap or click anywhere on page
        const startAudioOnFirstInteraction = () => {
            if (!isPlaying) {
                setPlayingState(true);
            }
            window.removeEventListener('click', startAudioOnFirstInteraction);
            window.removeEventListener('touchstart', startAudioOnFirstInteraction);
        };

        window.addEventListener('click', startAudioOnFirstInteraction, { once: true });
        window.addEventListener('touchstart', startAudioOnFirstInteraction, { once: true });
    }

    // --------------------------------------------------------------------------
    // 4. STARDUST & SPARKLER TRAIL CURSOR
    // --------------------------------------------------------------------------
    function createStardustCursor() {
        const canvas = document.createElement('canvas');
        canvas.id = 'stardustCanvas';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        const colors = [
            'rgba(255, 215, 0, ',    // Gold
            'rgba(255, 105, 180, ',  // Hot Pink
            'rgba(255, 182, 193, ',  // Light Rose
            'rgba(255, 255, 255, '   // Starlight White
        ];

        function spawnStardust(x, y) {
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 6,
                    y: y + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: Math.random() * 1.5 + 0.6,
                    size: Math.random() * 3 + 1.5,
                    colorPrefix: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 1,
                    fade: Math.random() * 0.03 + 0.02,
                    isHeart: Math.random() > 0.8
                });
            }
        }

        window.addEventListener('mousemove', (e) => {
            spawnStardust(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                spawnStardust(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.fade;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.colorPrefix + p.alpha + ')';

                if (p.isHeart) {
                    // Mini floating heart
                    const s = p.size * 1.4;
                    ctx.beginPath();
                    ctx.arc(p.x - s / 2, p.y - s / 2, s / 2, Math.PI, 0, false);
                    ctx.arc(p.x + s / 2, p.y - s / 2, s / 2, Math.PI, 0, false);
                    ctx.lineTo(p.x, p.y + s);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Stardust sparkle circle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.shadowColor = p.colorPrefix + '0.8)';
                    ctx.shadowBlur = 6;
                    ctx.fill();
                }

                ctx.restore();
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    // --------------------------------------------------------------------------
    // 5. "REASONS I LOVE YOU" INTERACTIVE CAPSULE MODAL
    // --------------------------------------------------------------------------
    function createCapsuleModal() {
        // Floating pill in bottom-right
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'capsule-trigger-btn';
        triggerBtn.id = 'capsuleTriggerBtn';
        triggerBtn.innerHTML = `
            <span>💌</span>
            <span>Why I Love You ✨</span>
        `;
        document.body.appendChild(triggerBtn);

        // Modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'capsule-backdrop';
        backdrop.id = 'capsuleBackdrop';
        backdrop.innerHTML = `
            <div class="capsule-card">
                <button class="modal-close-btn" id="capsuleCloseBtn">&times;</button>
                <div class="capsule-tag">// FOR MY QUEEN, LISHY</div>
                <h2 class="capsule-title">Why I Love You ❤️</h2>
                <div class="capsule-note-display">
                    <p class="capsule-note-text" id="capsuleNoteText">
                        "Tap the button below to draw a sweet reason written from my heart to yours..."
                    </p>
                    <span class="capsule-count-badge" id="capsuleCountBadge">Sweet notes unlocked: 0</span>
                </div>
                <div class="capsule-action-row">
                    <button class="capsule-btn primary" id="drawReasonBtn">✨ Pick Another Reason</button>
                    <button class="capsule-btn secondary" id="closeCapsuleActionBtn">🌸 Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);

        const noteText = document.getElementById('capsuleNoteText');
        const countBadge = document.getElementById('capsuleCountBadge');
        const drawBtn = document.getElementById('drawReasonBtn');

        function openModal() {
            backdrop.classList.add('active');
            if (openedReasonsCount === 0) {
                drawReason();
            }
        }

        function closeModal() {
            backdrop.classList.remove('active');
        }

        function drawReason() {
            if (availableReasons.length === 0) {
                availableReasons = [...reasonsForLishy];
            }

            const randIndex = Math.floor(Math.random() * availableReasons.length);
            const reason = availableReasons.splice(randIndex, 1)[0];
            openedReasonsCount++;

            // Fade transition
            noteText.style.opacity = '0';
            setTimeout(() => {
                noteText.textContent = `"${reason}"`;
                noteText.style.opacity = '1';
                countBadge.textContent = `Sweet notes unlocked: ${openedReasonsCount} / ${reasonsForLishy.length} ✨`;
            }, 200);

            // Trigger a mini celebratory star burst
            if (typeof window.launchCustomFirework === 'function') {
                const randColor = Math.random() > 0.5 ? 'hsl(45, 100%, 65%)' : 'hsl(335, 100%, 70%)';
                window.launchCustomFirework(window.innerWidth * (0.3 + Math.random() * 0.4), randColor);
            }
        }

        triggerBtn.addEventListener('click', openModal);
        document.getElementById('capsuleCloseBtn').addEventListener('click', closeModal);
        document.getElementById('closeCapsuleActionBtn').addEventListener('click', closeModal);
        drawBtn.addEventListener('click', drawReason);
    }

    // Run on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
