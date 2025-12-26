<!doctype html>
<html>
<head>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>The Last Verdict — Play</title>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="game-container"></div>
  <style>
    
body {
  background: #111; /* dark bg looks cleaner */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;      /* full screen height */
  margin: 0;
}

#game-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* general overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 20, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.overlay:not(.hidden) {
  opacity: 1;
  pointer-events: all;
}

/* Document container */
.doc {
  background: #fefcf7;
  color: #222;
  font-family: "Times New Roman", serif;
  padding: 2rem;
  border: 2px solid #000;
  border-radius: 12px;
  width: 480px;
  max-width: 90vw;
  max-height: 80vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  overflow-y: auto;
  transform: translateY(30px) scale(0.95);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* Make it pop up smoothly */
.overlay:not(.hidden) .doc {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Ledger Overlay */
#ledger-popup.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 6, 2, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

/* When visible */
#ledger-popup.overlay:not(.hidden) {
  opacity: 1;
  pointer-events: all;
}

/* Ledger Box — torn parchment look */
.ledger-box {
  position: relative;
  background: #fbeec1;
  border: 8px solid #a56b2c;
  width: 520px;
  height: 680px;
  padding: 16px;
  box-shadow:
    0 0 0 8px #d6a55d,
    0 0 0 12px #5a2e0e,
    0 20px 50px rgba(0, 0, 0, 0.6);
  font-family: "Press Start 2P", monospace;
  color: #3a1f0b;
  image-rendering: pixelated;
  transform: translateY(30px) scale(0.95) rotate(-1deg);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
  background-image: 
    linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 100%),
    repeating-linear-gradient(
      0deg,
      #fbeec1,
      #fbeec1 10px,
      #f9e8b8 12px,
      #fbeec1 20px
    );
  clip-path: polygon(
    0% 4%, 4% 0%, 96% 0%, 100% 5%, 100% 96%, 
    97% 100%, 5% 100%, 0% 96%, 0% 4%
  );
}

/* Pop-up animation */
#ledger-popup.overlay:not(.hidden) .ledger-box {
  transform: translateY(0) scale(1) rotate(0deg);
  opacity: 1;
}

/* Add torn edge texture using pseudo-elements */
.ledger-box::before,
.ledger-box::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 20px;
  left: 0;
  background-repeat: repeat-x;
  background-size: 40px 20px;
  opacity: 0.25;
  pointer-events: none;
}

.ledger-box::before {
  top: -10px;
  background-image: radial-gradient(circle at 20px 20px, #5a2e0e 15%, transparent 16%);
}

.ledger-box::after {
  bottom: -10px;
  background-image: radial-gradient(circle at 10px 0, #5a2e0e 15%, transparent 16%);
  transform: rotate(180deg);
}

/* Ledger Title */
.ledger-content h2 {
  font-size: 3rem;
  letter-spacing: 2px;
  color: #3a1f0b;
  background: #f9e5b5;
  border-bottom: 4px solid #a56b2c;
  padding: 10px 0;
  text-align: center;
  margin: 20px 0;
  transform: rotate(-0.5deg);
}

/* Ledger Table — pixel grid look */
#ledger-entries table {
  width: 100%;
  border-collapse: collapse;
  background: #fdf3d6;
}

#ledger-entries th,
#ledger-entries td {
  padding: 14px;
  border: 3px solid #d6a55d;
  text-align: center;
  font-size: 1rem;
}

#ledger-entries tr:nth-child(even) {
  background: #faefcd;
}
#ledger-entries tr:nth-child(odd) {
  background: #f5e3b6;
}

/* Ink colors */
.good {
  color: #1b8f5a;
  text-shadow: 0 0 2px rgba(27, 143, 90, 0.4);
}
.bad {
  color: #a12929;
  text-shadow: 0 0 2px rgba(161, 41, 41, 0.4);
}

