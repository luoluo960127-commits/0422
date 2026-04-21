let capture;

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏原始 HTML 影片元件
  capture.hide();
}

function draw() {
  // 3. 背景顏色設定為 e7c6ff
  background('#e7c6ff');

  // 4. 計算影像寬高為畫布的 60%
  let vW = width * 0.6;
  let vH = height * 0.6;

  // 5. 將影像進行水平翻轉（鏡像）並繪製在畫布中間
  push();
  translate(width / 2, height / 2); // 移至畫布中心
  scale(-1, 1);                    // 執行水平鏡像翻轉
  imageMode(CENTER);               // 設定影像從中心點繪製
  image(capture, 0, 0, vW, vH);    // 在目前的中心原點繪製影像
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
