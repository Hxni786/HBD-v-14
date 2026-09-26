# 💖 HeartBirthday // Interactive  Web Experience

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Canvas API](https://img.shields.io/badge/Canvas_2D-000000?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Instagram](https://img.shields.io/badge/Creator-@the.cipher.stack-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/the.cipher.stack/)

<p align="center">
  A high-fidelity, interactive romantic birthday and anniversary web experience engineered with algorithmic canvas flower blooms, Web Audio API microphone blow physics, real-time elapsed time telemetry, procedural particle systems, and zero-dependency audio synthesis.
</p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technical Architecture](#-technical-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Customization Guide](#-customization-guide)
- [Physics & Audio Engine Details](#-physics--audio-engine-details)
- [Deployment](#-deployment)
- [Browser Compatibility](#-browser-compatibility)
- [License & Credits](#-license--credits)

---

## 🌟 Overview

**HeartBirthday** transforms a personal milestone into a cinematic, tactile digital memory. Built for modern browsers, the application combines mathematical flower garden generation along a heart cardioid with interactive rituals: real-time love clock counters, microphone-driven candle blowouts, procedural smoke and confetti physics, and ambient sound design.

Designed to require **zero external build steps or heavy frameworks**, this project runs directly in vanilla JavaScript, HTML5 Canvas, and modern CSS.

---

## ✨ Key Features

### 1. 🌸 Algorithmic Petal Blooming Engine (`Garden.js`)
- Renders vector-based blooming petals along a parametric heart mathematical curve:
  $$\begin{aligned} x &= 16 \sin^3(t) \\ y &= -(13 \cos(t) - 5 \cos(2t) - 2 \cos(3t) - \cos(4t)) \end{aligned}$$
- Smooth organic color gradients, petal rotations, and radial growth physics rendered at 60 FPS.

### 2. ⏳ Real-Time Relationship Telemetry (`functions.js`)
- High-precision elapsed time counter calculating **Days, Hours, Minutes, and Seconds** from your milestone date.
- Uses millisecond timestamp delta computation with leading-zero formatting and live refresh intervals.

### 3. 🎂 Interactive Microphone Candle Blow-Out (`candles.js`)
- **Web Audio API Breath Detection**: Analyzes real-time low-frequency turbulent audio input from the user's microphone (`AnalyserNode`).
- **Dynamic Flame Physics**: Flame vectors skew, jitter, and lean back proportional to real-time air velocity.
- **Procedural Smoke Simulation**: Extinguished wicks trigger a multi-particle buoyant smoke trail with sinusoidal drift and opacity fade.
- **Dramatic Blackout & Grand Reveal**: Shuts off viewport lighting for 1.2 seconds, followed by an explosion of synchronized gold & pink fireworks and celebratory crystal chimes.
- **Graceful Touch Fallback**: Users without microphone access can simply tap the cake or click the blow button.

### 4. 🎵 Glassmorphism Ambient Audio Player (`romance.js`)
- Minimalist floating audio pill with an animated rotating vinyl disc and 4-bar equalizer dance.
- Plays ambient background music seamlessly with single-tap autoplay policy bypass.

### 5. ✨ Sparkler Stardust Cursor Trail (`romance.js`)
- Follows desktop pointer coordinates and mobile multi-touch movements.
- Spawns floating particles of golden stardust, rose petals, and mini hearts that drift with downward buoyancy and fade.

### 6. 💌 Interactive Note Capsule Drawer (`romance.js`)
- Interactive drawer providing randomized, heartfelt reasons and milestone reminders with celebratory mini sparkle fireworks on each draw.

---

## 🛠️ Technical Architecture

| Layer | Technologies | Description |
|---|---|---|
| **Presentation** | HTML5, CSS3, Google Fonts (`Poppins`, `Pacifico`, `Inter`) | Glassmorphism, layered z-indexing, radial gradients, flex alignment |
| **Canvas Engines** | HTML5 Canvas 2D Context | 4 concurrent canvas layers: Garden, Fireworks, Smoke, and Stardust |
| **Audio Processing** | Web Audio API (`AudioContext`, `AnalyserNode`, `OscillatorNode`) | Real-time FFT spectrum analysis, noise generation, and harmonic chime synthesis |
| **Animation Loop** | `requestAnimationFrame`, CSS Keyframe Transforms | Hardware-accelerated transitions and delta-time particle updates |
| **Dependencies** | jQuery (DOM helper), FontAwesome (Iconography) | Lightweight, zero-build asset pipeline |

---

## 📂 Project Structure

```plaintext
HeartBirthday/
├── css/
│   ├── default.css        # Base layout, typography, terminal, and heart styling
│   ├── candles.css        # 3D cake, flickering flame keyframes, blackout & modal UI
│   └── romance.css        # Floating music player, stardust canvas, and capsule styles
├── js/
│   ├── jquery.js          # Core DOM manipulation library
│   ├── garden.js          # Vector-based bloom and heart growth algorithm
│   ├── functions.js       # Typewriter effect, positioning, and timer calculation
│   ├── candles.js         # Web Audio API mic blow analyzer, smoke engine & ritual modal
│   └── romance.js         # Audio player controller, stardust trail, and capsule drawer
├── img/
│   └── heartbg.png        # Ambient background vignette texture
├── digital.ttf            # Font file for seven-segment digital timer digits
├── music.mp3              # Ambient background soundtrack
├── index.html             # Main application entry point
└── README.md              # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- (Optional) A local HTTP server such as VS Code **Live Server** or Python's built-in server.

### Running Locally

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/your-username/HeartBirthday.git
   cd HeartBirthday
   ```

2. **Serve with a Local Web Server**:
   Microphone features and local audio files require an HTTP/HTTPS context (browser security restrictions block `getUserMedia` on direct `file:///` URLs in some browsers).

   **Using VS Code Live Server**:
   - Right-click `index.html` and select **Open with Live Server**.

   **Using Python**:
   ```bash
   # Python 3.x
   python -m http.server 5500
   ```
   Open `http://localhost:5500` in your browser.

---

## ⚙️ Customization Guide

All configuration points are centralized in clean, easily editable locations:

### 1. Milestone Date & Time
Open [`HeartBirthday-main/index.html`](file:///d:/bd%20v%2015/HeartBirthday-main/index.html) and adjust lines 94–99:
```javascript
var together = new Date();
// Note: Month is 0-indexed (0 = January, 4 = May, 11 = December)
together.setFullYear(2026, 4, 13); // Year, Month, Day
together.setHours(18);             // 24-hour format (18 = 6 PM)
together.setMinutes(13);           // Minutes
together.setSeconds(0);
together.setMilliseconds(0);
```

### 2. Names & Relationship Details
Open [`HeartBirthday-main/index.html`](file:///d:/bd%20v%2015/HeartBirthday-main/index.html):

- **Terminal Code Object** (Lines 30–35):
  ```javascript
  const us = {
      her: "Your Partner's Name",
      me: "Me",
      status: "TogetherForever"
  };
  ```
- **Heart Message Heading** (Line 68):
  ```html
  <div><a href="..." class="together-link">Together for</a> <i class="fa-regular fa-heart"></i></div>
  ```
- **Birthday Card Content** (Lines 71–83):
  ```html
  <div class="box box2">
      <p>Happy Birthday <i class="fa-regular fa-heart"></i></p>
  </div>
  <div class="box box3">
      <p> - <a href="...">Me</a></p>
  </div>
  ```

### 3. Background Music
Replace `music.mp3` in the root directory with your preferred MP3 audio track, keeping the file named `music.mp3`.

### 4. Creator / Social Links
Search for `@the.cipher.stack` across `index.html`, `js/candles.js`, and `js/romance.js` to update social profiles or handles.

---

## 🔬 Physics & Audio Engine Details

### Web Audio Breath Detection Matrix
The microphone engine continuously captures frequency data across 128 FFT bins:
1. **Low Frequency Focus**: Breath turbulence concentrates heavily between 60 Hz and 450 Hz.
2. **RMS Thresholding**: Calculates root-mean-square amplitude to distinguish gentle blowing from ambient background noise.
3. **Sustained Blow Accumulator**: Requires approximately 350ms of sustained turbulent volume to prevent accidental triggers from short spoken words.

### Zero-Dependency Audio Synthesis
The celebratory chime arpeggio is generated entirely on the client side using pure mathematical sine wave oscillators:
- Frequencies: $C_5, E_5, G_5, B_5, C_6, E_6, G_6, C_7$ (523 Hz to 2093 Hz).
- Harmonic overtones generated via parallel triangle wave oscillators with exponential gain decay curves.
- Zero network requests, zero latency, and zero dependency on third-party audio hosting.

---

## 🌐 Deployment

This project contains only static files and can be deployed for free on any platform:

### GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/ (root)`.
4. Click **Save**. Your site will be live on `https://<username>.github.io/<repo>/` with automatic SSL/HTTPS (required for microphone access).

### Vercel / Netlify
1. Drag and drop the project folder directly into the [Netlify Drop](https://app.netlify.com/drop) or Vercel dashboard.
2. Deployment is instant.

---

## 📱 Browser Compatibility

| Browser | Minimum Version | Desktop Support | Mobile Support | Mic Detection |
|---|:---:|:---:|:---:|:---:|
| **Google Chrome** | 66+ | ✅ Full | ✅ Full | ✅ Full |
| **Microsoft Edge** | 79+ | ✅ Full | ✅ Full | ✅ Full |
| **Mozilla Firefox** | 60+ | ✅ Full | ✅ Full | ✅ Full |
| **Apple Safari** | 12+ | ✅ Full | ✅ Full | ✅ (Requires HTTPS) |
| **Mobile Browsers** | Current | ✅ Full | ✅ Full | ✅ Full |

> **Note on Microphone Access**: Mobile browsers require HTTPS to grant microphone permissions. Use GitHub Pages, Netlify, or Vercel for production deployments.

---

## 📄 License & Credits

- **Creator & Architect**: Designed with love by [@the.cipher.stack](https://www.instagram.com/the.cipher.stack/).
- **Original Garden Algorithm**: Based on the open-source Garden.js concept.
- **Icons & Typography**: FontAwesome & Google Fonts.

---

<div align="center">
  <sub>Built with precision & passion by <b>The Cipher Stack</b>.</sub>
</div>
