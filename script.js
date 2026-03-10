const openLetterBtn = document.getElementById('open-letter-btn');
const letterCard = document.getElementById('letter-card');
const typedText = document.getElementById('typed-text');

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

let letterWritten = false;
let score = 0;
let gameRunning = false;
let gameInterval;

const letterContent = `Meu amor,\n\nHoje eu celebro a sua vida com o coração cheio de gratidão.\nVocê ilumina meus dias com seu sorriso e transforma o comum em algo mágico.\n\nQue neste novo ciclo você receba tudo o que sonha e mereça.\nEu quero estar ao seu lado em cada passo, te amando e te admirando sempre.\n\nFeliz aniversário, minha pessoa favorita. Eu te amo infinitamente. 💚`;

function typeLetter(text, speed = 34) {
  let index = 0;
  typedText.textContent = '';

  const typing = setInterval(() => {
    typedText.textContent += text[index];
    index += 1;
    if (index >= text.length) clearInterval(typing);
  }, speed);
}

if (openLetterBtn && letterCard && typedText) {
  openLetterBtn.addEventListener('click', () => {
    letterCard.classList.add('open');
    letterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (!letterWritten) {
      typeLetter(letterContent);
      letterWritten = true;
    }
  });
}

function updateCountdown() {
  const targetDate = new Date('2027-02-26T00:00:00-03:00').getTime();
  const now = Date.now();
  const difference = targetDate - now;

  if (difference <= 0) {
    Object.values(countdownElements).forEach((el) => {
      if (el) el.textContent = '00';
    });
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  if (countdownElements.days) countdownElements.days.textContent = String(Math.floor(difference / day)).padStart(2, '0');
  if (countdownElements.hours) countdownElements.hours.textContent = String(Math.floor((difference % day) / hour)).padStart(2, '0');
  if (countdownElements.minutes) countdownElements.minutes.textContent = String(Math.floor((difference % hour) / minute)).padStart(2, '0');
  if (countdownElements.seconds) countdownElements.seconds.textContent = String(Math.floor((difference % minute) / 1000)).padStart(2, '0');
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
    if (heartBtn.parentNode) heartBtn.remove();
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

if (startGameBtn && gameArea && scoreDisplay && gameMessage) {
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
}

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }),
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

updateCountdown();
setInterval(updateCountdown, 1000);
