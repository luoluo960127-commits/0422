let capture;
let pg; // 宣告一個 Graphics 物件作為上方圖層

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

  // --- 在 pg 圖層上繪圖 ---
  pg.clear(); // 清除背景，保持透明
  pg.fill(255, 0, 0);
  pg.noStroke();
  pg.ellipse(pg.width / 2, pg.height / 2, 50, 50); // 在視訊中央畫一個紅點作為測試

  // 繪製頂層 Graphics 物件
  image(pg, 0, 0, vW, vH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
