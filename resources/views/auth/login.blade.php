<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Login — The Last Verdict</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @vite('resources/css/app.css')
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=IM+Fell+English+SC&display=swap');

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
            color: #e0d8b0;
            overflow: hidden;
            position: relative;
            animation: ambientPulse 10s infinite ease-in-out;
        }

        @keyframes ambientPulse {
            0%,100% { background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%); }
            50% { background: radial-gradient(circle at center, #242018 0%, #0a0a0a 100%); }
        }

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

        .login-container {
            position: relative;
            z-index: 2;
            text-align: center;
            background: rgba(0, 0, 0, 0.45);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            box-shadow: 0 0 25px rgba(255, 255, 200, 0.15), inset 0 0 20px rgba(255, 255, 200, 0.05);
            padding: 3rem 3.5rem;
            width: 420px;
            animation: fadeIn 1.5s ease-out;
        }

        h1 {
            font-family: 'Cinzel Decorative', serif;
            font-size: 2.4rem;
            color: #f2c94c;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 15px rgba(242, 201, 76, 0.5);
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
        }

        form {
            text-align: left;
        }

        label {
            font-family: 'IM Fell English SC', serif;
            color: #d8d2b0;
            font-size: 1.1rem;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            margin-top: 0.4rem;
            padding: 0.7rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 0.4rem;
            color: #747474;
            font-family: 'IM Fell English SC', serif;
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        input:focus {
            outline: none;
            border-color: #f2c94c;
            box-shadow: 0 0 10px rgba(242, 201, 76, 0.3);
        }

        .remember {
            margin-top: 1rem;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
            color: #bfbfbf;
        }

        .remember input {
            margin-right: 0.4rem;
            accent-color: #f2c94c;
        }

        .links {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1.5rem;
        }

        .links a {
            font-size: 0.9rem;
            color: #c8c8c8;
            text-decoration: none;
            transition: 0.2s;
        }

        .links a:hover {
            color: #f2c94c;
        }

        button {
            background: linear-gradient(145deg, #f2c94c, #c49b0b);
            color: #0a0a0a;
            font-family: 'Cinzel Decorative', serif;
            font-weight: 600;
            padding: 0.7rem 2rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px rgba(242, 201, 76, 0.6);
        }

        button:hover {
            background: linear-gradient(145deg, #ffdf75, #d4ad1a);
            box-shadow: 0 0 25px rgba(242, 201, 76, 1);
            transform: scale(1.05);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

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

           
    /* ✨ NEW Back Home button styled to match theme */
    .back-home-wrapper {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 1000;
    }

    .back-home-btn {
      display: inline-block;
      font-family: 'Cinzel Decorative', serif;
      font-weight: 600;
      color: #f2c94c;
      background: rgba(0,0,0,0.4);
      border: 1px solid rgba(242,201,76,0.3);
      padding: 0.6rem 1.5rem;
      border-radius: 999px;
      text-decoration: none;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(242,201,76,0.2);
      backdrop-filter: blur(3px);
    }

    .back-home-btn:hover {
      background: rgba(242,201,76,0.1);
      color: #fff3b0;
      box-shadow: 0 0 20px rgba(242,201,76,0.6);
      transform: scale(1.05);
    }
    </style>
</head>

<body>
    <div class="fog"></div>
    <div class="rays"></div>

    <div class="login-container">
        <h1>Enter the Hall</h1>

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <div class="mt-2">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" :value="old('email')" required autofocus autocomplete="username">
            </div>

            <div class="mt-4">
                <label for="password">Password</label>
                <input id="password" type="password" name="password" required autocomplete="current-password">
            </div>

            <div class="remember">
                <input id="remember_me" type="checkbox" name="remember">
                <label for="remember_me">{{ __('Remember me') }}</label>
            </div>

            <div class="links">
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}">{{ __('Forgot your password?') }}</a>
                @endif
                <button type="submit">{{ __('Log In') }}</button>
            </div>
        </form>
    </div>

         <div class="back-home-wrapper">
        <a href="{{ route('menu') }}" class="back-home-btn">← Return to Gate</a>
  </div>

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