/* Close Button */
.close-btn {
  display: inline-block;
  background: #b36a2e;
  border: 4px solid #d6b26a;
  font-family: "Press Start 2P", monospace;
  color: #fff5c3;
  font-size: 0.7rem;
  padding: 8px 18px;
  margin-top: 20px;
  cursor: pointer;
  box-shadow: 0 4px #5a3b16;
  transition: 0.1s ease;
}
.close-btn:hover {
  background: #c78642;
  transform: translateY(2px);
  box-shadow: 0 2px #5a3b16;
}


/* Death Certificate style */
.deathcert-doc {
  background-color: #f8e8b0; 
  border: 6px solid #5a2e0e; 
  border-radius: 0; 
  image-rendering: pixelated;
  width: 420px;
  max-width: 90vw;
  padding: 1.5rem 2rem;
  color: #2b1a07;
  font-family: 'Press Start 2P', monospace; 
  text-align: center;
  box-shadow:
    0 0 0 4px #d19c4a,
    0 0 0 8px #5a2e0e,
    0 15px 40px rgba(0, 0, 0, 0.6);
   transform: translateY(30px) scale(0.95) rotate(-1deg);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* Pop-up animation */
.overlay:not(.hidden) .deathcert-doc {
 transform: translateY(0) scale(1) rotate(0deg);
 opacity: 1;
}

/* Pixel-styled title */
.deathcert-doc h2 {
  font-size: 1rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  color: #3b1e05;
  text-transform: uppercase;
  border-bottom: 2px solid #5a2e0e;
  padding-bottom: 0.3rem;
}

/* Close button with pixel style */
.deathcert-doc .close-btn {
  background: #5a2e0e;
  border: 2px solid #d19c4a;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.6rem;
  padding: 0.5rem 1.2rem;
  margin-top: 1rem;
  color: #f8e8b0;
  box-shadow: 0 3px #2b1a07;
  transition: all 0.2s ease;
}

.deathcert-doc .close-btn:hover {
  background: #7a3b10;
  transform: translateY(2px);
  box-shadow: 0 1px #2b1a07;
}

/* Certificate line strip */
.deathcert-doc .line {
  width: 100%;
  height: 6px;
  background: #5a2e0e;
  margin: 10px 0 20px;
  border-radius: 1px;
  box-shadow:
    inset 0 -1px 0 #d19c4a,
    0 1px 2px rgba(0, 0, 0, 0.2);
  image-rendering: pixelated;
}

/* Certificate text */
.deathcert-doc p {
  font-size: 0.75rem;
  margin: 0;
  text-align: left;
  color: #2b1a07;
  font-family: 'Press Start 2P', monospace;
  letter-spacing: 0.5px;
}

/* Seal & signature area */
.seal-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

/* Seal image */
.seal-img {
  width: 100px;
  height: 100px;
  image-rendering: pixelated;
  border: 3px solid #5a2e0e;
  background: #f8e8b0;
}

.signature {
  font-family: 'Dancing Script', cursive;
  font-size: 1rem;
  color: #3b1e05;
  border-top: 2px solid #5a2e0e;
  padding-top: 1px;
  width: 150px;
  text-align: center;
  margin-top: 1px;
}

/* Stamp area above Seal of Judgement */
.seal-stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stamp-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  opacity: 0.85;
  margin-bottom: 6px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4))
          brightness(0.9)
          contrast(1.2);
  image-rendering: pixelated;
  animation: stampAppear 0.4s ease-out;
}

