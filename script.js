const board = document.getElementById('game-board');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');

let score = 0;
let zombies = [];
let playerPos = { x: 300, y: 200 };
let isGameOver = false;

// 1. 마우스 위치 업데이트
board.addEventListener('mousemove', (e) => {
    if (isGameOver) return;
    const rect = board.getBoundingClientRect();
    playerPos.x = e.clientX - rect.left;
    playerPos.y = e.clientY - rect.top;
    
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
});

// 2. 좀비 생성 함수
function createZombie() {
    const zombie = document.createElement('div');
    zombie.className = 'zombie';
    zombie.innerHTML = '🧟';
    
    // 랜덤 위치 선정 (가장자리에서 나오게 하면 더 좋지만, 일단 완전 랜덤)
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

// 3. 게임 루프 (30ms마다 실행)
const gameLoop = setInterval(() => {
    if (isGameOver) return;

    zombies.forEach(zombie => {
        // 캐릭터와 좀비 사이의 거리 계산
        const dx = playerPos.x - zombie.x;
        const dy = playerPos.y - zombie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 좀비 이동 (캐릭터 방향으로 2px)
        if (distance > 0) {
            zombie.x += (dx / distance) * 2;
            zombie.y += (dy / distance) * 2;
        }

        zombie.element.style.left = zombie.x + 'px';
        zombie.element.style.top = zombie.y + 'px';

        // 충돌 판정 (10px 이내)
        if (distance < 10) {
            gameOver();
        }
    });
}, 30);

// 4. 시간 측정 및 10초마다 좀비 추가
const timer = setInterval(() => {
    if (isGameOver) return;
    score++;
    scoreElement.innerText = score;

    if (score % 10 === 0) {
        createZombie();
    }
}, 1000);

// 5. 게임 종료
function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    clearInterval(timer);
    alert(`게임 오버! 버틴 시간: ${score}초`);
    location.reload(); // 페이지 새로고침으로 게임 재시작
}

// 첫 좀비 생성
createZombie();