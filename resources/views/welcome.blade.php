<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>The Last Verdict</title>
  @vite('resources/css/app.css')
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=IM+Fell+English+SC&display=swap');

    body {
      margin: 0;
      background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
      color: #e0d8b0;
      min-height: 100vh;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      animation: ambientPulse 10s infinite ease-in-out;
    }

    @keyframes ambientPulse {
      0%,100% { background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%); }
      50% { background: radial-gradient(circle at center, #242018 0%, #0a0a0a 100%); }
    }

    /* Subtle moving fog */
    .fog {
      position: absolute;
      top: 0; left: 0;
      width: 200%;
      height: 200%;
      background: url('https://i.ibb.co/wNqRjxT/fog.png') repeat;
      background-size: cover;
      opacity: 0.06;
      animation: fogMove 60s linear infinite;
      pointer-events: none;
      z-index: 0;
    }
    @keyframes fogMove {
      from { transform: translate3d(0,0,0); }
      to { transform: translate3d(-50%, -50%, 0); }
    }

    /* Divine light rays */
    .rays {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at top center, rgba(255,255,200,0.2) 0%, transparent 70%);
      filter: blur(15px);
      mix-blend-mode: overlay;
      animation: rayPulse 8s ease-in-out infinite;
      z-index: 1;
    }
    @keyframes rayPulse {
      0%,100% { opacity: 0.2; }
      50% { opacity: 0.4; }
    }

    /* Container and title */
    .container {
      position: relative;
      text-align: center;
      padding: 3rem 5rem;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      background: rgba(0,0,0,0.3);
      box-shadow: 0 0 30px rgba(255,255,200,0.1), inset 0 0 20px rgba(255,255,200,0.05);
      z-index: 2;
    }

    /* Floating sigil behind title */
    .sigil {
      position: absolute;
      top: -120px;
      left: 50%;
      width: 220px;
      height: 220px;
      transform: translateX(-50%);
      background: url('https://i.ibb.co/DVKHspp/sigil.png') no-repeat center/contain;
      opacity: 0.08;
      animation: spinSigil 80s linear infinite;
      z-index: 0;
    }
    @keyframes spinSigil {
      from { transform: translateX(-50%) rotate(0deg); }
      to { transform: translateX(-50%) rotate(360deg); }
    }

    h1 {
      font-family: 'Cinzel Decorative', serif;
      font-size: 4rem;
      color: #f2c94c;
      letter-spacing: 3px;
      margin-bottom: 1rem;
      text-shadow: 0 0 15px rgba(242, 201, 76, 0.5);
      position: relative;
      overflow: hidden;
      animation: fadeIn 2.5s ease-out;
    }

    /* Gold shimmer across title */
    h1::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent 0%, rgba(255,255,200,0.6) 50%, transparent 100%);
      animation: shimmer 5s infinite;
    }
    @keyframes shimmer {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }

    p {
      font-family: 'IM Fell English SC', serif;
      color: #d8d2b0;
      font-size: 1.3rem;
      margin-bottom: 2.5rem;
      animation: fadeIn 3s ease-out;
    }

    .buttons a,
    .buttons button {
      display: inline-block;
      margin: 0.7rem;
      padding: 0.9rem 2rem;
      border-radius: 0.7rem;
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.1rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      z-index: 2;
    }

    .btn-game {
      background: linear-gradient(145deg, #f2c94c, #c49b0b);
      color: #0a0a0a;
      box-shadow: 0 0 15px rgba(242, 201, 76, 0.7);
      border: none;
    }
    .btn-game:hover {
      background: linear-gradient(145deg, #ffdf75, #d4ad1a);
      box-shadow: 0 0 25px rgba(242, 201, 76, 1);
      transform: scale(1.05);
    }

    .btn-secondary {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.2);
      color: #f2f2f2;
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.4);
      transform: scale(1.03);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Floating glowing particles */
    .particle {
      position: absolute;
      background: radial-gradient(circle, rgba(242,201,76,0.8) 0%, transparent 70%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: float 12s infinite ease-in-out;
      opacity: 0.3;
      z-index: 0;
    }

    @keyframes float {
      0% { transform: translateY(0) translateX(0); opacity: 0.3; }
      50% { transform: translateY(-40px) translateX(20px); opacity: 0.7; }
      100% { transform: translateY(0) translateX(0); opacity: 0.3; }
    }
  </style>
</head>
<body>
  <div class="fog"></div>
  <div class="rays"></div>
  <div class="container">
    <div class="sigil"></div>
    <h1>⚖️ The Last Verdict</h1>
    <p>Judge the souls of the afterlife.<br>Your own fate hangs in the balance.</p>

    <div class="buttons">
      @if (Route::has('login'))
        @auth
          <a href="{{ route('game') }}" class="btn-game">Enter the Hall</a>

          <form method="POST" action="{{ route('logout') }}" style="display:inline;">
            @csrf
            <button type="submit" class="btn-secondary">Logout</button>
          </form>
        @else
          <a href="{{ route('login') }}" class="btn-secondary">Log In</a>
          @if (Route::has('register'))
            <a href="{{ route('register') }}" class="btn-secondary">Register</a>
          @endif
        @endauth
      @endif
    </div>
  </div>

  <!-- particle generator -->
  <script>
    const count = 25;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 12) + 's';
      document.body.appendChild(p);
    }
  </script>
</body>
</html>
