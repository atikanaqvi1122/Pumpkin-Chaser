let ghost;
let ghostSpeedX = 2;
let ghostSpeedY = 1.5;
let pumpkin;
let pumpkinActive = false;
let score = 0;
let duration = 30;
let startTime;
let state = 'start';
let particles = [];
let soundEffect;

function setup() {
  createCanvas(480, 360);
  soundEffect = new p5.Oscillator('triangle');
  spawnGhost();
  spawnPumpkin();}
function draw() {
  drawScene();
   if (state === 'start') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(26);
    text('Pumpkin Chase', width / 2, height / 2 - 20);
    textSize(16);
    fill(200);
    text('Click to start', width / 2, height / 2 + 20);
    return; }
  if (state === 'over') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(24);
    text('Game is Over', width / 2, height / 2 - 30);
    textSize(18);
    text('Final Score: ' + score, width / 2, height / 2);
    textSize(14);
    fill(200);
    text('Click to play again', width / 2, height / 2 + 35);
    return}
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, duration - elapsed);
  if (timeLeft <= 0) {
    state = 'over';
    return;}
  ghost.x += ghostSpeedX;
  ghost.y += ghostSpeedY;

  if (ghost.x < 30 || ghost.x > width - 30) ghostSpeedX *= -1;
  if (ghost.y < 30 || ghost.y > height - 100) ghostSpeedY *= -1;
  drawGhost(ghost.x, ghost.y);
  if (!pumpkinActive && random(1) < 0.02) {
    spawnPumpkin();
    pumpkinActive = true;}
  if (pumpkinActive) {
    pumpkin.x += pumpkin.speedX;
    drawPumpkin(pumpkin.x, pumpkin.y);
    if (pumpkin.x > width + 30) {
      pumpkinActive = false; }}
  if (pumpkinActive && dist(ghost.x, ghost.y, pumpkin.x, pumpkin.y) < 35) {
    state = 'over';}
  updateParticles();
  textAlign(LEFT, TOP);
  fill(255);
  textSize(16);
  text('Score: ' + score, 15, 12);
textAlign(RIGHT, TOP);
  text('Time: ' + ceil(timeLeft), width - 15, 12);}
function mousePressed() {
  if (state === 'start' || state === 'over') {
    state = 'play';
    score = 0;
    startTime = millis();
    spawnGhost();
    pumpkinActive = false;
    return;}
if (state === 'play') {
    if (pumpkinActive && dist(mouseX, mouseY, pumpkin.x, pumpkin.y) < 25) {
      score += 3;
      createBurst(pumpkin.x, pumpkin.y, color(255, 140, 0));
      playMusic();
      pumpkinActive = false;}}}

function spawnGhost() {
  ghost = { 
    x: random(50, width - 50), 
    y: random(50, height - 120) };
  ghostSpeedX = random([-2.5, -2, 2, 2.5]);
  ghostSpeedY = random([-2, -1.5, 1.5, 2]);}
function spawnPumpkin() {
  pumpkin = {
    x: -20,
    y: random(60, height - 120),
    speedX: random(3.5, 6)};}
function playMusic() {
  userStartAudio();
  soundEffect.freq(random(200, 500));
  soundEffect.amp(0.1, 0.05);
  soundEffect.start();
  setTimeout(() => { soundEffect.stop(); }, 120);}

function drawScene() {
  background(15, 12, 30);
noStroke();
  fill(255, 245, 200, 220);
  ellipse(390, 70, 70, 70);
  fill(230, 220, 180, 150);
  ellipse(380, 60, 15, 15);
  ellipse(405, 80, 12, 12);
  fill(25, 20, 45);
  ellipse(120, 360, 350, 180);
  ellipse(380, 360, 300, 150);
  fill(20, 40, 25);
  rect(0, height - 60, width, 60);
  fill(80, 85, 95);
  rect(80, height - 75, 24, 30, 8, 8, 0, 0);
  rect(220, height - 85, 28, 40, 10, 10, 0, 0);
  rect(340, height - 70, 22, 28, 6, 6, 0, 0);
  stroke(50);
  strokeWeight(2);
  line(92, height - 70, 92, height - 55);
  line(87, height - 65, 97, height - 65);
  line(234, height - 78, 234, height - 58);
  line(227, height - 70, 241, height - 70);
  noStroke();}

function drawGhost(x, y) {
  push();
  translate(x, y);
  let floatY = sin(frameCount * 0.08) * 4;
  fill(220, 255, 235, 210);
  noStroke();
  ellipse(0, floatY, 50, 50);
  rect(-25, floatY, 50, 20);
  fill(20, 20, 35);
  ellipse(-10, floatY - 4, 8, 12);
  ellipse(10, floatY - 4, 8, 12);
  ellipse(0, floatY + 8, 10, 12);
  pop();}
function drawPumpkin(x, y) {
  push();
  translate(x, y);
  fill(60, 130, 40);
  rect(-3, -16, 6, 8, 2);
  fill(255, 120, 0);
  ellipse(0, 0, 42, 34);
  fill(30, 10, 0);
  triangle(-12, -4, -4, -4, -8, -10);
  triangle(4, -4, 12, -4, 8, -10);
  arc(0, 4, 18, 12, 0, PI, CHORD);
  pop();}

function createBurst(x, y, pColor) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      size: random(4, 8),
      alpha: 255,
      color: pColor
    });}}function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 8;

noStroke();
    let c = color(red(p.color), green(p.color), blue(p.color), p.alpha);
    fill(c);
    ellipse(p.x, p.y, p.size);

if (p.alpha <= 0) {
      particles.splice(i, 1);}}}

