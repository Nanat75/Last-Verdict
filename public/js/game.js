// public/js/game.js

window.onload = function () {
  let selectedPlayerSprite = null;

// Create selection overlay
const selectionOverlay = document.createElement("div");
selectionOverlay.id = "player-selection";
selectionOverlay.style.position = "fixed";
selectionOverlay.style.top = "0";
selectionOverlay.style.left = "0";
selectionOverlay.style.width = "100%";
selectionOverlay.style.height = "100%";
selectionOverlay.style.overflow = "hidden";
selectionOverlay.style.display = "flex";
selectionOverlay.style.flexDirection = "column";
selectionOverlay.style.justifyContent = "center";
selectionOverlay.style.alignItems = "center";
selectionOverlay.style.zIndex = "9999";
selectionOverlay.style.color = "#fff";
selectionOverlay.style.fontFamily = "Cinzel, serif";
selectionOverlay.style.fontSize = "28px";
selectionOverlay.style.textAlign = "center";
selectionOverlay.style.background =
  "radial-gradient(circle at center, #2e2727 0%, #0f0c0c 100%)";
selectionOverlay.style.animation = "fadeIn 1.5s ease-out";

selectionOverlay.innerHTML = `
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(255,230,200,0.4); }
      50% { box-shadow: 0 0 40px rgba(255,230,200,0.7); }
    }
    @keyframes fogMove {
      0% { transform: translateX(-50%) scale(1.1); opacity: 0.15; }
      50% { transform: translateX(0%) scale(1.05); opacity: 0.25; }
      100% { transform: translateX(50%) scale(1.1); opacity: 0.15; }
    }

    /* drifting fog overlay */
    #fog-layer {
      position: absolute;
      top: 0; left: 0;
      width: 200%;
      height: 100%;
      background: url('https://i.ibb.co/XbsykWf/fog-texture.png') repeat;
      background-size: cover;
      opacity: 0.15;
      animation: fogMove 20s linear infinite;
      filter: blur(5px);
      pointer-events: none;
      z-index: 0;
    }

    #title-text {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 40px;
      text-shadow: 0 4px 10px rgba(0,0,0,0.8);
      z-index: 2;
    }

    #character-row {
      display: flex;
      gap: 120px;
      z-index: 2;
    }

    .character-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .glow-circle {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 230, 200, 0.3) 0%, transparent 70%);
      animation: pulseGlow 2.5s infinite ease-in-out;
      z-index: 1;
      filter: blur(8px);
    }

    .character-btn {
      width: 220px;
      height: auto;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      border-radius: 10px;
      z-index: 3;
    }

    .character-btn:hover {
      transform: scale(1.1);
      border-color: #e0d5c0;
      filter: brightness(1.1);
    }

    .character-label {
      margin-top: 15px;
      font-size: 18px;
      opacity: 0.8;
      z-index: 3;
    }
  </style>

  <div id="fog-layer"></div>

  <div id="title-text">Choose Your Character</div>
  <div id="character-row">
    <div class="character-wrapper">
      <div class="glow-circle"></div>
      <img src="/assets/player_male.png" id="male-btn" class="character-btn" />
      <div class="character-label">Male</div>
    </div>
    <div class="character-wrapper">
      <div class="glow-circle"></div>
      <img src="/assets/player_female.png" id="female-btn" class="character-btn" />
      <div class="character-label">Female</div>
    </div>
  </div>
`;

document.body.appendChild(selectionOverlay);



  document.getElementById("male-btn").onclick = () => selectSprite("male");
  document.getElementById("female-btn").onclick = () => selectSprite("female");

  function selectSprite(sprite) {
    selectedPlayerSprite = sprite;
    selectionOverlay.remove();
    initPhaserGame(selectedPlayerSprite);
  }

  function initPhaserGame(spriteChoice) {
  const config = {
    type: Phaser.AUTO,
    width: 1200,   
    height: 720,   
    parent: "game-container",
    backgroundColor: "#262b1cff",
    scene: { preload, create, update },
  };

    const game = new Phaser.Game(config);
    window.selectedPlayerSprite = spriteChoice; // global access
  }

  // ---------------- STATE ----------------
  let maskSprite,
    dialogueText,
    questionButtons = [],
    evidencePanel,
    panelText,
    timerBar,
    timerTween,
    corruptionBar,
    corruptionLevel = 0;
    let playerSprite;

  let timeLeft = 60; // seconds per soul
  let currentSoul;
  let soulsJudged = 0;
  const maxSouls = 7;
  let currentPageIndex = 0;
  

  const decisionsLog = [];
  let redeemCount = 0;
  let condemnCount = 0;

  // ---------------- STATE ----------------
let corruptionBarBg, corruptionBarFill;

  // ---------------- PRELOAD ----------------
  function preload() {
    this.load.image("bg", "/assets/bg_hall.png");

    // masks
    this.load.image("greed", "/assets/masks/greed.png");
    this.load.image("wrath", "/assets/masks/wrath.png");
    this.load.image("envy", "/assets/masks/envy.png");
    this.load.image("sloth", "/assets/masks/sloth.png");
    this.load.image("gluttony", "/assets/masks/gluttony.png");
    this.load.image("lust", "/assets/masks/lust.png");
    this.load.image("pride", "/assets/masks/pride.png");

    // Load player sprites
    this.load.image("player_male", "/assets/player_male.png");
    this.load.image("player_female", "/assets/player_female.png");

    // desk & docs
    this.load.image("desk", "/assets/ui/desk.png");
    this.load.image("book_open", "/assets/ui/book_open.png");
    this.load.image("file", "/assets/ui/file.png");
    this.load.image("ledger", "/assets/ui/ledger.png");

    // decisions
    this.load.image("redeem", "/assets/ui/redeem.png");
    this.load.image("condemn", "/assets/ui/condemn.png");
  }

  // ---------------- CREATE ----------------
function create() {

  const playerChoice = window.selectedPlayerSprite;

    // add background (smaller scale so it fits better)
  const bg = this.add.image(600, 300, "bg")
    .setScale(1.15) 
    .setDepth(0);

    // Spawn the chosen player sprite
    let playerSpriteKey = playerChoice === "male" ? "player_male" : "player_female";
    playerSprite = this.add.sprite(600, 400, playerSpriteKey)
  .setDisplaySize(200, 200) // width, height
  .setDepth(0);

    // desk (always in front of NPCs)
    this.add.image(600, 690, "desk")
      .setDisplaySize(1200, 140)
      .setDepth(5);

    // Soul NPC
    maskSprite = this.add.sprite(660, 330, "greed")
      .setScale(0.8)
      .setDepth(3); 

    dialogueText = this.add.text(600, 520, "", {
      fontSize: "20px",
      fill: "#fff",
      wordWrap: { width: 800 },
    }).setOrigin(0.5).setDepth(6); 


    const tutorialText = this.add.text(600, 100, "Welcome! Examine souls and decide their fate.", {
  fontSize: "24px",
  fill: "#fff",
  align: "center",
}).setOrigin(0.5)
    .setDepth(7);


this.tweens.add({
  targets: tutorialText,
  alpha: 0,
  duration: 5000,
  ease: "Power1",
  onComplete: () => tutorialText.destroy(),
});

     // ---------------- doc buttons (always above desk) ---------------- //

   // --- Book ---
let book = this.add.image(210, 670, "book_open")
  .setInteractive()
  .setScale(0.4)
  .setDepth(7)
  .on("pointerover", () => this.input.setDefaultCursor("pointer"))
  .on("pointerout", () => this.input.setDefaultCursor("default"));

// --- File (Death Certificate) ---
let file = this.add.image(500, 670, "file")
  .setInteractive()
  .setScale(0.15)
  .setDepth(7)
  .on("pointerover", () => this.input.setDefaultCursor("pointer"))
  .on("pointerout", () => this.input.setDefaultCursor("default"));

// --- Ledger ---
let ledger = this.add.image(710, 680, "ledger")
  .setInteractive()
  .setScale(0.16)
  .setDepth(7)
  .on("pointerover", () => this.input.setDefaultCursor("pointer"))
  .on("pointerout", () => this.input.setDefaultCursor("default"));

// --- Condemn button ---
let condemnBtn = this.add.image(980, 650, "condemn")
  .setInteractive()
  .setScale(0.15)
  .setDepth(7)
  .on("pointerover", () => this.input.setDefaultCursor("pointer"))
  .on("pointerout", () => this.input.setDefaultCursor("default"));

// --- Redeem button ---
let redeemBtn = this.add.image(1100, 650, "redeem")
  .setInteractive()
  .setScale(0.15)
  .setDepth(7)
  .on("pointerover", () => this.input.setDefaultCursor("pointer"))
  .on("pointerout", () => this.input.setDefaultCursor("default"));


    // hidden panel
    evidencePanel = this.add.image(450, 300, "docPanel")
      .setVisible(false)
      .setInteractive()
      .setDepth(8);
    panelText = this.add.text(450, 300, "", {
      fontSize: "18px",
      fill: "#fff",
      wordWrap: { width: 420 },
      align: "center",
    }).setOrigin(0.5).setDepth(9).setVisible(false);

    this.input.setDraggable(evidencePanel);
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      panelText.x = dragX;
      panelText.y = dragY;
    });

    function showPanel(text) {
      evidencePanel.setVisible(true);
      panelText.setVisible(true).setText(text || "");
    }

book.on("pointerdown", () => {
  if (!currentSoul) return;
  showBookPopup(currentSoul);
});

 ledger.on("pointerdown", () => {
  if (!currentSoul) return;
  showLedger(currentSoul);
});

file.on("pointerdown", () => {
  if (!currentSoul) return;
  showDeathCert(currentSoul);
});

// ---------------- THE LEDGER (List View) ---------------- //
function showLedger() {
  const ledgerPopup = document.getElementById("ledger-popup");
  const ledgerEntries = document.getElementById("ledger-entries");

  if (!soulsPool || soulsPool.length === 0) {
    ledgerEntries.innerHTML = "<p>No souls recorded.</p>";
    ledgerPopup.classList.remove("hidden");
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Virtue</th>
          <th>Vice</th>
          <th>Regret</th>
          <th>Memory</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const soul of soulsPool) {
    const l = soul.ledger || {};
    html += `
      <tr>
        <td>${soul.name}</td>
        <td class="good">+${l.virtue ?? 0}</td>
        <td class="bad">-${l.vice ?? 0}</td>
        <td>${l.regret ?? "—"}</td>
        <td>${l.memory ?? "—"}</td>
        <td>${(l.balance ?? 0) > 0 ? "+" + l.balance : l.balance}</td>
      </tr>
    `;
  }

  html += "</tbody></table>";
  ledgerEntries.innerHTML = html;
  ledgerPopup.classList.remove("hidden");
}