/* Optional little pop animation */
@keyframes stampAppear {
  0% {
    transform: scale(0.7) rotate(-10deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}


/* Title */
.doc h2 {
  margin-top: 0;
  font-size: 1.3rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

/* Close button */
.close-btn {
  display: block;
  margin: 1rem auto 0;
  background: #111;
  color: #f0f0f0;
  border: none;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.2s;
}
.close-btn:hover {
  background: #333;
}


@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes rise {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}


/* --- Book Of Life Popup --- */
.book-popup {
  display: none;
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  width: 860px;
  height: 650px;
  background: linear-gradient(to right, #fffbea 49.8%, #fffbea 50.2%);
  border: 4px solid #d4b86b;
  border-radius: 12px;
  font-family: 'Pixelify Sans', sans-serif;
  color: #3a2b12;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5),
              inset 0 0 15px rgba(255, 250, 200, 0.2);
  z-index: 100;
  overflow: hidden;
  flex-direction: column;
  perspective: 1000px;
  transition: all 0.3s ease;
}

/* Show animation */
#book-popup.show {
  display: flex;
  animation: fadeIn 0.5s ease-out;
}

/* --- Inner two-page layout --- */
.book-inner {
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Glowing spine */
.book-inner::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background: linear-gradient(to bottom, #b8973e, #e8d27a, #b8973e);
  box-shadow: 0 0 12px 3px rgba(224, 198, 107, 0.8);
  animation: spineGlow 3s ease-in-out infinite alternate;
  z-index: 2;
}

/* --- Left & Right Pages --- */
.left-page, .right-page {
  width: 50%;
  height: 100%;
  padding: 45px 40px;
  position: relative;
  box-sizing: border-box;
  font-family: 'VT323', monospace;
  color: #2f2410;
  overflow-y: auto;
  line-height: 1.5;
  z-index: 1;
}

.left-page {
  background: linear-gradient(135deg, #fff6d9 0%, #f8e8b5 100%);
  box-shadow: inset -4px 0 10px rgba(0, 0, 0, 0.1);
}

.right-page {
  background: linear-gradient(135deg, #fff7db 0%, #f7e4a1 100%);
  box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.1);
}

/* Paper texture overlay */
.left-page::after,
.right-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png');
  opacity: 0.25;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 1;
}

/* Page Content */
.page-content {
  position: relative;
  z-index: 2;
}

.page-content h2 {
  text-align: center;
  font-family: 'UnifrakturCook', cursive;
  font-size: 1.8rem;
  margin-bottom: 16px;
  color: #5e4511;
  text-shadow: 1px 1px #fff2b8, 0 0 6px rgba(255, 245, 190, 0.5);
}

.book-text {
  font-size: 1.05rem;
  margin-bottom: 10px;
  text-align: justify;
}

.book-note {
  text-align: center;
  color: #5a4217;
  font-style: italic;
  font-size: 0.95rem;
  margin-top: 12px;
}

/* --- Controls --- */
.book-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0d790;
  border-top: 3px solid #d1b26d;
  padding: 8px 25px;
  height: 56px;
}

.book-controls button {
  background: #e3d291;
  border: 2px solid #b89a3d;
  padding: 6px 14px;
  border-radius: 8px;
  font-family: 'Pixelify Sans', sans-serif;
  color: #5a4417;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.book-controls button:hover {
  transform: translateY(-2px);
  background: #f8efb0;
}

/* Button styling */ 
#prev-page, 
#next-page { 
position: absolute; 
bottom: 16px; 
background: #e3d291; 
border: 2px solid #b89a3d; 
padding: 6px 14px; 
border-radius: 8px; 
font-family: 'Pixelify Sans', sans-serif; 
color: #5a4417; 
cursor: pointer; 
transition: 0.2s; 
box-shadow: 0 3px 6px rgba(0,0,0,0.3); } 

#prev-page:hover, 
#next-page:hover { 
transform: translateY(-2px);
background: #f8efb0; } 

#close-book { 
position: absolute; 
top: 12px; 
right: 16px; 
background: #e4cf89; 
border: 3px solid #b9953f; 
padding: 7px 14px; 
border-radius: 8px; 
font-family: 'Pixelify Sans', sans-serif; 
font-size: 0.8rem; 
color: #49350f; 
cursor: pointer; 
box-shadow: 0 4px #87631a; 
transition: 0.15s ease; 
z-index: 10; } 

#close-book:hover { 
background: #f7eab5; 
transform: translateY(2px); 
box-shadow: 0 2px #6a4d13; }

#prev-page { left: 25px; } 
#next-page { left: 120px; }

/* --- Animations --- */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

@keyframes spineGlow {
  from { box-shadow: 0 0 6px 2px rgba(255, 250, 180, 0.6); }
  to { box-shadow: 0 0 16px 5px rgba(255, 255, 200, 0.9); }
}

#book-popup.closing {
  animation: bookClose 0.4s ease-in forwards;
}

