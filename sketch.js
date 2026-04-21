let capture;
let pg; // 宣告一個 Graphics 物件作為上方圖層
let bubbles = []; // 儲存泡泡的陣列

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏原始 HTML 影片元件
  capture.hide();
  // 初始化一個暫時的 Graphics 物件
  pg = createGraphics(100, 100);
}

function draw() {
  // 3. 背景顏色設定為 e7c6ff
  background('#e7c6ff');

  // 4. 計算影像寬高為畫布的 60%
  let vW = width * 0.6;
  let vH = height * 0.6;

  // 檢查視訊是否載入，並同步調整 pg 的大小與視訊解析度一致
  if (capture.width > 0 && (pg.width !== capture.width || pg.height !== capture.height)) {
    pg = createGraphics(capture.width, capture.height);
  }

  // 5. 將影像進行水平翻轉（鏡像）並繪製在畫布中間
  push();
  translate(width / 2, height / 2); // 移至畫布中心
  scale(-1, 1);                    // 執行水平鏡像翻轉
  imageMode(CENTER);               // 設定影像從中心點繪製

  // 繪製底層視訊
  image(capture, 0, 0, vW, vH);

  // --- 在 pg 圖層上製作冒泡泡效果 (疊加在視訊上方) ---
  pg.clear(); // 清除背景，保持透明

  // 1. 產生新泡泡
  if (capture.width > 0 && bubbles.length < 50) {
    bubbles.push({
      x: random(pg.width),
      y: pg.height + 20,
      size: random(15, 45),
      speed: random(2, 5),
      opacity: random(150, 255)
    });
  }

  // 2. 更新並繪製泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.y -= b.speed; // 向上移動
    pg.stroke(255, b.opacity); // 白色外框
    pg.fill(255, 255, 255, b.opacity * 0.5); // 半透明填充
    pg.circle(b.x, b.y, b.size);

    // 3. 移除超出畫面的泡泡
    if (b.y < -50) {
      bubbles.splice(i, 1);
    }
  }

  // 繪製頂層 Graphics 物件
  image(pg, 0, 0, vW, vH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