function closeLedger() {
  document.getElementById("ledger-popup").classList.add("hidden");
}

window.closeLedger = function () {
  const overlay = document.getElementById("ledger-popup");
  if (overlay) overlay.classList.add("hidden");
};


  // ---------------- Death Certificate ---------------- //
function showDeathCert(soul) {
  const overlay = document.getElementById("deathcert-overlay");
  const content = document.getElementById("deathcert-content");

  content.innerHTML = `
    <p><strong>Name:</strong> ${soul.name || "Unknown"}</p>
    <div class="line"></div>

    <p><strong>Date of Death:</strong> ${soul.dateOfDeath || "Unrecorded"}</p>
    <div class="line"></div>

    <p><strong>Cause:</strong> ${soul.cause || "Unknown cause"}</p>
    <div class="line"></div>

    <p><strong>Witnessed By:</strong> ${soul.witnessedBy || "No witnesses"}</p>
    <div class="line"></div>

    <hr>
    <p>${soul.deathCert || "Details unavailable."}</p>
  `;

  overlay.classList.remove("hidden");
}


function closeDeathCert() {
  document.getElementById("deathcert-overlay").classList.add("hidden");
}

window.closeDeathCert = function () {
  const overlay = document.getElementById("deathcert-overlay");
  if (overlay) overlay.classList.add("hidden");
};

 // ---------------- Extra UI ---------------- //

this.add.text(30, 40, "Corruption", { fontSize: "12px", fill: "#fff" });

// Background bar
corruptionBarBg = this.add.rectangle(150, 45, 200, 14, 0x444444).setOrigin(0, 0.5);

// Fill bar
corruptionBarFill = this.add.rectangle(150, 45, 0, 14, 0xff3333).setOrigin(0, 0.5);

    // timer bar (origin on right so it shrinks left)
    timerBar = this.add.rectangle(1150, 60, 180, 20, 0x00ff00).setOrigin(1, 0.5);
    // ensure initial scaleX is 1
    timerBar.scaleX = 1;

// click logic
condemnBtn.on("pointerdown", () => makeDecision("condemn", this));
redeemBtn.on("pointerdown", () => makeDecision("redeem", this));

    createQuestions(this);
    prepareSoulsAndStart(this);
  }

 function update() {
    const w = Phaser.Math.Clamp((corruptionLevel / 100) * 200, 0, 200);
    if (corruptionBarFill) corruptionBarFill.width = w;
}


  // ---------------- Book Of Life ---------------- //
let consultingBook = false;

// Handle book close
document.getElementById("close-book").onclick = () => {
  const popup = document.getElementById("book-popup");
  popup.classList.add("closing");
  setTimeout(() => {
    popup.classList.remove("show", "closing");
    consultingBook = false;
    removeFloatingQuestions();
  }, 400);
};

// === Normal Book Open ===
function openBookNormally(soul) {
  consultingBook = false;
  showBookPopup(soul);
}

// === Consult the Book (summons questions) ===
function consultBook(soul) {
  consultingBook = true;
  showBookPopup(soul);
}

// === Core Popup Logic ===
function showBookPopup(soul) {
  currentSoul = soul;
  currentPageIndex = 0;
  updateBookPages();

  const popup = document.getElementById("book-popup");
  popup.classList.add("show");

  if (consultingBook) showFloatingQuestions(currentSoul);
  else removeFloatingQuestions();
}

// === Page Navigation ===
function updateBookPages() {
  if (!currentSoul) return;

  const popup = document.getElementById("book-popup");
  const leftPage = popup.querySelector(".left-page .page-content");
  const rightPage = popup.querySelector(".right-page .page-content");
  const totalPages = currentSoul.bookPages.length;
  const pages = currentSoul.bookPages[currentPageIndex];

  leftPage.innerHTML = `
    <h2>Book of Life</h2>
    <div class="book-text">${pages.left}</div>
  `;
  rightPage.innerHTML = `
    <div class="book-text">${pages.right}</div>
    <p class="book-note"><em>${currentSoul.bookNote || ""}</em></p>
  `;

  document.getElementById("prev-page").disabled = currentPageIndex === 0;
  document.getElementById("next-page").disabled =
    currentPageIndex >= totalPages - 1;
}

// === Page Buttons ===
document.getElementById("next-page").onclick = () => {
  if (!currentSoul) return;
  if (currentPageIndex < currentSoul.bookPages.length - 1) {
    currentPageIndex++;
    updateBookPages();
  }
};

document.getElementById("prev-page").onclick = () => {
  if (!currentSoul) return;
  if (currentPageIndex > 0) {
    currentPageIndex--;
    updateBookPages();
  }
};
// === Floating Question Logic ===
let bubblePositions = {}; // store positions so they stay after clicks

function showFloatingQuestions(soul) {
  removeFloatingQuestions();

  const popup = document.getElementById("book-popup");
  const questionLayer = document.createElement("div");
  questionLayer.classList.add("floating-questions");

  const questions = getSoulQuestions(soul.id);
  const count = questions.length;

  // grid setup — spacious layout
  const cols = Math.min(count, 3);  
  const rows = Math.ceil(count / cols);

  const startLeft = 25;
  const endLeft = 75;
  const startTop = 38;
  const endTop = 63;

  const xStep = (endLeft - startLeft) / (cols + 1);
  const yStep = (endTop - startTop) / (rows + 1);

  // if positions aren't saved yet, generate once
  if (!bubblePositions[soul.id]) {
    const placed = []; 
    bubblePositions[soul.id] = questions.map((q, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      let left, top;
      let tries = 0;
      const minDistance = 12;

     do {
      left = startLeft + xStep * (col + 1) + (Math.random() - 0.5) * 90;
      top = startTop + yStep * (row + 1) + (Math.random() - 0.5) * 50;

      // Check distance with all previously placed bubbles
      const tooClose = placed.some(
        (p) =>
          Math.hypot(p.left - left, p.top - top) < minDistance
      );

      if (!tooClose) break;
      tries++;
    } while (tries < 10);

    placed.push({ left, top });
    return { left, top };
  });
}
  const positions = bubblePositions[soul.id];

  questions.forEach((pair, i) => {
    const bubble = document.createElement("div");
    bubble.classList.add("question-bubble");
    bubble.textContent = pair.q; 

    const { left, top } = positions[i];
    bubble.style.left = `${left}%`;
    bubble.style.top = `${top}%`;
    bubble.style.animationDelay = `${Math.random() * 1.2}s`;

    bubble.onclick = () => {
      const existing = bubble.querySelector(".reply-bubble");
      if (existing) existing.remove();

      // ✅ FIXED: replyText should be pair.a (not passing the object)
      const replyText = pair.a;
      const reply = createReplyBubble(replyText);
      bubble.appendChild(reply);
      setTimeout(() => reply.classList.add("show"), 30);
    };

    questionLayer.appendChild(bubble);
  });

  popup.appendChild(questionLayer);
}

function createReplyBubble(text) {
  const reply = document.createElement("div");
  reply.classList.add("reply-bubble");
  reply.textContent = text;
  return reply;
}

function removeFloatingQuestions() {
  document.querySelectorAll(".floating-questions").forEach((el) => el.remove());
}

function getSoulQuestions(id) {
  switch (id) {
    case "S1": // Greed — Alden Marrick
      return [
        {
          q: "You burned the ledgers, Alden. What truth did you hope the flames would hide?",
          a: "“That every donation I gave was just another transaction. Fire cannot cleanse intent.”"
        },
        {
          q: "Did charity comfort your conscience or only feed your reputation?",
          a: "“It fed my image. Charity is a fine disguise for hunger.”"
        },
        {
          q: "When your hand trembled over gold, was it fear or regret that shook it?",
          a: "“Fear. Regret comes after the counting stops.”"
        }
      ];

    case "S2": // Wrath — Darren Holt
      return [
        {
          q: "Was it the enemy you fought, or yourself beneath that uniform?",
          a: "“My reflection wore both faces. I never stopped firing.”"
        },
        {
          q: "You led the charge without orders, did rage make you brave or blind?",
          a: "“Both. Bravery without reason is just rage in uniform.”"
        },
        {
          q: "Would peace have felt like surrender to you, Darren?",
          a: "“Peace felt like silence. I never trusted silence.”"
        }
      ];

    case "S3": // Envy — Liora Faen
      return [
        {
          q: "You said you never envied anyone, Liora..then why did your letters drip with green ink?",
          a: "“Because I wrote with what I felt. Envy is a color that stains everything.”"
        },
        {
          q: "Was your art for beauty’s sake, or to eclipse another’s light?",
          a: "“At first for beauty. Then for vengeance. It’s hard to tell where one ended.”"
        },
        {
          q: "When you raised your glass that final night, did you toast love or victory?",
          a: "“Neither. I toasted the end of pretending.”"
        }
      ];

    case "S4": // Sloth — Gareth Runn
      return [
        {
          q: "You promised to begin again tomorrow, what made tomorrow never come?",
          a: "“Tomorrow kept forgiving me. Eventually, I stopped earning it.”"
        },
        {
          q: "Did rest heal you, Gareth, or simply bury your will beneath comfort?",
          a: "“Rest is just slower decay when the heart’s already tired.”"
        },
        {
          q: "When the ink stopped flowing, was it your quill or your soul that grew tired first?",
          a: "“The quill only follows what’s already empty.”"
        }
      ];

    case "S5": // Gluttony — Emric Halden
      return [
        {
          q: "You fed the world once. when did the feast become only yours?",
          a: "“When their laughter stopped being enough. I wanted silence that tasted like praise.”"
        },
        {
          q: "Did laughter taste sweeter when no one else was left to share it?",
          a: "“Sweeter, yes. But only for a moment. Then came the rot.”"
        },
        {
          q: "Was fullness ever enough, Emric, or did hunger become your only prayer?",
          a: "“Hunger was the prayer. Fullness was the punishment.”"
        }
      ];

    case "S6": // Lust — Selene Vayne
      return [
        {
          q: "Selene, how many hearts did you borrow before losing your own?",
          a: "“I stopped counting when I realized none of them were mine to keep.”"
        },
        {
          q: "Did you love them all, or only the feeling of being adored?",
          a: "“Adoration was easier. Love demands truth, and I feared mirrors.”"
        },
        {
          q: "When the mirror shattered, did you see regret or just another reflection to seduce?",
          a: "“Both. Regret looks beautiful when it’s framed in glass.”"
        }
      ];

    case "S7": // Pride — Luna Drae
      return [
        {
          q: "You stood alone atop your tower, was it victory or exile?",
          a: "“Both. The higher I climbed, the smaller their voices became — until none reached me.”"
        },
        {
          q: "Would you have rather fallen than admit you needed another’s hand?",
          a: "“I would rather fall by my own design than rise by another’s mercy.”"
        },
        {
          q: "Did perfection keep you company when everyone else was gone?",
          a: "“Perfection was company enough. Until it began to whisper back.”"
        }
      ];

    default:
      return [{ q: "The Book whispers, but this soul leaves no echo.", a: "..." }];
  }
}

