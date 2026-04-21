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
  let x = (width - vW) / 2;
  let y = (height - vH) / 2;

  // 5. 將影像繪製在畫布中間
  image(capture, x, y, vW, vH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
