/**
 * ==========================================================================
 * DIGITAL CANDLES & BIRTHDAY RITUAL ENGINE
 * Web Audio API Microphone Physics + Smoke Engine + Cinematic Blackout
 * Created for Lishy ❤️ | The Cipher Stack (@the.cipher.stack)
 * ==========================================================================
 */

(function () {
    'use strict';

    // State
    let audioCtx = null;
    let micStream = null;
    let analyser = null;
    let dataArray = null;
    let isListening = false;
    let isBlownOut = false;
    let animFrameId = null;
    let blowStreak = 0;

    // Elements
    let modalBackdrop;
    let blackoutCurtain;
    let wishModal;
    let smokeCanvas, smokeCtx;
    let confettiCanvas, confettiCtx;
    let flames = [];
    let micMeterFill;
    let micMeterWrapper;
    let micToggleBtn;

    // Particle storage
    const smokeParticles = [];
    const confettiParticles = [];

    // Audio Synthesizer (Pure Web Audio API - Zero External Dependencies)
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Breath / Air Puff Sound
    function playPuffSound() {
        try {
            const ctx = getAudioContext();
            const duration = 0.35;
            const bufferSize = ctx.sampleRate * duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(350, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            whiteNoise.start();
        } catch (e) {
            console.warn('Audio puff not supported:', e);
        }
    }

    // Magical Crystal Celebration Chimes Arpeggio
    function playCelebrationChimes() {
        try {
            const ctx = getAudioContext();
            // Pentatonic crystal bells: C5, E5, G5, B5, C6, E6, G6, C7
            const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98, 2093.00];

            freqs.forEach((freq, index) => {
                setTimeout(() => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);

                    // Add subtle overtone shimmer
                    const overtone = ctx.createOscillator();
                    const overtoneGain = ctx.createGain();
                    overtone.type = 'triangle';
                    overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime);
                    overtoneGain.gain.setValueAtTime(0.04, ctx.currentTime);
                    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
                    overtone.connect(overtoneGain);
                    overtoneGain.connect(ctx.destination);

                    gain.gain.setValueAtTime(0.22, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start();
                    overtone.start();
                    osc.stop(ctx.currentTime + 2.2);
                    overtone.stop(ctx.currentTime + 1.2);
                }, index * 95);
            });
        } catch (e) {
            console.warn('Audio chimes not supported:', e);
        }
    }

    // Initialize UI and DOM
    function init() {
        setupDOM();
        setupEvents();
        setupCanvases();
    }

    function setupDOM() {
        // Quick trigger pill in top-right
        const triggerPill = document.createElement('div');
        triggerPill.className = 'ritual-trigger-pill';
        triggerPill.id = 'ritualTriggerPill';
        triggerPill.innerHTML = `
            <span class="pill-sparkle">✨</span>
            <span>Make a Wish, Lishy 🎂</span>
        `;
        document.body.appendChild(triggerPill);

        // Blackout curtain
        blackoutCurtain = document.createElement('div');
        blackoutCurtain.className = 'blackout-curtain';
        blackoutCurtain.id = 'blackoutCurtain';
        document.body.appendChild(blackoutCurtain);

        // Confetti canvas
        confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confettiCanvas';
        document.body.appendChild(confettiCanvas);
        confettiCtx = confettiCanvas.getContext('2d');

        // Cake Modal Backdrop
        modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'cake-modal-backdrop';
        modalBackdrop.id = 'cakeModalBackdrop';
        modalBackdrop.innerHTML = `
            <button class="modal-close-btn" id="modalCloseBtn" title="Close">&times;</button>
            <div class="ritual-header">
                <div class="ritual-subtitle">// SPECIAL BIRTHDAY RITUAL</div>
                <h1 class="ritual-title">Make a Wish, Lishy ✨</h1>
                <p class="ritual-instructions">
                    Blow into your microphone or tap the candles 🎂
                </p>
                <div class="control-pill-group">
                    <button class="mic-toggle-btn" id="micToggleBtn">
                        <span>🎙️ Enable Mic to Blow</span>
                    </button>
                    <div class="mic-meter-wrapper" id="micMeterWrapper">
                        <div class="mic-meter-fill" id="micMeterFill"></div>
                    </div>
                    <button class="tap-blow-btn" id="tapBlowBtn">
                        <span>💨 Tap to Blow</span>
                    </button>
                </div>
            </div>

            <div class="cake-stage" id="cakeStage">
                <canvas id="smokeCanvas"></canvas>
                <div class="candles-row">
                    <div class="candle-unit" data-index="0">
                        <div class="flame-box" id="flame0">
                            <div class="flame-glow"></div>
                            <div class="flame-body">
                                <div class="flame-inner-core"></div>
                            </div>
                        </div>
                        <div class="candle-wick"></div>
                        <div class="candle-stick"></div>
                    </div>
                    <div class="candle-unit" data-index="1">
                        <div class="flame-box" id="flame1">
                            <div class="flame-glow"></div>
                            <div class="flame-body">
                                <div class="flame-inner-core"></div>
                            </div>
                        </div>
                        <div class="candle-wick"></div>
                        <div class="candle-stick"></div>
                    </div>
                    <div class="candle-unit" data-index="2">
                        <div class="flame-box" id="flame2">
                            <div class="flame-glow"></div>
                            <div class="flame-body">
                                <div class="flame-inner-core"></div>
                            </div>
                        </div>
                        <div class="candle-wick"></div>
                        <div class="candle-stick"></div>
                    </div>
                </div>

                <div class="cake-structure">
                    <div class="cake-tier-top">
                        <div class="frosting-drips"></div>
                        <div class="cake-decor-hearts"><span>★</span><span>♥</span><span>★</span><span>♥</span></div>
                    </div>
                    <div class="cake-tier-bottom">
                        <div class="frosting-drips"></div>
                        <div class="cake-decor-hearts"><span>♥</span><span>★</span><span>♥</span><span>★</span><span>♥</span></div>
                    </div>
                    <div class="cake-plate"></div>
                </div>

                <div class="cake-tap-hint">✨ Tip: Blow softly into your microphone or tap the cake!</div>
            </div>
        `;
        document.body.appendChild(modalBackdrop);

        // Wish Granted Modal
        wishModal = document.createElement('div');
        wishModal.className = 'wish-reveal-backdrop';
        wishModal.id = 'wishRevealBackdrop';
        wishModal.innerHTML = `
            <div class="wish-card">
                <div class="wish-crown-icon">👑</div>
                <div class="wish-badge">✨ BIRTHDAY WISH GRANTED ✨</div>
                <h1 class="wish-headline">A Lifetime With You, Lishy ❤️</h1>
                <p class="wish-message">
                    "May every beautiful dream in your heart unfold this year.
                    In a world of billions, loving you is my greatest honor.
                    Through every single day, hour, and season ahead—my whole heart is forever yours."
                </p>
                <div class="wish-signature-block">
                    <span class="wish-sign-lead">With all my love & heart,</span>
                    <span class="wish-sign-author">Me</span>
                    <a href="https://www.instagram.com/the.cipher.stack/" target="_blank" class="wish-sign-ig">
                        @the.cipher.stack ↗
                    </a>
                </div>
                <div class="wish-btn-row">
                    <button class="wish-action-btn secondary" id="reliveWishBtn">🎂 Make Another Wish</button>
                    <button class="wish-action-btn primary" id="closeWishModalBtn">🌸 Return to Our Garden</button>
                </div>
            </div>
        `;
        document.body.appendChild(wishModal);

        // Cache elements
        smokeCanvas = document.getElementById('smokeCanvas');
        smokeCtx = smokeCanvas.getContext('2d');
        flames = [
            document.getElementById('flame0'),
            document.getElementById('flame1'),
            document.getElementById('flame2')
        ];
        micMeterFill = document.getElementById('micMeterFill');
        micMeterWrapper = document.getElementById('micMeterWrapper');
        micToggleBtn = document.getElementById('micToggleBtn');
    }

    function setupCanvases() {
        function resize() {
            if (confettiCanvas) {
                confettiCanvas.width = window.innerWidth;
                confettiCanvas.height = window.innerHeight;
            }
            if (smokeCanvas) {
                smokeCanvas.width = 360;
                smokeCanvas.height = 220;
            }
        }
        window.addEventListener('resize', resize);
        resize();
    }

    function setupEvents() {
        document.getElementById('ritualTriggerPill').addEventListener('click', openCakeModal);
        document.getElementById('modalCloseBtn').addEventListener('click', closeCakeModal);
        document.getElementById('tapBlowBtn').addEventListener('click', triggerBlowOut);
        document.getElementById('cakeStage').addEventListener('click', (e) => {
            // If clicking anywhere on cake and not blown out yet
            if (!isBlownOut) {
                triggerBlowOut();
            }
        });
        document.getElementById('micToggleBtn').addEventListener('click', toggleMicrophone);
        document.getElementById('reliveWishBtn').addEventListener('click', resetCandles);
        document.getElementById('closeWishModalBtn').addEventListener('click', () => {
            wishModal.classList.remove('active');
            closeCakeModal();
        });
    }

    function openCakeModal() {
        modalBackdrop.classList.add('active');
        getAudioContext();
        resetCandlesState();
        startSmokeEngine();
    }

    function closeCakeModal() {
        modalBackdrop.classList.remove('active');
        stopMicrophone();
    }

    function resetCandles() {
        wishModal.classList.remove('active');
        resetCandlesState();
    }

    function resetCandlesState() {
        isBlownOut = false;
        blowStreak = 0;
        flames.forEach(f => {
            if (f) {
                f.classList.remove('extinguished');
                f.style.transform = '';
            }
        });
        smokeParticles.length = 0;
        if (smokeCtx) {
            smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        }
    }

    // Microphone audio analysis for real-time wind/blow detection
    async function toggleMicrophone() {
        if (isListening) {
            stopMicrophone();
            return;
        }

        try {
            getAudioContext();
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            const source = audioCtx.createMediaStreamSource(micStream);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.2;
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            isListening = true;
            micToggleBtn.classList.add('listening');
            micToggleBtn.innerHTML = `<span>🎙️ Listening for your blow...</span>`;
            micMeterWrapper.classList.add('visible');

            monitorBlow();
        } catch (err) {
            console.warn('Microphone permission denied or not available:', err);
            micToggleBtn.innerHTML = `<span>⚠️ Mic unavailable (Use Tap)</span>`;
            setTimeout(() => {
                micToggleBtn.innerHTML = `<span>🎙️ Enable Mic to Blow</span>`;
            }, 3000);
        }
    }

    function stopMicrophone() {
        if (micStream) {
            micStream.getTracks().forEach(t => t.stop());
            micStream = null;
        }
        isListening = false;
        if (micToggleBtn) {
            micToggleBtn.classList.remove('listening');
            micToggleBtn.innerHTML = `<span>🎙️ Enable Mic to Blow</span>`;
        }
        if (micMeterWrapper) {
            micMeterWrapper.classList.remove('visible');
        }
    }

    function monitorBlow() {
        if (!isListening || isBlownOut) return;

        analyser.getByteFrequencyData(dataArray);

        // Low frequencies (bins 0 to 12 correspond to turbulent breath sound below 500Hz)
        let lowFreqSum = 0;
        const lowBins = 14;
        for (let i = 0; i < lowBins; i++) {
            lowFreqSum += dataArray[i];
        }
        const lowAvg = lowFreqSum / lowBins;

        // Overall RMS / Volume
        let totalSum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            totalSum += dataArray[i];
        }
        const overallAvg = totalSum / dataArray.length;

        // Blow detection metric
        const blowMetric = (lowAvg * 0.7) + (overallAvg * 0.3);

        // Update meter fill (scale 0 to 100)
        const meterPercent = Math.min(100, Math.max(0, (blowMetric - 20) * 1.8));
        if (micMeterFill) {
            micMeterFill.style.width = meterPercent + '%';
        }

        // Flame dynamic reactive physics based on air breath
        if (blowMetric > 30) {
            const intensity = Math.min(1, (blowMetric - 30) / 60);
            const leanAngle = (intensity * 45) * (Math.random() > 0.5 ? 1 : 0.85);
            const scaleX = 1 - (intensity * 0.4);
            const scaleY = 1 - (intensity * 0.5);

            flames.forEach((flame, idx) => {
                if (flame) {
                    const jitter = (Math.random() - 0.5) * 8 * intensity;
                    flame.style.transform = `translateX(-50%) rotate(${leanAngle + jitter}deg) skewX(${leanAngle * 0.6}deg) scale(${scaleX}, ${scaleY})`;
                }
            });

            // Sustained blow counter
            if (blowMetric > 55) {
                blowStreak++;
                if (blowStreak >= 8) { // ~350-450ms of sustained blow
                    triggerBlowOut();
                    return;
                }
            } else {
                blowStreak = Math.max(0, blowStreak - 1);
            }
        } else {
            blowStreak = 0;
            flames.forEach(flame => {
                if (flame) flame.style.transform = '';
            });
        }

        requestAnimationFrame(monitorBlow);
    }

    // Trigger the Grand Blowout Ritual
    function triggerBlowOut() {
        if (isBlownOut) return;
        isBlownOut = true;

        stopMicrophone();

        // 1. Audio puff & flames extinguished
        playPuffSound();
        flames.forEach(f => {
            if (f) f.classList.add('extinguished');
        });

        // 2. Spawn curling candle smoke
        spawnSmokeBurst();

        // 3. 600ms pause, then Screen Plunges into 100% Complete Darkness for 1.2s!
        setTimeout(() => {
            blackoutCurtain.classList.add('blackout-active');

            // While in darkness, prepare the explosion
            setTimeout(() => {
                // 4. BOOM! Blackout lifts, chime resonates, synchronized gold & pink fireworks + confetti!
                blackoutCurtain.classList.remove('blackout-active');
                modalBackdrop.classList.remove('active');

                playCelebrationChimes();
                launchSynchronizedFireworks();
                launchConfettiStorm();

                // 5. Grand reveal modal emerges
                setTimeout(() => {
                    wishModal.classList.add('active');
                }, 800);

            }, 1200); // 1.2 seconds of dramatic darkness
        }, 600);
    }

    // Candle Smoke Particle Physics
    function spawnSmokeBurst() {
        // 3 candle wick centers mapped to the smokeCanvas coordinates
        const wickXCoords = [118, 180, 242];
        const wickY = 175;

        wickXCoords.forEach(x => {
            for (let i = 0; i < 35; i++) {
                smokeParticles.push({
                    x: x + (Math.random() - 0.5) * 4,
                    y: wickY,
                    vx: (Math.random() - 0.5) * 1.6,
                    vy: -(Math.random() * 2.2 + 1.2),
                    radius: Math.random() * 3 + 2,
                    maxRadius: Math.random() * 18 + 14,
                    alpha: 0.75,
                    fade: Math.random() * 0.015 + 0.008,
                    curl: (Math.random() - 0.5) * 0.06,
                    curlAngle: Math.random() * Math.PI * 2
                });
            }
        });
    }

    function startSmokeEngine() {
        if (animFrameId) return;

        function loop() {
            if (smokeCtx && smokeCanvas) {
                smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

                for (let i = smokeParticles.length - 1; i >= 0; i--) {
                    const p = smokeParticles[i];
                    p.curlAngle += p.curl;
                    p.x += p.vx + Math.sin(p.curlAngle) * 0.9;
                    p.y += p.vy;
                    p.radius += (p.maxRadius - p.radius) * 0.035;
                    p.alpha -= p.fade;

                    if (p.alpha <= 0 || p.y < 0) {
                        smokeParticles.splice(i, 1);
                        continue;
                    }

                    smokeCtx.save();
                    smokeCtx.globalAlpha = Math.max(0, p.alpha);
                    smokeCtx.beginPath();
                    smokeCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    smokeCtx.fillStyle = 'rgba(235, 235, 240, 0.85)';
                    smokeCtx.shadowColor = 'rgba(255, 255, 255, 0.4)';
                    smokeCtx.shadowBlur = 8;
                    smokeCtx.fill();
                    smokeCtx.restore();
                }
            }
            animFrameId = requestAnimationFrame(loop);
        }
        loop();
    }

    // Gold & Pink Synchronized Fireworks
    function launchSynchronizedFireworks() {
        if (typeof window.launchCustomFirework === 'function') {
            const colors = [
                'hsl(45, 100%, 65%)',  // Radiant Gold
                'hsl(335, 100%, 70%)', // Rose Pink
                'hsl(350, 100%, 75%)', // Magenta Blossom
                'hsl(50, 100%, 75%)',  // Champagne Gold
                'hsl(320, 100%, 80%)'  // Soft Lavender Pink
            ];

            for (let i = 0; i < 18; i++) {
                setTimeout(() => {
                    const x = (window.innerWidth * 0.15) + (Math.random() * window.innerWidth * 0.7);
                    const color = colors[i % colors.length];
                    window.launchCustomFirework(x, color);
                }, i * 160);
            }
        }
    }

    // Confetti Storm
    function launchConfettiStorm() {
        const colors = ['#ffd700', '#ff6584', '#ff85a2', '#ffffff', '#f7b731', '#ff4b72'];
        confettiParticles.length = 0;

        for (let i = 0; i < 160; i++) {
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: -20 - Math.random() * 200,
                size: Math.random() * 9 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 2.5,
                rot: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 6,
                shape: Math.random() > 0.4 ? 'heart' : 'rect',
                alpha: 1
            });
        }

        function renderConfetti() {
            if (!confettiCtx) return;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

            let activeCount = 0;
            for (let i = 0; i < confettiParticles.length; i++) {
                const c = confettiParticles[i];
                c.x += c.vx;
                c.y += c.vy;
                c.rot += c.vRot;

                if (c.y > confettiCanvas.height) {
                    continue;
                }
                activeCount++;

                confettiCtx.save();
                confettiCtx.translate(c.x, c.y);
                confettiCtx.rotate((c.rot * Math.PI) / 180);
                confettiCtx.fillStyle = c.color;
                confettiCtx.globalAlpha = c.alpha;

                if (c.shape === 'heart') {
                    // Draw mini heart
                    const s = c.size * 0.6;
                    confettiCtx.beginPath();
                    confettiCtx.moveTo(0, s * 0.3);
                    confettiCtx.bezierCurveTo(-s, -s * 0.5, -s * 1.5, s * 0.4, 0, s * 1.4);
                    confettiCtx.bezierCurveTo(s * 1.5, s * 0.4, s, -s * 0.5, 0, s * 0.3);
                    confettiCtx.fill();
                } else {
                    confettiCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
                }

                confettiCtx.restore();
            }

            if (activeCount > 0 && wishModal.classList.contains('active')) {
                requestAnimationFrame(renderConfetti);
            } else {
                confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }

        renderConfetti();
    }

    // Expose openCakeModal globally for external triggers
    window.openCakeModal = openCakeModal;

    // Run on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