// Example: retrieve dialogue for a soul
function talkToSoul(id) {
  const dialogue = getSoulQuestions(id);
  let output = "";
  dialogue.forEach((pair, i) => {
    output += `Q${i + 1}: ${pair.q}\nA${i + 1}: ${pair.a}\n\n`;
  });
  return output;
}

// Example usage
console.log(talkToSoul("S6")); // Selene Vayne will answer all 3 questions


  // ---------------- SOUL SETUP ---------------- //

  let soulsPool = [];
function prepareSoulsAndStart(scene) {
  soulsPool = [
{
  id: "S1",
  name: "Alden Marrick",
  dateOfDeath: "March 3, 1889",
  cause: "Cardiac arrest (financial fraud suspected)",
  witnessedBy: "Neighbor – Clara Voss",
  mask: "greed",
  truth: "I donated often.",
  lies: { money: true },
  deathCert: 
   "The subject was discovered collapsed at his desk in the study, surrounded by scattered ledgers and torn banknotes. Cause of death was cardiac arrest. Ink residue on the fingertips and partially burned receipts indicate an attempt to destroy financial records shortly before death. Multiple charity accounts under his name showed unaccounted transfers and forged signatures verified as his own. Neighbors reported a light in the study past midnight, followed by silence. Upon arrival, authorities found the subject’s hand gripping a quill, his final entry incomplete. Though the law found no foul play, the ledgers tell a different story on one of avarice tightening its grasp until the heart itself gave way.",
  ledger: {
    virtue: 4,      
    vice: 9,         
    regret: 4,       
    memory: 7,       
    balance: -5,    
    sinType: "Greed",
      },
  isGuilty: true,
bookPages: [
  {
    left: `
      <h3>Page 12 — Records of Benevolence</h3>
      The subject, Alden Marrick, maintained a public reputation for generosity,
      his name often appearing in the ledgers of local charities.  
      He hosted dinners for benefactors, spoke of virtue, and
      wore modesty as a badge of moral triumph.  
      Yet beneath these gestures lay a meticulous arithmetic — every coin given
      weighed against the admiration it might purchase.  
      He smiled, but his hand trembled each time gold left his grasp.
    `,
    right: `
      <h3>Page 13 — The False Light</h3>
      In private, his books told another story:  
      donations recorded twice, sums redirected through ghost accounts,
      and letters to orphanages left unanswered.  
      The quill that once wrote blessings grew heavy with deceit.  
      His final note ends mid-sentence. the ink trails down the page
      like a confession interrupted.  
      <br><br><em>Book of Life Annotation:</em> The page bears faint scorch marks,
      as if fire itself recoiled from what it read.
    `
  },
  {
    left: `
      <h3>Page 14 — The Night of Reckoning</h3>
      Witness accounts mention a dim candle burning past midnight,
      shadows pacing behind the study door.  
      He spoke aloud to no one, perhaps bargaining with something unseen.  
      When the light went out, so did his breath.  
      Upon the desk: torn receipts, ash, and a single entry. 
      <em>"To cleanse what greed has gathered, one must return it in full."</em>
    `,
    right: `
      <h3>Page 15 — Judgement</h3>
      The ink stains remain, refusing to fade even in divine light.  
      The book closes not in mercy, but in revelation:  
      that false virtue weighs heavier than open sin.  
      <br><br>
      <em>Conclusion:</em> Though his hands gave, his heart withheld.
      Thus his name is marked in gold. not for honor,
      but as a warning to those who would sanctify greed
      with the guise of good.
    `
  }
],

},

{
  id: "S2",
  name: "Darren Holt",
  dateOfDeath: "July 22, 1914",
  cause: "Killed in combat during the Great War",
  witnessedBy: "Fellow soldier – Elise Rane",
  mask: "wrath",
  truth: "I always stayed calm.",
  lies: { violence: true },
  deathCert: 
    "The subject was confirmed deceased on the battlefield during the early months of the Great War. Reports describe him leading a charge after a heated argument with his commanding officer. Witnesses claim he fought with reckless abandon, ignoring orders to retreat. His body was found among the ruins of a trench, hands still clenched around a bloodied rifle. Autopsy confirms multiple shrapnel wounds and severe blunt trauma to the skull. Fellow soldiers recalled his temper, an unrelenting rage that burned brighter than fear itself. Some say he was not felled by enemy fire, but by the wrath he carried within, which consumed him long before the war did. His name was etched into the memorial wall, but the record beneath it was scorched beyond recognition.",
  ledger: {
    virtue: 10,       
    vice: 5,          
    regret: 4,        
    memory: 6,        
    balance: 5,     
    sinType: "Wrath",
      },
  isGuilty: true,
 bookPages: [
  {
    left: `
      <h3>Page 21 — The Soldier’s Oath</h3>
      Darren Holt grew up beneath the toll of factory bells and the promise of duty.  
      He enlisted young, drawn not by glory but by order.
      the clean lines of uniform and command.  
      In those early months, he was calm, obedient, precise.  
      His letters home spoke of purpose, of light found in structure.  
      Yet beneath the tone of pride, there lingered the ember of defiance,
      a temper that mistook justice for war.
    `,
    right: `
      <h3>Page 22 — The Fire Within</h3>
      Years in the field shaped him into both weapon and wound.  
      His courage was unquestioned, his loyalty fierce,
      but peace never followed in his footsteps.  
      He quarreled with officers, defended those he called brothers,  
      and struck when silence demanded patience.  
      Elise Rane, a medic, once wrote:  
      <em>"He fought the enemy as though they shared his name."</em>  
      By the time the war neared its end,  
      the uniform weighed heavier than the rifle it carried.
    `
  },
  {
    left: `
      <h3>Page 23 — The Letter in the Mud</h3>
      His final note, found in his coat, read:  
      <em>"If wrath is the only thing that moves me,  
      let it shield those still standing."</em>  
      The handwriting trembled, water streaked and uneven.  
      That night he kept to himself, oiling his weapon in silence.  
      When dawn broke, he led the charge. 
      not by command, but by conviction burning too bright to contain.  
      Witnesses said the light around him glowed red before fading into smoke.
    `,
    right: `
      <h3>Page 24 — Conclusion</h3>
      The Book records no serenity, only a name etched in scorched ink.  
      His valor was real, his rage divine and ruinous.  
      He died as he lived, defiant, unyielding, aflame.  
      <br><br>
      <em>Conclusion:</em>  
      Wrath is not born of hatred, but of love starved of peace.  
      His page ends warm to the touch,  
      as though the fire within him never truly went out.
    `
  }
],
},


    {
  id: "S3",
  name: "Liora Faen",
  dateOfDeath: "December 10, 1897",
  cause: "Poisoning – motive unclear",
  witnessedBy: "Old friend – Cyrus Vale",
  mask: "envy",
  truth: "I never envied anyone.",
  lies: { rivals: true },
  deathCert: 
    "The subject was discovered lifeless in her study, a glass of half-finished wine resting nearby. Traces of arsenic were identified in the residue, though its source remains undetermined. Testimonies describe growing tension between the deceased and a former acquaintance, Cyrus Vale, following rumors of professional betrayal. Several letters found posthumously revealed an obsession with her rival’s success, each penned with increasing resentment and despair. Local authorities dismissed foul play due to lack of proof, though the tone of her final correspondence suggested envy as both poison and victim. Some pages of her personal diary were torn, the ink beneath faintly greened, as if corroded by bitterness itself.",
  ledger: { 
    virtue: 8,        
    vice: 3,
    regret: 8,        
    memory: 5,
    balance: 5,     
    sinType: "Envy",  
 },
  isGuilty: true,
    bookPages: [
    {
      left: `
        <h3>Page 31 — The Silver Stage</h3>
        Liora Faen lived for the glow of candlelight and applause.  
        Her voice once filled small halls, drawing strangers to silence.  
        She wore grace as armor, laughter as disguise. 
        a woman beloved, yet never certain she belonged.  
        When her companion Cyrus Vale rose in fame,  
        her letters grew quieter, her tone colder.  
        She began to measure her worth by the shadows she could not chase.
      `,
      right: `
        <h3>Page 32 — The Turning</h3>
        Years of study and sleepless ambition hardened her heart.  
        What began as admiration soured into quiet tallying. 
        each success of his, a wound reopened.  
        She told herself it was justice to surpass him,  
        yet her craft dulled beneath the weight of wanting.  
        <br><br><em>Book of Life Annotation:</em>  
        Margins stained faintly green. Envy breathes softly..unseen, but enduring.
      `
    },
    {
      left: `
        <h3>Page 33 — The Withering Hand</h3>
        She withdrew from her circle, composing letters she never sent.  
        Praise became pretense; affection turned arithmetic.  
        The quill trembled each time she wrote his name.  
        Her journals spoke of fatigue, of a heart bruised by comparison.  
        The final note reads only:  
        <em>"If I cannot shine beside him, then not at all."</em>
      `,
      right: `
        <h3>Page 34 — The Last Draft</h3>
        The night she drank, she was seen smiling..  
        a soft, exhausted kind of peace.  
        No confession followed, only silence and still ink.  
        <br><br>
        <em>Conclusion:</em> The Book closes gently upon her name.  
        Not as a sinner’s mark, but as a lesson, 
        that envy does not consume others first.  
        It begins within, and ends the same.
      `
    }
  ],
},

  {
  id: "S4",
  name: "Gareth Runn",
  dateOfDeath: "May 6, 1820",
  cause: "Malnutrition – self-neglect and isolation",
  witnessedBy: "Employer – Tomas Dier",
  mask: "sloth",
  truth: "I worked hard in life.",
  lies: { laziness: true },
  deathCert: 
    "Subject was found in a small, dust-laden room, body frail and surrounded by unfinished work. No signs of struggle or intrusion were detected. The physician concluded death by prolonged starvation and neglect, though neighbors spoke of months of silence before discovery. Records from his employer show years of incomplete ledgers, missed shifts, and letters left unanswered. Once regarded as diligent, Gareth gradually withdrew from all human contact, claiming he was ‘too weary to begin again.’ His quarters bore evidence of meals uneaten and tasks half-finished, as if time itself had abandoned him. Authorities marked the death as natural, but the absence of will..the slow surrender of effort was the truer cause.",
  ledger: { 
    virtue: 6,      
    vice: 3,         
    regret: 9,      
    memory: 5,       
    balance: 3,     
    sinType: "Sloth",
 },
  isGuilty: true,
  bookPages: [
    {
      left: `
        <h3>Page 41 — The Weight of Stillness</h3>
        Gareth Runn began as a man of steady hands and quiet diligence.  
        His ledgers once ran smooth, his ink precise, his tasks completed before dawn.  
        Yet time, relentless and patient, wore him down grain by grain.  
        One year’s fatigue became ten. The light at his desk dimmed,  
        replaced by the shadow of postponement.  
        He told his employer, “Tomorrow will be better,”  
        until tomorrow ceased to arrive.  
      `,
      right: `
        <h3>Page 42 — The Unfinished Hours</h3>
        The records show half-written letters, half-eaten bread,  
        and clocks that stopped, unwound, and never reset.  
        Neighbors spoke of faint scratching through the walls,  
        the sound of a quill moving without purpose.  
        Dust gathered over the furniture, over the man himself,  
        as if the world decided to move on without him.  
        When found, the window was open.
        not for air, but for escape that never came.  
      `
    },
    {
      left: `
        <h3>Page 43 — The Quiet Decay</h3>
        In his final months, Gareth ceased to rise from his chair.  
        His reflection in the darkened glass became his only company.  
        He wrote numbers that added to nothing,  
        words that ended mid-thought.  
        The Book notes these as “blank years”.
        spaces where effort once lived, now hollowed by exhaustion.  
        His final entry reads simply:  
        <em>"I will begin again... after I rest."</em>
      `,
      right: `
        <h3>Page 44 — Conclusion</h3>
        The Book closes softly on his name.  
        No fire, no violence, only stillness drawn out too long.  
        <br><br>
        <em>Conclusion:</em>  
        Sloth is not mere idleness, but surrender. 
        the slow fading of will beneath the weight of life.  
        His page feels cold, untouched by time,  
        as if even the ink grew tired before it dried.  
      `
    }
  ],
},

   {
  id: "S5",
  name: "Emric Halden",
  dateOfDeath: "October 18, 1753",
  cause: "Ruptured stomach following excessive feast",
  witnessedBy: "Servant – Ruel Darn",
  mask: "gluttony",
  truth: "I lived moderately.",
  lies: { excess: true },
  deathCert: 
    "The subject expired during the final course of an extravagant banquet held within his estate. Witnesses recount an evening of indulgence that stretched from dusk until the early hours, with no pause between platters. Physicians determined death by gastric rupture brought on by uncontrolled consumption. Servants later confessed to hearing laughter turn to gasps before silence fell across the hall. Tables remained untouched for days, covered in half-eaten dishes and spilled wine, as if the feast itself mourned its master. Records show years of waste and decadence, each festival larger than the last, each meal taken in defiance of restraint. Though wealth surrounded him, gratitude did not.. his hunger was never for sustenance, but for possession.",
  ledger: { 
    virtue: 3,       
    vice: 9,         
    regret: 3,       
    memory: 7,       
    balance: -6,     
    sinType: "Gluttony",
 },
  isGuilty: true,
  bookPages: [
    {
      left: `
        <h3>Page 51 — Youth of Abundance</h3>
        Emric Halden was born to a house of wealth and harvest.  
        The Halden estate thrived on trade and grain, its halls filled with scent of spice and sugar.  
        From childhood, he learned that joy could be served on silver.  
        He was a boy who shared his plate freely, feeding strays and guests alike —  
        yet even then, his kindness carried a hunger that went deeper than food.  
        He wanted the world to taste what he tasted: comfort without end.  
      `,
      right: `
        <h3>Page 52 — The Celebrant</h3>
        As he grew, so too did his feasts.  
        His dining table became his throne, his laughter a chorus of plenty.  
        He hosted the poor and the proud alike, believing that no sorrow could survive under candlelight and wine.  
        Yet each night stretched longer, each meal richer, until conversation faded and only appetite remained.  
        He mistook fullness for love, and indulgence for joy.  
        The man who once fed others began to eat to forget.  
      `
    },
    {
      left: `
        <h3>Page 53 — The Empty Chair</h3>
        Time thinned his circle. Friends declined his invitations;  
        servants whispered of rooms sealed with spoiled fruit and wilting flowers.  
        Still, he sat alone at his endless banquets, toasting to ghosts of laughter.  
        He swore he could not sleep unless the table was full —  
        and so he filled it again and again, until even silence grew fat.  
        The house that once fed a town became a shrine to appetite.  
      `,
      right: `
        <h3>Page 54 — Reflection</h3>
        He lived believing that joy was something to consume,  
        not something to be remembered.  
        His life, though rich, decayed from the inside out —  
        like fruit left too long in a bowl of gold.  
        The Book notes his generosity in the margins,  
        yet the ink bleeds where abundance became addiction.  
        <br><br>
        <em>Conclusion:</em>  
        He celebrated until celebration became his cage.  
        His hunger fed none but himself, and in the end, even that feast went cold.  
      `
    }
  ],
},

{
  id: "S6",
  name: "Selene Vayne",
  dateOfDeath: "February 14, 1903",
  cause: "Stab wound from lover’s quarrel",
  witnessedBy: "No direct witness — confession recovered from the scene.",
  mask: "lust",
  truth: "I loved deeply and purely.",
  lies: { desire: true },
  deathCert: 
    "The subject was discovered in her private chambers on the night of February 14th, her body found near a shattered mirror and a wilted bouquet. Cause of death was a single stab wound to the chest, delivered during an altercation with a former lover. Reports describe an intricate web of affairs that left jealousy and betrayal in their wake. Neighbors recalled music and laughter echoing late into the night, until the sound turned to screams. Authorities ruled it a crime of passion, though no conviction was ever made. Her charm lingered long after her breath faded, leaving behind only perfume and guilt in equal measure. Some say mirrors still fog when her name is spoken.",
  ledger: { 
    virtue: 2,       
    vice: 8,         
    regret: 4,      
    memory: 7,       
    balance: -6,     
    sinType: "Lust", 
 },
  isGuilty: true,
 bookPages: [
    {
      left: `
        <h3>Page 61 — The Velvet Smile</h3>
        Selene Vayne entered every room as if light followed her command.  
        Her laughter could turn envy into admiration, sorrow into desire.  
        She loved freely — too freely — mistaking affection for purpose.  
        Letters found in her vanity spoke of countless promises,  
        each written with sincerity, each soon forgotten.  
        Lovers called her muse, liar, and salvation in turn,  
        yet she wore every title like silk upon her skin.  
      `,
      right: `
        <h3>Page 62 — The Web of Hearts</h3>
        Her charm became its own prison.  
        She could not bear silence, nor a gaze that saw through her.  
        To be adored was to exist — and so she gathered hearts like trophies.  
        But love turned brittle beneath repetition, and devotion soured to spite.  
        One by one, those who loved her began to hate her reflection,  
        for it reminded them of the warmth she’d given, then taken away.  
      `
    },
    {
      left: `
        <h3>Page 63 — The Night of Glass</h3>
        The final evening began with wine and laughter,  
        a waltz of reconciliation that ended in blood.  
        When the mirror shattered, it seemed to split her smile in two —  
        one half soft with regret, the other still performing.  
        Her final words, written on a torn napkin, read:  
        <em>"If love is sin, then I was holy in my hunger."</em>  
        The ink bled like a wound, slow and deliberate.  
      `,
      right: `
        <h3>Page 64 — Conclusion</h3>
        The Book records her name in faded rose ink, fragrant even now.  
        Her beauty, though divine, devoured all who sought to share it.  
        She mistook desire for devotion, and found neither lasting.  
        <br><br>
        <em>Conclusion:</em>  
        Lust is not love, but longing without rest —  
        a fire that warms none and burns all.  
        Her page bears faint perfume,  
        yet beneath it lingers the scent of smoke.  
      `
    }
  ],
},

 {
  id: "S7",
  name: "Luna Drae",
  dateOfDeath: "August 29, 1785",
  cause: "Fall from tower – refused assistance",
  witnessedBy: "Assistant – Mara Lir",
  mask: "pride",
  truth: "I led with confidence.",
  lies: { arrogance: true },
  deathCert: 
    "The subject plummeted from the top of her own tower, a structure she designed to symbolize triumph over weakness. Witnesses state that moments before the fall, several aides offered aid as the scaffolding began to fail. She dismissed them with a laugh, insisting that no creation of her would betray her. When the stone gave way, she did not cry out for help. Physicians found her lifeless among the ruins, hand still clutching a fragment of the tower’s gilded railing. Her journals, recovered from the wreckage, were filled with speeches of perfection, of conquest, and of self-made divinity. Yet between the lines, the ink trembled as if the page itself doubted her. In the end, her greatest ascent became her undoing. The height she sought was the very distance from grace.",
  ledger: { 
    virtue: 4,       
    vice: 9,        
    regret: 4,     
    memory: 8,       
    balance: -5,    
    sinType: "Pride",  
 },
  isGuilty: true,
    bookPages: [
    {
      left: `
        <h3>Page 71 — The Architect of Glory</h3>
        Luna Drae was born beneath humble roofs yet dreamed in stone and sky.  
        From her youth, she built — not just walls, but legacies.  
        Her designs rose higher each year, each one a testament to her belief that perfection could be *constructed*.  
        When her peers faltered, she stood unshaken, calling failure a choice of the weak.  
        Her eyes were sharp, her voice certain, her hands steady as marble.  
        She earned both reverence and resentment — and cherished both.  
      `,
      right: `
        <h3>Page 72 — The Tower’s Shadow</h3>
        With every success, Luna’s faith in others thinned.  
        She trusted only her vision, dismissing those who questioned it.  
        “If I fall,” she once said, “then the world falls with me.”  
        The tower she designed became more than architecture — it was her monument, her mirror.  
        She spent her final years perfecting it, ignoring warnings, deaf to pleas.  
        The closer she came to its peak, the smaller every other soul seemed.  
      `
    },
    {
      left: `
        <h3>Page 73 — The Solitary Summit</h3>
        Few were invited to witness the tower’s completion.  
        She ascended alone, hand tracing the gold-lined rails she’d forged in her own name.  
        From above, the city appeared silent, obedient — just as she had dreamed.  
        But the stones beneath her feet trembled, as if burdened by her certainty.  
        Even as the wind rose and the cracks spread, she refused the helping hands below.  
        Pride, not gravity, pulled her down.  
      `,
      right: `
        <h3>Page 74 — Reflection</h3>
        In life, she led others to build the impossible.  
        In death, she taught that perfection is never worth isolation.  
        Her brilliance shone brightest when shared, and dimmed when turned inward.  
        The Book notes that her towers still stand,  
        though her name is spoken softly now, in awe and sorrow both.  
        <br><br>
        <em>Conclusion:</em>  
        Pride is not strength, but solitude the refusal of grace.  
        Her page gleams faintly, warm beneath the hand,  
        as if the gold itself still believes she was right.   
      `
    }
  ],
},
  ];

  // shuffle & pick souls
  soulsPool = Phaser.Utils.Array.Shuffle(soulsPool).slice(0, maxSouls);
  const murdererIndex = Phaser.Math.Between(0, soulsPool.length - 1);
  soulsPool[murdererIndex].isMurderer = true;

  soulsJudged = 0; redeemCount = 0; condemnCount = 0;
  decisionsLog.length = 0; corruptionLevel = 0;
  loadSoul(scene);
}

