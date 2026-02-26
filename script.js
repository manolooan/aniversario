const openLetterBtn = document.getElementById('open-letter-btn');
const letterCard = document.getElementById('letter-card');
const typedText = document.getElementById('typed-text');
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');

const countdownElements = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

const startGameBtn = document.getElementById('start-game-btn');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const gameMessage = document.getElementById('game-message');

const prevPhotoBtn = document.getElementById('prev-photo');
const nextPhotoBtn = document.getElementById('next-photo');
const photoCards = [...document.querySelectorAll('.photo-card')];
const dotsWrapper = document.getElementById('carousel-dots');
const carousel = document.getElementById('carousel');

let letterWritten = false;
let score = 0;
let gameRunning = false;
let gameInterval;
let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;
let autoSlideInterval;

const letterContent = `Meu amor,\n\nHoje eu celebro a sua vida com o coração cheio de gratidão.\nVocê ilumina meus dias com seu sorriso e transforma o comum em algo mágico.\n\nQue neste novo ciclo você receba tudo o que sonha e mereça.\nEu quero estar ao seu lado em cada passo, te amando e te admirando sempre.\n\nFeliz aniversário, minha pessoa favorita. Eu te amo infinitamente. 💚`;

function typeLetter(text, speed = 34) {
  let index = 0;
  typedText.textContent = '';

  const typing = setInterval(() => {
    typedText.textContent += text[index];
    index += 1;

    if (index >= text.length) {
      clearInterval(typing);
    }
  }, speed);
}

openLetterBtn.addEventListener('click', () => {
  letterCard.classList.add('open');
  letterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  if (!letterWritten) {
    typeLetter(letterContent);
    letterWritten = true;
  }
});

musicBtn.addEventListener('click', async () => {
  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      musicBtn.textContent = 'Pausar música ⏸️';
    } else {
      bgMusic.pause();
      musicBtn.textContent = 'Tocar música de fundo 🎵';
    }
  } catch {
    musicBtn.textContent = 'Toque para permitir áudio 🔊';
  }
});

function updateCountdown() {
  const targetDate = new Date('2027-02-26T00:00:00-03:00').getTime();
  const now = Date.now();
  const difference = targetDate - now;

  if (difference <= 0) {
    Object.values(countdownElements).forEach((el) => {
      el.textContent = '00';
    });
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  countdownElements.days.textContent = String(Math.floor(difference / day)).padStart(2, '0');
  countdownElements.hours.textContent = String(Math.floor((difference % day) / hour)).padStart(2, '0');
  countdownElements.minutes.textContent = String(Math.floor((difference % hour) / minute)).padStart(2, '0');
  countdownElements.seconds.textContent = String(Math.floor((difference % minute) / 1000)).padStart(2, '0');
}

function createFloatingHeart(x, y) {
  const burst = document.createElement('span');
  burst.textContent = '💚';
  burst.style.position = 'absolute';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  burst.style.pointerEvents = 'none';
  burst.style.animation = 'floatHeart 1s ease forwards';
  gameArea.appendChild(burst);
  setTimeout(() => burst.remove(), 900);
}

function explodeHearts() {
  for (let i = 0; i < 20; i += 1) {
    setTimeout(() => {
      createFloatingHeart(
        Math.random() * (gameArea.clientWidth - 20),
        Math.random() * (gameArea.clientHeight - 20)
      );
    }, i * 70);
  }
}

function spawnHeart() {
  if (!gameRunning) return;

  const heartBtn = document.createElement('button');
  heartBtn.className = 'heart';
  heartBtn.type = 'button';
  heartBtn.textContent = '💚';

  const maxX = Math.max(gameArea.clientWidth - 48, 20);
  const maxY = Math.max(gameArea.clientHeight - 48, 20);
  heartBtn.style.left = `${Math.random() * maxX}px`;
  heartBtn.style.top = `${Math.random() * maxY}px`;

  const removeHeart = () => {
    if (heartBtn.parentNode) {
      heartBtn.remove();
    }
  };

  heartBtn.addEventListener('click', () => {
    score += 1;
    scoreDisplay.textContent = String(score);
    createFloatingHeart(heartBtn.offsetLeft, heartBtn.offsetTop);
    removeHeart();

    if (score >= 10) {
      gameMessage.textContent = 'Você desbloqueou um beijo infinito 💋';
      gameRunning = false;
      clearInterval(gameInterval);
      explodeHearts();
      return;
    }

    gameMessage.textContent = `Mais ${10 - score} coração(ões) para desbloquear 💚`;
  });

  gameArea.appendChild(heartBtn);
  setTimeout(removeHeart, 2200);
}

startGameBtn.addEventListener('click', () => {
  gameArea.innerHTML = '';
  score = 0;
  scoreDisplay.textContent = '0';
  gameMessage.textContent = 'Vamos lá!';
  gameRunning = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(spawnHeart, 550);
  spawnHeart();
});

const dots = photoCards.map((_, index) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Ir para foto ${index + 1}`);
  dot.addEventListener('click', () => showSlide(index));
  dotsWrapper.appendChild(dot);
  return dot;
});

function showSlide(index) {
  if (index < 0) {
    currentSlide = photoCards.length - 1;
  } else if (index >= photoCards.length) {
    currentSlide = 0;
  } else {
    currentSlide = index;
  }

  photoCards.forEach((card, cardIndex) => {
    card.classList.toggle('active', cardIndex === currentSlide);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentSlide);
  });
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 5500);
}

prevPhotoBtn.addEventListener('click', () => {
  showSlide(currentSlide - 1);
  resetAutoSlide();
});

nextPhotoBtn.addEventListener('click', () => {
  showSlide(currentSlide + 1);
  resetAutoSlide();
});

carousel.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].screenX;
  const delta = touchStartX - touchEndX;

  if (Math.abs(delta) > 40) {
    if (delta > 0) {
      showSlide(currentSlide + 1);
    } else {
      showSlide(currentSlide - 1);
    }
    resetAutoSlide();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
document.getElementById('current-year').textContent = new Date().getFullYear();

showSlide(0);
resetAutoSlide();
updateCountdown();
setInterval(updateCountdown, 1000);
