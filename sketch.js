let capture;
let pg; // 宣告一個 Graphics 物件作為上方圖層
let bubbles = []; // 儲存泡泡的陣列
let saveBtn; // 儲存按鈕物件

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏原始 HTML 影片元件
  capture.hide();
  // 初始化一個暫時的 Graphics 物件
  pg = createGraphics(100, 100);

  // 產生一個圓形的快門拍照鈕
  saveBtn = createButton('');
  saveBtn.style('width', '70px');
  saveBtn.style('height', '70px');
  saveBtn.style('background-color', 'white');
  saveBtn.style('border', '5px solid #ccc');
  saveBtn.style('border-radius', '50%');
  saveBtn.style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
  saveBtn.style('cursor', 'pointer');
  updateButtonPosition();
  saveBtn.mousePressed(takeSnapshot);
}

function draw() {
  // 3. 恢復原本的粉紫色背景
  background('#f8efff');

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
  // image(capture, 0, 0, vW, vH); // 如果只想看數字，可以把這行註解掉

  // --- 處理 20x20 單位的像素數值化 ---
  capture.loadPixels();
  let unitSize = 20; // 每個單位的大小
  if (capture.pixels.length > 0) {
    for (let y = 0; y < capture.height; y += unitSize) {
      for (let x = 0; x < capture.width; x += unitSize) {
        // 取得該單位左上角像素的顏色值
        let i = (x + y * capture.width) * 4;
        let r = capture.pixels[i];
        let g = capture.pixels[i + 1];
        let b = capture.pixels[i + 2];
        let avg = floor((r + g + b) / 3); // 計算平均值 (該單位的顏色值)

        // 將攝影機座標映射到畫布顯示區域的座標
        let dx = map(x, 0, capture.width, -vW / 2, vW / 2);
        let dy = map(y, 0, capture.height, -vH / 2, vH / 2);
        
        // 計算每個馬賽克方塊在畫布上應有的寬高
        let drawW = vW / (capture.width / unitSize);
        let drawH = vH / (capture.height / unitSize);

        fill(avg); // 使用灰階數值填充
        noStroke();
        rect(dx, dy, drawW, drawH); // 繪製馬賽克單位
      }
    }
  }

  // --- 在 pg 圖層上製作冒泡泡效果 (疊加在視訊上方) ---
  pg.clear(); // 清除背景，保持透明

  // 1. 產生新泡泡
  if (bubbles.length < 50) {
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
    pg.stroke(255, b.opacity); // 恢復白色外框
    pg.fill(255, 255, 255, b.opacity * 0.5); // 恢復白色半透明填充
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

function takeSnapshot() {
  // 計算視訊在畫布上的區域 (與 draw 函式中的計算邏輯一致)
  let vW = width * 0.6;
  let vH = height * 0.6;
  let x = (width - vW) / 2;
  let y = (height - vH) / 2;

  // 從畫布中擷取該區域的影像
  let img = get(x, y, vW, vH);
  save(img, 'my_capture.jpg'); // 儲存為 jpg
}

function updateButtonPosition() {
  // 將按鈕放在畫布底部中央
  saveBtn.position(windowWidth / 2 - 35, windowHeight - 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateButtonPosition();
}