// ---------------- CONTRADICTION ----------------
function contradictionBetween(a, b) {
  if (!a || !b) return false;
  const al = a.toLowerCase(), bl = b.toLowerCase();

  // --- GENERAL OPPOSITES ---
  const opposites = [
    ["truth", "lie"],
    ["innocent", "guilty"],
    ["pure", "sin"],
    ["kind", "cruel"],
    ["mercy", "wrath"],
    ["calm", "rage"],
    ["humble", "pride"],
    ["give", "take"],
    ["charity", "greed"],
    ["love", "lust"],
    ["envy", "gratitude"],
    ["sloth", "diligent"],
    ["gluttony", "fast"],
    ["moderate", "excess"],
  ];

  for (const [x, y] of opposites) {
    if ((al.includes(x) && bl.includes(y)) || (al.includes(y) && bl.includes(x))) {
      return true;
    }
  }

  // --- SPECIFIC THEMATIC CONTRADICTIONS ---

  // donation contradictions (generosity vs redaction/greed)
  if (al.includes("donat") && (bl.includes("redact") || bl.includes("embezzle") || bl.includes("withheld"))) return true;
  if (al.includes("didn't") && bl.includes("donat")) return true;

  // calm vs conflict (behavior vs death report)
  if ((al.includes("calm") && (bl.includes("conflict") || bl.includes("shout"))) ||
      (bl.includes("calm") && (al.includes("conflict") || al.includes("shout")))) {
    return true;
  }

  // laziness vs blank records
  if ((al.includes("never finished") && bl.includes("blank")) ||
      (bl.includes("never finished") && al.includes("blank"))) {
    return true;
  }

  // moderation vs indulgence
  if ((al.includes("consumed") && bl.includes("moderate")) ||
      (bl.includes("consumed") && al.includes("moderate"))) {
    return true;
  }

  // regret contradictions (claimed remorse vs absence)
  if ((al.includes("regret") && bl.includes("none")) ||
      (bl.includes("regret") && al.includes("none"))) {
    return true;
  }

  // virtue vs vice contradictions (ledger inconsistency hints)
  if ((al.includes("virtuous") && bl.includes("corrupt")) ||
      (al.includes("repent") && bl.includes("unrepentant")) ||
      (al.includes("selfless") && bl.includes("selfish"))) {
    return true;
  }

  return false;
}


  // ---------------- GAME LOGIC ---------------- //