@keyframes bookClose {
  0% { transform: translateX(-50%) scaleX(1) rotateY(0deg); opacity: 1; }
  100% { transform: translateX(-50%) scaleX(0) rotateY(90deg); opacity: 0; }
}

/* --- Optional subtle page turn effect --- */
.turning-page {
  animation: pageTurn 0.6s ease;
}

@keyframes pageTurn {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(-15deg); box-shadow: inset -10px 0 25px rgba(0,0,0,0.2); }
  100% { transform: rotateY(0deg); }
}

/* allow bubbles to overflow the book area so they aren't clipped */
.book-popup {
  overflow: visible;
  position: absolute;
}

/* container */
.floating-questions {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none; /* keep non-blocking layout */
  z-index: 50;
}

/* main bubble */
.question-bubble {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  background: rgba(20, 18, 34, 0.92);
  color: #f6e6b2;
  font-family: "Dancing Script", cursive;
  font-size: 1rem;
  padding: 10px 14px;
  max-width: 260px;
  border-radius: 14px;
  border: 1px solid rgba(255, 235, 180, 0.15);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  line-height: 1.3;
  cursor: pointer;
  z-index: 60;
  white-space: normal;
  transition: transform 160ms ease, box-shadow 160ms ease;
  animation: gentleFloat 3s ease-in-out infinite;
}

.question-bubble:hover {
  transform: translate(-50%, -55%) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.65);
}

/* little tail */
.question-bubble::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 22px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid rgba(20,18,34,0.92);
  transform: rotate(-8deg);
}

/* gentle float motion (never disappears) */
@keyframes gentleFloat {
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-6px); }
  100% { transform: translateX(-50%) translateY(0); }
}

/* reply bubble inside */
.reply-bubble {
  position: relative;
  display: block;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(255, 249, 230, 0.92);
  color: #20120f;
  border-radius: 10px;
  font-family: "Cinzel", serif;
  font-size: 0.85rem;
  line-height: 1.3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.25s ease;
  z-index: 70;
}

.reply-bubble.show {
  opacity: 1;
  transform: scale(1);
}

</style>

  <!-- The Ledger  -->
<div id="ledger-popup" class="overlay hidden">
  <div class="ledger-box">
    <div class="ledger-content">
      <h2>SOUL LEDGER</h2>
      <div id="ledger-entries"></div>
      <button class="close-btn" onclick="closeLedger()">Close</button>
    </div>
  </div>
</div>

  <!-- Death Certificate -->
<div id="deathcert-overlay" class="overlay hidden">
  <div class="doc deathcert-doc">
    <h2>Death Certificate</h2>
    <div id="deathcert-content">
      <p>Name:</p>
      <div class="line"></div>

      <p>Date of Death:</p>
      <div class="line"></div>

      <p>Cause:</p>
      <div class="line"></div>

      <p>Witnessed By:</p>
      <div class="line"></div>
    </div>
   <div class="seal-area">
  <img src="{{ asset('assets/ui/seal.png') }}" alt="Official Seal" class="seal-img">
  <div class="seal-stamp">
    <img src="{{ asset('assets/ui/stamp.png') }}" alt="Judgement Stamp" class="stamp-img">
    <div class="signature">✠ Seal of Judgement ✠</div>
  </div>
</div>

    <button class="close-btn" onclick="closeDeathCert()">Close</button>
  </div>
</div>

<div id="book-popup" class="book-popup">
  <div class="book-inner">
    <div class="left-page">
      <div class="page-content"></div>
    </div>
    <div class="right-page">
      <div class="page-content"></div>
    </div>
  </div>
  <div class="book-controls">
    <button id="prev-page">← Prev</button>
    <button id="next-page">Next →</button>
    <button id="close-book" class="close-book">✕ Close</button>
  </div>
</div>


  <!-- Load Phaser (CDN quick start) -->
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>

  <!-- My game script  -->
  <script src="{{ asset('js/game.js') }}"></script>
</body>
</html>
