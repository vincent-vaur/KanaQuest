/**
 * Retourne un nombre aléatoire dans l'interval donné
 */
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Mega confetti
 * @see https://confetti.js.org/more.html#fireworks
 */
function megaConfetti() {
  const duration = 10 * 1000,
    animationEnd = Date.now() + duration,
    defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      shapes: ["star"],
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"]
    };

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );

    confetti(
      Object.assign({}, defaults, {
        particleCount: 10,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        scalar: 0.75,
        shapes: ["circle"]
      })
    );
  }, 250);
}

/**
 * Confetti normal
 * @see https://confetti.js.org/more.html#cannon
 */
function normalConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}