function loadSoul(scene) {
    currentSoul = soulsPool[soulsJudged];

    if (!currentSoul) {
        endGameDashboard(scene);
        return;
    }

    // Reset mask
    if (maskSprite) {
        maskSprite.setTexture(currentSoul.mask);
        maskSprite.setVisible(true);
        if (maskSprite.crack) maskSprite.crack.setVisible(false);
        maskSprite.setTint(0xffffff);
        maskSprite.setPosition(600, 400);
        if (maskSprite.crack) maskSprite.crack.setPosition(600, 400);
    }

    dialogueText.setText(`A soul arrives before you... bearing the mask of their sin.`);

    scene.inConfrontation = true; // ✅ set this here so it triggers properly

    // Reset timer
    if (timerTween) timerTween.stop();
    timerBar.scaleX = 1;
    timerBar.setFillStyle(0x00ff00); 
    timerBar.width = 180;

    timerTween = scene.tweens.add({
        targets: timerBar,
        scaleX: 0,
        duration: timeLeft * 1000,  // make sure timeLeft > 0
        ease: 'Linear',
        onUpdate: () => {
            // Optional: live countdown
        },
        onComplete: () => {
            questionButtons.forEach(b => b.disableInteractive && b.disableInteractive());
            dialogueText.setText("Time ended — mask solidifies. Decision made for you.");
            dialogueText.setStyle({ color: "#ff5555" });
            scene.time.delayedCall(500, () => autoCondemn(scene));
        }
    });

// ---------------- CREATE QUESTIONS ---------------- //
createQuestions(scene);
if (evidencePanel) evidencePanel.setVisible(false);
if (panelText) panelText.setVisible(false);
}

function createQuestions(scene) {
  questionButtons.forEach(b => { try { b.destroy(); } catch (e) {} });
  questionButtons = [];

  const questions = [
    // Investigation phase (Left side)
    { text: "Ask how their life ended.", topic: "death" },
    { text: "Confront them about their motives.", topic: "topic" },
    { text: "Consult the Book of Life’s record.", topic: "book" },

    // Reflection phase (Right side)
    { text: "Ask how they feel about their death.", topic: "emotion", isCustom: true, customText: "How do you feel about what happened?" },
    { text: "Ask if they regret their actions.", topic: "emotion", isCustom: true, customText: "Do you regret what you’ve done?" },
    { text: "Ask what they truly wanted.", topic: "emotion", isCustom: true, customText: "What did you really want?" },
  ];

  const leftX = 200;
  const rightX = 1010;
  const startY = 240;
  const spacing = 60;

  questions.forEach((q, i) => {
    const isLeft = i < 3;
    const x = isLeft ? leftX : rightX;
    const y = isLeft ? startY + i * spacing : startY + (i - 3) * spacing;

    // --- Button Frame ---
    const border = scene.add.rectangle(x, y + 20, 350, 34, 0x1e1b2b, 1)
      .setOrigin(0.5)
      .setStrokeStyle(3, 0x9e8b53) 
      .setDepth(7)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    // --- Inner plate (subtle parchment tint) ---
    const inner = scene.add.rectangle(x, y + 20, 324, 28, 0x2a2640, 1)
      .setOrigin(0.5)
      .setDepth(8)
      .setAlpha(0);

    // --- Label ---
    const label = scene.add.text(x, y + 20, q.text, {
      fontFamily: "Georgia",
      fontSize: "16px",
      color: "#f6e6b2",
      align: "center",
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 0, fill: true },
    })
      .setOrigin(0.5)
      .setDepth(9)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    // --- Hover effects ---
    border.on("pointerover", () => {
      border.setStrokeStyle(3, 0xffe58a);
      inner.setFillStyle(0x3a3455);
      scene.tweens.add({ targets: label, scale: 1.05, duration: 100 });
    });
    border.on("pointerout", () => {
      border.setStrokeStyle(3, 0x9e8b53);
      inner.setFillStyle(0x2a2640);
      scene.tweens.add({ targets: label, scale: 1.0, duration: 100 });
    });

    // --- Click handler ---
    const onClick = () => {
      if (q.isCustom) askQuestion(q.topic, scene, true, q.customText);
      else askQuestion(q.topic, scene);
    };
    border.on("pointerdown", onClick);
    label.on("pointerdown", onClick);

    // --- Fade + rise animation ---
    scene.tweens.add({
      targets: [border, inner, label],
      alpha: 1,
      y: y,
      duration: 400,
      ease: "Cubic.easeOut",
      delay: i * 90,
      onStart: () => {
        border.y = y + 25;
        inner.y = y + 25;
        label.y = y + 25;
      },
    });

    questionButtons.push(border, inner, label);
  });

  // --- Section Titles ---
  createSectionTitle(scene, leftX, startY - 65, "🕯️ Investigation");
  createSectionTitle(scene, rightX, startY - 65, "💭 Reflection");
}

