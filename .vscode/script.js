const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

canvas.width = 400;
canvas.height = 600;

// Игровые переменные
let score = 0;
let gameSpeed = 2;
let playerSpeed = 0; // Скорость игрока для плавного движения
const player = { x: 180, y: 500, width: 40, height: 40 };
const asteroids = [];
const stars = [];
let isGameOver = false;

// Обработчик клавиш
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true; // Отмечаем нажатие
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false; // Отмечаем отпускание
});

// Генерация объектов
function createAsteroid() {
  if (!isGameOver) {
    const x = Math.random() * (canvas.width - 40);
    asteroids.push({ x, y: 0, size: Math.random() * 20 + 20 });
  }
}

function createStar() {
  if (!isGameOver) {
    const x = Math.random() * (canvas.width - 20);
    stars.push({ x, y: 0, size: Math.random() * 5 + 5 });
  }
}

// Обновление объектов
function updateObjects(objects, speed) {
  for (let i = objects.length - 1; i >= 0; i--) {
    objects[i].y += speed;
    if (objects[i].y > canvas.height) objects.splice(i, 1);
  }
}

// Проверка столкновений
function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.size &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.size &&
    obj1.y + obj1.height > obj2.y
  );
}

// Конец игры
function endGame() {
  isGameOver = true;
  gameOverScreen.style.display = 'block';
  finalScore.textContent = score;
}

// Перезапуск игры
function restartGame() {
  score = 0;
  gameSpeed = 2;
  isGameOver = false;
  asteroids.length = 0;
  stars.length = 0;
  gameOverScreen.style.display = 'none';
  scoreDisplay.textContent = `Score: ${score}`;
  gameLoop(); // Перезапускаем игровой цикл
}

// Рисование игрока (треугольник)
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y); // Верхняя точка треугольника
  ctx.lineTo(player.x, player.y + player.height); // Левая нижняя точка
  ctx.lineTo(player.x + player.width, player.y + player.height); // Правая нижняя точка
  ctx.closePath();
  ctx.fill();
}

// Рисование астероида (неровный многоугольник)
function drawAsteroid(asteroid) {
  ctx.fillStyle = 'gray';
  ctx.beginPath();
  const points = 6; // Количество углов
  for (let i = 0; i < points; i++) {
    const angle = (Math.PI * 2 * i) / points;
    const offset = asteroid.size / 2 + Math.random() * (asteroid.size / 2);
    const x = asteroid.x + offset * Math.cos(angle);
    const y = asteroid.y + offset * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// Рисование звезды (круг)
function drawStar(star) {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fill();
}

// Основной игровой цикл
function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Плавное перемещение игрока
  if (keys['ArrowLeft'] && player.x > 0) playerSpeed = -5;
  else if (keys['ArrowRight'] && player.x < canvas.width - player.width) playerSpeed = 5;
  else playerSpeed = 0;

  player.x += playerSpeed;

  // Рисуем игрока
  drawPlayer();

  // Рисуем астероиды
  asteroids.forEach((asteroid) => {
    drawAsteroid(asteroid);

    // Проверка столкновений с игроком
    if (checkCollision(player, asteroid)) {
      endGame();
    }
  });

  // Рисуем звёзды
  stars.forEach((star, index) => {
    drawStar(star);

    // Сбор звёзд
    if (checkCollision(player, star)) {
      score += 10;
      stars.splice(index, 1);
      scoreDisplay.textContent = `Score: ${score}`;
    }
  });

  // Обновляем объекты
  updateObjects(asteroids, gameSpeed);
  updateObjects(stars, gameSpeed);

  // Увеличиваем сложность медленно
  if (Math.floor(score) % 100 === 0 && gameSpeed < 10) {
    gameSpeed += 0.005; // Увеличение скорости медленно
  }

  // Запуск следующего кадра
  requestAnimationFrame(gameLoop);
}

// Обработчик кнопки "Restart Game"
restartButton.addEventListener('click', restartGame);

// Генерация объектов с интервалами
setInterval(createAsteroid, 1000);
setInterval(createStar, 2000);

// Запуск игры
gameLoop();