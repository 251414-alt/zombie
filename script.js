const board = document.getElementById('game-board');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');

let score = 0;
let zombies = [];
let playerPos = { x: 300, y: 200 };
let isGameOver = false;

// 좀비 속도 설정 (기존 2에서 4로 상향)
const ZOMBIE_SPEED = 4;

// 1. 마우스 움직임에 따라 플레이어 위치 업데이트
board.addEventListener('mousemove', (e) => {
    if (isGameOver) return;
    const rect = board.getBoundingClientRect();
    playerPos.x = e.clientX - rect.left;
    playerPos.y = e.clientY - rect.top;
    
    player.style.left = `${playerPos.x}px`;
    player.style.top = `${playerPos.y}px`;
});

// 2. 좀비 생성 (랜덤 위치)
function createZombie() {
    const zombie = document.createElement('div');
    zombie.className = 'zombie';
    zombie.innerHTML = '🧟';
    
    // 게임판 내의 랜덤한 좌표
    const x = Math.random() * 600;
    const y = Math.random() * 400;
    
    const zombieObj = {
        element: zombie,
        x: x,
        y: y
    };
    
    board.appendChild(zombie);
    zombies.push(zombieObj);
}

// 3. 게임 로직 (30ms 마다 좀비 이동 및 충돌 체크)
const gameLoop = setInterval(() => {
    if (isGameOver) return;

    zombies.forEach(zombie => {
        // 플레이어와 좀비 사이의 거리와 방향 계산
        const dx = playerPos.x - zombie.x;
        const dy = playerPos.y - zombie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 좀비 이동 로직
        if (distance > 0) {
            zombie.x += (dx / distance) * ZOMBIE_SPEED;
            zombie.y += (dy / distance) * ZOMBIE_SPEED;
        }

        zombie.element.style.left = `${zombie.x}px`;
        zombie.element.style.top = `${zombie.y}px`;

        // 충돌 판정 (10px 이내면 사망)
        if (distance < 10) {
            gameOver();
        }
    });
}, 30);

// 4. 시간 측정 및 10초마다 난이도 상승 (좀비 추가)
const timer = setInterval(() => {
    if (isGameOver) return;
    score++;
    scoreElement.innerText = score;

    if (score % 10 === 0) {
        createZombie();
    }
}, 1000);

// 5. 게임 종료 처리
function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    clearInterval(timer);
    
    // 잠시 후 결과를 알려줌
    setTimeout(() => {
        alert(`으악! 좀비에게 잡혔습니다!\n생존 시간: ${score}초`);
        location.reload(); 
    }, 10);
}

// 초기 좀비 생성
createZombie();