// ---------------- SECTION TITLE (Enhanced Design) ---------------- //
function createSectionTitle(scene, x, y, text) {
  // --- Glowing aura behind the plate ---
  const glow = scene.add.rectangle(x, y, 270, 46, 0xeedb9e, 0.15)
    .setOrigin(0.5)
    .setDepth(6)
    .setAlpha(0);

  // --- Ornate title plate ---
  const plate = scene.add.rectangle(x, y, 250, 38, 0x2a2640, 1)
    .setOrigin(0.5)
    .setStrokeStyle(3, 0xffe58a)
    .setDepth(7)
    .setAlpha(0);

  // --- Decorative side ornaments ---
  const leftGem = scene.add.triangle(x - 135, y, 0, 20, 10, 0, 20, 20, 0xffe58a)
    .setDepth(8)
    .setAlpha(0);
  const rightGem = scene.add.triangle(x + 135, y, 0, 0, 10, 20, 20, 0, 0xffe58a)
    .setDepth(8)
    .setAlpha(0);

  // --- Label text (engraved look) ---
  const label = scene.add.text(x, y, text, {
    fontFamily: "Georgia",
    fontSize: "19px",
    color: "#f7e6b4",
    fontStyle: "bold",
    shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 2, fill: true },
  })
    .setOrigin(0.5)
    .setDepth(9)
    .setAlpha(0);

  // --- Fade-in and shimmer animation ---
  scene.tweens.add({
    targets: [plate, label, glow, leftGem, rightGem],
    alpha: 1,
    duration: 600,
    ease: "Cubic.easeOut",
  });

  // --- Gentle shimmer loop for text (optional) ---
  scene.tweens.add({
    targets: label,
    alpha: { from: 1, to: 0.8 },
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
}

// ================================
// Core question handling
// ================================
function askQuestion(topic, scene, isCustom = false, text = "") {
  if (!currentSoul || !dialogueText) return;

  // --- Custom emotional questions ---
  if (isCustom) {
    const emotion = getSoulEmotion(currentSoul);
    const sin = currentSoul.mask?.toLowerCase() || "default";
    const { virtue = 0, vice = 0, regret = 0, desire = 0 } = currentSoul.ledger || {};
    const balance = virtue - vice;

    let effect = maskReactTruth;
// 🗣️ “How do you feel about what happened?”
if (text.toLowerCase().includes("feel")) {

  // --- Sin-specific emotional shades ---
  if (sin === "lust") {
    reply = regret > 5
      ? "“It hurts... not the dying, but knowing I loved for all the wrong reasons.”"
      : "“I still crave the warmth that’s long gone.”";
     effect = (s) => maskReactLie(s, "flicker");
  }

  else if (sin === "greed") {
    reply = vice > virtue
      ? "“Empty hands feel heavier than gold ever did.”"
      : "“I counted everything—except what mattered.”";
    effect = (s) => maskReactLie(s, "crack");
  }

  else if (sin === "pride") {
    reply = regret > 3
      ? "“I thought I could face death unbowed... I was wrong.”"
      : "“Even now, I refuse to kneel.”";
    effect = (s) => maskReactLie(s, "smolder");
  }

  else if (sin === "envy") {
    reply = regret > 4
      ? "“Their light blinded me. Now all I see is the shadow I cast.”"
      : "“I still wonder why it was never me.”";
    effect = (s) => maskReactLie(s, "flicker");
  }

  else if (sin === "wrath") {
    reply = regret > 5
      ? "“It burns quieter now… but it still burns.”"
      : "“They deserved what came to them. Every last spark.”";
    effect = regret > 5 ? maskReactTruth : (s) => maskReactLie(s, "smolder");
  }

  else if (sin === "sloth") {
    reply = "“I felt nothing then. I feel even less now.”";
    effect = (s) => maskReactLie(s, "fade");
  }

  else if (sin === "gluttony") {
    reply = "“I filled the void, but it only grew. Even death couldn’t satisfy it.”";
    effect = (s) => maskReactLie(s, "flicker");
  }

  else {
    reply = "“It still burns. Even now, beneath the calm.”";
    effect = (s) => maskReactLie(s, "crack");
  }
}


// 🕯️ “Do you regret what you’ve done?”
else if (text.toLowerCase().includes("regret")) {
  const regret = currentSoul.ledger.regret;
  const sin = currentSoul.ledger.sinType.toLowerCase();

  if (regret >= 8) {
    if (sin === "wrath") {
      reply = "“Everything. Every scream, every act of vengeance. It didn’t heal anything.”";
      maskReactLie(scene, "crack"); // deep emotional fracture
    }
    else if (sin === "lust") {
      reply = "“Everything. Especially the way I mistook desire for love.”";
      maskReactLie(scene, "pulse"); // lust / aching remorse
    }
    else if (sin === "greed") {
      reply = "“Everything. The things I hoarded only hollowed me out.”";
      maskReactLie(scene, "swirl");
    }
    else if (sin === "envy") {
      reply = "“Everything. I spent my life chasing someone else’s reflection.”";
      maskReactLie(scene, "flicker");
    }
    else if (sin === "sloth") {
      reply = "“Everything. The years I wasted pretending I still had time.”";
      maskReactLie(scene, "tremor");
    }
    else if (sin === "gluttony") {
      reply = "“Everything. I consumed until nothing could fill me anymore.”";
      maskReactLie(scene, "swirl");
    }
    else if (sin === "pride") {
      reply = "“Everything. Especially the belief that I could never be wrong.”";
      maskReactLie(scene, "distort");
    }
    else {
      reply = "“Everything. My choices were my own undoing.”";
      maskReactLie(scene, "shatter");
    }
  }

  else if (regret >= 6) {
    if (sin === "pride") {
      reply = "“That I couldn’t kneel when it mattered most.”";
      maskReactLie(scene, "distort");
    }
    else if (sin === "wrath") {
      reply = "“That rage felt simpler than forgiveness.”";
      maskReactLie(scene, "smolder");
    }
    else if (sin === "sloth") {
      reply = "“That I let time slip away — I thought there would always be more.”";
      maskReactLie(scene, "fade");
    }
    else if (sin === "gluttony") {
      reply = "“That I filled the emptiness instead of facing it.”";
      maskReactLie(scene, "swirl");
    }
    else if (sin === "lust") {
      reply = "“That I hurt those who only wanted to love me.”";
      maskReactLie(scene, "pulse");
    }
    else if (sin === "greed") {
      reply = "“That I measured worth by what I owned, not what I gave.”";
      maskReactLie(scene, "crack");
    }
    else if (sin === "envy") {
      reply = "“That I forgot who I was while staring at someone else.”";
      maskReactLie(scene, "tremor");
    }
    else {
      reply = "“That I never learned to stop before it was too late.”";
      maskReactLie(scene, "waver");
    }
  }

  else if (regret >= 4) {
    if (sin === "wrath") {
      reply = "“Sometimes... but in the moment, I thought it was justice.”";
      maskReactLie(scene, "smolder");
    }
    else if (sin === "lust") {
      reply = "“Regret? Maybe. But love was all I knew how to give.”";
      maskReactLie(scene, "distort");
    }
    else if (sin === "greed") {
      reply = "“I regret being caught more than what I did.”";
      maskReactLie(scene, "smolder");
    }
    else if (sin === "envy") {
      reply = "“Regret doesn’t undo the bitterness.”";
      maskReactLie(scene, "flicker");
    }
    else if (sin === "sloth") {
      reply = "“A little. But I was so tired... so tired.”";
      maskReactLie(scene, "fade");
    }
    else if (sin === "gluttony") {
      reply = "“At times. Between the laughter and the silence.”";
      maskReactLie(scene, "swirl");
    }
    else if (sin === "pride") {
      reply = "“Regret is for the weak, or so I once told myself.”";
      maskReactLie(scene, "crack");
    }
    else {
      reply = "“I don’t know if regret changes anything anymore.”";
      maskReactLie(scene, "waver");
    }
  }

  else {
    if (sin === "wrath") {
      reply = "“No. I’d do it all again if it meant proving I was right.”";
      maskReactLie(scene, "fade");
    }
    else if (sin === "lust") {
      reply = "“No. Love, even when ruined, was still worth it.”";
      maskReactLie(scene, "pulse");
    }
    else if (sin === "greed") {
      reply = "“No. The world took, I simply took back.”";
      maskReactLie(scene, "swirl");
    }
    else if (sin === "envy") {
      reply = "“No. I only wanted what was mine.”";
      maskReactLie(scene, "flicker");
    }
    else if (sin === "sloth") {
      reply = "“No. It was easier not to feel anything at all.”";
      maskReactLie(scene, "fade");
    }
    else if (sin === "gluttony") {
      reply = "“No. I lived full — that’s more than most can say.”";
      maskReactLie(scene, "swirl");
    }
    else if (sin === "pride") {
      reply = "“No. I regret nothing, and that’s my curse.”";
      maskReactLie(scene, "distort");
    }
    else {
      reply = "“No. Regret is for those who still hope.”";
      maskReactLie(scene, "glitch");
    }
  }
}


    // 💔 “What did you really want?”
    else if (text.toLowerCase().includes("want")) {
      if (sin === "lust") {
        if (desire > 6)
          reply = "“To be loved without fear.”";
        else
          reply = "“To be seen… even if it burned.”",
          effect = (s) => maskReactLie(s, "crack");
      } else if (sin === "greed") {
        if (balance > 1)
          reply = "“Security. Not gold — just safety.”";
        else
          reply = "“Everything. Until there was nothing left.”",
          effect = (s) => maskReactLie(s, "distort");
      } else if (sin === "pride") {
        if (virtue > vice)
          reply = "“Recognition. To prove I mattered.”";
        else
          reply = "“To be above them all, even as I fell.”",
          effect = (s) => maskReactLie(s, "distort");
      } else if (sin === "envy") {
        reply = "“To have what they had— not out of hate, but longing.”";
         effect = (s) => maskReactLie(s, "fade");
      } else if (sin === "wrath") {
        reply = regret > 4
          ? "“Peace. I just wanted peace.”"
          : "“To make them feel what I felt.”",
          effect = regret < 3 ? (s) => maskReactLie(s, "crack") : maskReactTruth;
      } else if (sin === "sloth") {
        reply = "“Purpose. I waited for meaning instead of creating it.”",
        effect = (s) => maskReactLie(s, "fade");
      } else if (sin === "gluttony") {
        reply = "“Comfort. To fill the quiet with something. anything.”",
        effect = (s) => maskReactLie(s, "distort");
      } else {
        reply = "“Peace… or maybe just an ending.”";
      }
    }

    // Optional Book of Life flicker during emotional resonance
    const bookEl = document.querySelector("#book-popup");
    if (bookEl?.classList.contains("show")) {
      bookEl.style.boxShadow = "0 0 12px 4px rgba(255, 215, 128, 0.5)";
      setTimeout(() => { bookEl.style.boxShadow = ""; }, 800);
    }

    dialogueText.setText(`${currentSoul.name}: ${reply}`);
    effect(scene);
    return;
  }

  // --- Structured topics ---
if (topic === "death") {
  let emotionLine = "";

  switch (currentSoul.ledger.sinType) {
    case "Greed":
      emotionLine = "Even at the end, I tried to hold onto something— papers, gold, anything. But my hands were too weak to close around it.";
       maskReactLie(scene, "fade");
      break;
    case "Wrath":
      emotionLine = "It wasn’t the enemy that killed me..it was the fire I carried inside. I remember shouting until my throat tore.";
       maskReactLie(scene, "fade");
      break;
    case "Envy":
      emotionLine = "I drank to silence the comparisons. Even as the poison spread, I thought of them. still winning, still shining.";
       maskReactLie(scene, "smolder");
      break;
    case "Sloth":
      emotionLine = "It wasn’t sudden. It was slow... like falling asleep and never waking. I stopped moving long before I died.";
       maskReactLie(scene, "tremor");
      break;
    case "Gluttony":
      emotionLine = "There was laughter, warmth, and wine. Then a sharp pain and silence. I thought I could fill the emptiness, but it only grew.";
       maskReactLie(scene, "tremor");
      break;
    case "Lust":
      emotionLine = "It ended as all things I touched did— beautifully, tragically. I remember his eyes more than the knife.";
       maskReactLie(scene, "distort");
      break;
    case "Pride":
      emotionLine = "The fall was not from the tower, it was from grace. I’d rather die than admit I was wrong. And so I did.";
       maskReactLie(scene, "distort");
      break;
    default:
      emotionLine = "I remember the cold first, not the pain.";
  }

  reply = emotionLine 

  // optional: mask reaction (can stay same)
  if (
    (currentSoul.isGuilty && currentSoul.cause && currentSoul.deathCert?.toLowerCase().includes("suspicious")) ||
    (currentSoul.cause && currentSoul.cause.toLowerCase().includes("suspicious"))
  ) {
    maskReactLie(scene, "smolder");
  }
}

 // --- 📖 Topic cross-check --- //
else if (topic === "topic") {
  scene.inConfrontation = true;
  startConfrontation(scene);
  return; // ⬅️ prevent overwriting with old dialogue
}

// --- 📖 Book of Life cross-check --- //
else if (topic === "book") {
  const emotion = getSoulEmotion(currentSoul);
  const balance = (currentSoul.ledger?.virtue || 0) - (currentSoul.ledger?.vice || 0);
  const truth = currentSoul.truth || "Unrecorded truth.";
  const bookNote = currentSoul.bookNote || "The record glows faintly, undecipherable.";
  let effect = maskReactTruth;
  let reply = "";

  if (!currentSoul.bookPages || currentSoul.bookPages.length === 0) {
    dialogueText.setText(`${currentSoul.name}: "The pages... they won’t open for me."`);
    maskReactLie(scene, "smolder");
    return;
  }

  if (emotion === "calm") {
    reply = `“You can read it, can’t you? ${truth}... I wrote it myself once.”`;
  } 
  else if (emotion === "conflicted") {
    reply = `“That record... it twists what I remember. ${bookNote} It wasn’t all lies.”`;
  } 
  else if (emotion === "defensive") {
    reply = `“You think you know me just because of ink and gold? That book doesn’t feel the pain I did.”`;
    effect = (s) => maskReactLie(s, "distort");
  } 
  else if (balance < 0) {
    reply = `“The book keeps bleeding through the pages. Every line I denied is written there now.”`;
    effect = (s) => maskReactLie(s, "crack");
  } 
  else {
    reply = `“Read it aloud, if you dare. The book remembers what I tried to forget.”`;
  }

  // open Book of Life with questions (consulting mode)
  consultBook(currentSoul);

  dialogueText.setText(`${currentSoul.name}: ${reply}`);
  effect(scene);
  return;
}

// =============================
// Start Confrontation
// =============================
function startConfrontation(scene) {
  console.log("✅ startConfrontation entered");

  const soulName = currentSoul?.name || "???";
  dialogueText.setText(`${soulName}: "You want to know WHY I did it?"`);
  dialogueText.setVisible(true);
  dialogueText.setAlpha(1);

  // Disable other question buttons temporarily
  questionButtons.forEach(b => {
    if (b.disableInteractive) b.disableInteractive();
  });

  // Clear previous confrontation buttons
  if (scene.confrontButtons) {
    scene.confrontButtons.forEach(b => b.destroy());
  }
  scene.confrontButtons = [];

  // Generate responses dynamically for this soul
  const responses = generateSoulConfrontation(currentSoul);
  const baseY = 620;

  responses.forEach((r, i) => {
    const btn = scene.add.text(600, baseY + i * 40, r.text, {
      fontFamily: "Georgia",
      fontSize: "16px",
      color: "#f6e6b2",
      backgroundColor: "rgba(20, 18, 34, 0.8)",
      padding: { left: 10, right: 10, top: 6, bottom: 6 },
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 1, fill: true },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(20)
      .on("pointerover", () =>
        btn.setStyle({ backgroundColor: "rgba(40, 30, 60, 0.9)" })
      )
      .on("pointerout", () =>
        btn.setStyle({ backgroundColor: "rgba(20, 18, 34, 0.8)" })
      )
      .on("pointerdown", () => handleConfrontChoice(scene, r.correct));

    scene.confrontButtons.push(btn);
  });
}

// =============================
// Handle Confrontation Choice
// =============================
function handleConfrontChoice(scene, correct) {
  // Remove buttons after choosing
  scene.confrontButtons.forEach(b =>
    scene.tweens.add({
      targets: b,
      alpha: 0,
      duration: 300,
      onComplete: () => b.destroy(),
    })
  );

  if (correct) {
    dialogueText.setText(`${currentSoul.name}: "No... that’s not true—"`);
    maskReactLie(scene, "crack");

    scene.time.delayedCall(1000, () => {
      dialogueText.setText("The mask fractures slightly — truth struggles to surface.");
    });
  } else {
    dialogueText.setText(`${currentSoul.name}: "You don’t understand me at all."`);
    maskReactLie(scene, "distort");

    scene.time.delayedCall(1200, () => {
      dialogueText.setText("The air thickens with silence — the soul retreats inward.");
    });
  }

  scene.time.delayedCall(1500, () => {
    questionButtons.forEach(b => {
      if (b.setInteractive) b.setInteractive();
    });
  });
}

  function generateSoulConfrontation(soul) {
    // Each soul gets their own set of responses
    switch (soul.id) {
      case "S1": // Alden Marrick
        return [
          { text: "You claimed generosity, but the books tell of greed.", correct: true },
          { text: "All your donations were for admiration, weren’t they?", correct: true },
          { text: "You were selfless in life, yes?", correct: false },
        ];
      case "S2": // Darren Holt
        return [
          { text: "You said you kept calm, yet your wrath led to death.", correct: true },
          { text: "Your fury endangered those you swore to protect.", correct: true },
          { text: "You acted only with peace in mind, correct?", correct: false },
        ];
      case "S3": // Liora Faen
        return [
          { text: "You envied your rival, hiding it behind civility.", correct: true },
          { text: "Your letters reveal obsession, not pure intent.", correct: true },
          { text: "You felt nothing but admiration for others.", correct: false },
        ];
      case "S4": // Gareth Runn
        return [
          { text: "You claimed diligence, but isolation consumed you.", correct: true },
          { text: "Neglect became your companion, not work.", correct: true },
          { text: "Your efforts never faltered?", correct: false },
        ];
      case "S5": // Emric Halden
        return [
          { text: "You feasted while ignoring moderation, your gluttony killed you.", correct: true },
          { text: "Your indulgence harmed none but yourself?", correct: false },
          { text: "Even excess was disguised as charity?", correct: true },
        ];
      case "S6": // Selene Vayne
        return [
          { text: "You loved too freely, leaving ruin in your wake.", correct: true },
          { text: "Your desire was pure, never harmful?", correct: false },
          { text: "The hearts you collected became your prison.", correct: true },
        ];
      case "S7": // Luna Drae
        return [
          { text: "Your pride ignored the hands reaching for you.", correct: true },
          { text: "You fell not from the tower, but from arrogance.", correct: true },
          { text: "You welcomed help and guidance?", correct: false },
        ];
      default:
        // Fallback generic responses
        return [
          { text: "You claimed innocence, yet the Book disagrees.", correct: true },
          { text: "You acted with only pure intent?", correct: false },
          { text: "Nothing you did matters anymore.", correct: false },
        ];
    }
  }


  dialogueText.setText(`${currentSoul.name}: "${reply}"`);
}

// ================================
// Soul emotion & response logic
// ================================

function getSoulEmotion(soul) {
  const balance = (soul.ledger?.virtue || 0) - (soul.ledger?.vice || 0);
  if (balance >= 5) return "calm";
  if (balance >= 0) return "conflicted";
  if (balance <= -3) return "defensive";
  return "wrathful";
}

function getSoulReaction(soul, emotion, questionText) {
  const sin = soul.mask?.toLowerCase() || "default";
  let text = "";
  let effect = maskReactTruth;

  switch (emotion) {
    case "calm":
      text = calmResponse(sin); break;
    case "conflicted":
      text = conflictedResponse(sin);
      effect = (s) => maskReactLie(s, "waver"); break;
    case "defensive":
      text = defensiveResponse(sin);
      effect = (s) => maskReactLie(s, "distort"); break;
    case "wrathful":
      text = wrathfulResponse(sin);
      effect = (s) => maskReactLie(s, "crack"); break;
  }

  return { text, effect };
}

// ================================
// Mask reactions (expanded)
// ================================
function maskReactLie(scene, type) {
  if (!maskSprite) return;

  switch (type) {
    // 💔 Crack — fracture or emotional break
    case "crack":
      if (maskSprite.crack) {
        maskSprite.crack.setVisible(true).alpha = 0.9;
        scene.tweens.add({
          targets: maskSprite.crack,
          alpha: 0,
          duration: 1200,
          onComplete: () => maskSprite.crack.setVisible(false),
        });
      }
      scene.tweens.add({
        targets: maskSprite,
        x: maskSprite.x + 6,
        duration: 60,
        yoyo: true,
        repeat: 2,
      });
      break;

    // 🔥 Smolder — lingering anger or suppressed passion
    case "smolder":
      maskSprite.setTint(0xff4400);
      scene.time.delayedCall(1000, () => maskSprite.setTint(0xffffff));
      scene.tweens.add({
        targets: maskSprite,
        angle: 3,
        duration: 100,
        yoyo: true,
        repeat: 4,
      });
      break;

    // 🌫️ Distort — pride or deception bending reality
    case "distort":
      maskSprite.setTint(0x99ccff);
      scene.time.delayedCall(900, () => maskSprite.setTint(0xffffff));
      scene.tweens.add({
        targets: maskSprite,
        scaleX: 0.75,
        scaleY: 0.9,
        duration: 120,
        yoyo: true,
        repeat: 3,
      });
      break;

    // ✨ Waver — doubt or emotional hesitation
    case "waver":
      maskSprite.setTint(0xffff99);
      scene.time.delayedCall(600, () => maskSprite.setTint(0xffffff));
      scene.tweens.add({
        targets: maskSprite,
        angle: 1.5,
        duration: 100,
        yoyo: true,
        repeat: 3,
      });
      break;

    // 💓 Pulse — lust/desire heartbeat
    case "pulse":
      maskSprite.setTint(0xff6699);
      scene.time.delayedCall(700, () => maskSprite.setTint(0xffffff));
      scene.tweens.add({
        targets: maskSprite,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 120,
        yoyo: true,
        repeat: 4,
      });
      break;

    // ⚡ Flicker — envy, jealousy, instability
    case "flicker":
      scene.tweens.add({
        targets: maskSprite,
        alpha: 0.3,
        yoyo: true,
        repeat: 5,
        duration: 80,
      });
      break;

    // 🌙 Fade — sloth, emptiness, exhaustion
    case "fade":
      maskSprite.setAlpha(0.6);
      scene.tweens.add({
        targets: maskSprite,
        alpha: 1,
        duration: 1000,
        ease: "Sine.easeInOut",
      });
      break;

    // 🌪️ Swirl — gluttony, overconsumption or chaos
    case "swirl":
      scene.tweens.add({
        targets: maskSprite,
        angle: 360,
        duration: 800,
        ease: "Cubic.easeOut",
      });
      maskSprite.setTint(0xffcc66);
      scene.time.delayedCall(800, () => maskSprite.setTint(0xffffff));
      break;

    // 💥 Tremor — fear, instability, denial
    case "tremor":
      scene.tweens.add({
        targets: maskSprite,
        x: maskSprite.x + 2,
        duration: 40,
        yoyo: true,
        repeat: 8,
      });
      break;

    // 🔮 Glitch — lies, confusion, or distorted memory
    case "glitch":
      scene.tweens.add({
        targets: maskSprite,
        scaleX: 1.3,
        scaleY: 0.8,
        duration: 50,
        yoyo: true,
        repeat: 6,
      });
      maskSprite.setTint(0x00ffff);
      scene.time.delayedCall(500, () => maskSprite.setTint(0xffffff));
      break;

    // 🩸 Shatter — truth violently surfacing
    case "shatter":
      if (maskSprite.crack) {
        maskSprite.crack.setVisible(true).alpha = 1;
        scene.tweens.add({
          targets: maskSprite.crack,
          alpha: 0,
          duration: 1600,
          onComplete: () => maskSprite.crack.setVisible(false),
        });
      }
      scene.tweens.add({
        targets: maskSprite,
        scaleX: 1.4,
        scaleY: 0.6,
        duration: 120,
        yoyo: true,
        repeat: 3,
      });
      break;

    default:
      maskSprite.setTint(0xffffff);
      break;
  }
}


function maskReactTruth(scene) {
  if (!maskSprite) return;
  maskSprite.setTint(0x88ff88);
  scene.time.delayedCall(700, () => maskSprite.setTint(0xffffff));
}

// Simple contradiction helper
function contradictionBetween(a, b) {
  if (!a || !b) return false;
  return a.toLowerCase() !== b.toLowerCase();
}

// ---------------- DECISIONS ----------------
function makeDecision(decision, scene) {
  if (!currentSoul) return;

  // --- Step 1: Judge the soul based on their ledger ---
  const { virtue, vice, regret, memory, balance, sinType } = currentSoul.ledger;

  // Calculate morality score
  let moralityScore = balance + (regret * 0.3) - (memory * 0.2);
  const sinWeights = {
    Pride: -2,
    Greed: -3,
    Lust: -2,
    Envy: -2,
    Wrath: -3,
    Gluttony: -1,
    Sloth: -1,
  };
  moralityScore += sinWeights[sinType] || 0;

  // Determine the soul's deserved fate
  let deservedFate;
  if (moralityScore >= 2) deservedFate = "redeem";
  else if (moralityScore >= -1) deservedFate = "uncertain";
  else deservedFate = "condemn";

  // Determine correctness based on player choice vs ledger judgment
  const correct =
    (decision === "redeem" && deservedFate === "redeem") ||
    (decision === "condemn" && deservedFate === "condemn");

  // --- Step 2: Narrative flavor ---
  let verdictText = "";
  if (decision === "redeem") {
    if (deservedFate === "redeem") verdictText = `${currentSoul.name} ascends — redemption recognized.`;
    else if (deservedFate === "uncertain") verdictText = `${currentSoul.name} fades into mist... neither saved nor lost.`;
    else verdictText = `${currentSoul.name} sinks below, the mercy undeserved.`;
  } else {
    if (deservedFate === "condemn") verdictText = `${currentSoul.name} is cast into shadow — justice fulfilled.`;
    else if (deservedFate === "uncertain") verdictText = `${currentSoul.name} trembles as judgment hesitates...`;
    else verdictText = `${currentSoul.name} vanishes — a righteous soul wrongly damned.`;
  }

// --- Step 3: Corruption adjustments ---
if (!correct) {
    corruptionLevel += 15;
} else {
    corruptionLevel = Math.max(0, corruptionLevel - 5);
}

// heavier sins
if (sinType === "Wrath" || sinType === "Greed") corruptionLevel += 2;

// clamp to 0–100
corruptionLevel = Phaser.Math.Clamp(corruptionLevel, 0, 100);

// --- Update corruption bar immediately ---
if (corruptionBarFill) {
    corruptionBarFill.width = (corruptionLevel / 100) * 200;
}

  // --- Step 4: Counters ---
  if (decision === "redeem") redeemCount++;
  if (decision === "condemn") condemnCount++;
  soulsJudged++;

  // --- Step 5: Save record to log + backend ---
  const verdictRecord = {
    id: currentSoul.id,
    name: currentSoul.name,
    mask: currentSoul.mask,
    sin: sinType,
    decision,
    deservedFate,
    correct,
    moralityScore: Math.round(moralityScore * 10) / 10,
    corruption: Math.round(corruptionLevel),
  };

  decisionsLog.push(verdictRecord);
  saveJudgmentToServer(verdictRecord).catch(() => {});

  // --- Step 6: Feedback text on screen ---
  dialogueText.setText(verdictText);

  // Optional: show extra flavor text after delay
  const reason =
    deservedFate === "redeem"
      ? `Their remorse outweighed the sin of ${sinType.toLowerCase()}.`
      : deservedFate === "uncertain"
      ? `The scales waver — virtue and vice entwined.`
      : `The weight of ${sinType.toLowerCase()} drowned their light.`;

  scene.time.delayedCall(900, () => {
    dialogueText.setText(reason);
  });

  // --- Step 7: Transition to next soul or end ---
  if (soulsJudged >= maxSouls) {
    endGameDashboard(scene);
  } else {
    scene.time.delayedCall(1600, () => loadSoul(scene));
  }
}

function autoCondemn(scene) {
    if (!currentSoul) return;
    makeDecision("condemn", scene);
}

// ---------------- BACKEND (Laravel) HOOK ----------------
async function saveJudgmentToServer(payload) {
  // payload: {id, name, mask, sin, decision, deservedFate, correct, moralityScore, corruption}
  // Example Laravel API call:
  /*
  await fetch('/api/judgment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': window.csrfToken || '' },
    body: JSON.stringify(payload)
  });
  */
  return Promise.resolve({ ok: true });
}

// ---------------- END GAME / BRANCHING ----------------
function endGameDashboard(scene) {
  if (timerTween) {
    try { timerTween.stop(); } catch (e) {}
    timerTween = null;
  }

  if (scene.activeBookUI) {
    scene.activeBookUI();
    scene.activeBookUI = null;
  }

 questionButtons.forEach(b => { try { b.destroy(); } catch(e){} });
questionButtons = [];

// --- Hide Investigation/Reflection titles ---
scene.children.list.forEach(obj => {
if (
    (obj.text && (obj.text.includes("Investigation") || obj.text.includes("Reflection"))) ||
    (obj.fillColor === 0x2a2640 && obj.width === 250) || // the plate
    (obj.fillColor === 0xeedb9e && obj.width === 270) || // the glow
    (obj.fillColor === 0xffe58a && obj.geom?.type === Phaser.Geom.TRIANGLE) // the triangles
  ) {obj.setVisible(false);
  }
});

// --- Hide dialogue quote (like “The weight of lust drowned their light.”) ---
if (dialogueText) {
  dialogueText.setVisible(false);
}

// Updated rectangle to fit new 1200x720 canvas
scene.add.rectangle(600, 360, 1200, 720, 0x000000, 0.9);


  if (maskSprite) {
    maskSprite.setVisible(false);
    if (maskSprite.crack) maskSprite.crack.setVisible(false);
  }

  let summary = `Final Judgment — The Verdict\n\n`;
  summary += `Souls Redeemed: ${redeemCount}\n`;
  summary += `Souls Condemned: ${condemnCount}\n`;
  summary += `Corruption: ${Math.round(corruptionLevel)}%\n\n`;

  let endingTitle = "";
  let endingText = "";

  if (corruptionLevel >= 80) {
    endingTitle = "Corrupted Arbiter";
    endingText = "The scales shattered beneath bias and pride. You join those you once judged.";
  } else if (condemnCount > redeemCount + 2) {
    endingTitle = "Harbinger of Doom";
    endingText = "Justice without mercy turned to vengeance.";
  } else if (redeemCount > condemnCount + 2) {
    endingTitle = "Blind Redeemer";
    endingText = "Mercy without wisdom doomed many anew.";
  } else {
    endingTitle = "Judge of Balance";
    endingText = "You held the line — mercy and wrath in harmony.";
  }

  const full = `== ${endingTitle} ==\n\n${endingText}\n\nDetailed Record:\n` +
    decisionsLog.map((d, i) => {
      return `${i + 1}. ${d.name} (${d.sin}) — ${d.decision.toUpperCase()} — ${d.deservedFate.toUpperCase()} — ${d.correct ? "✔" : "✖"} — Score: ${d.moralityScore}`;
    }).join("\n");

  // Updated positions for 1200x720
  scene.add
    .text(600, 150, endingTitle, {
      fontSize: "28px",
      fill: "#ffffff",
      align: "center",
      wordWrap: { width: 1000 },
    })
    .setOrigin(0.5);

  scene.add
    .text(600, 220, full, {
      fontSize: "16px",
      fill: "#ffffff",
      align: "left",
      wordWrap: { width: 1000 },
    })
    .setOrigin(0.5, 0);

  // Optional: send final result to backend
  /*
  fetch('/api/game-end', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': window.csrfToken || '' },
    body: JSON.stringify({ endingTitle, corruptionLevel, decisionsLog })
  });
  */
} 
};
