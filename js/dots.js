const headerHeight = 130;
const margin = 10;
const dotsCount = 20;
const container = document.querySelector(".background-dots");

let dots = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createDot() {
  const dot = document.createElement("div");
  dot.className = "dot";
  container.appendChild(dot);
  return {
    el: dot,
    x: random(0, window.innerWidth),
    y: random(margin, window.innerHeight - headerHeight - margin),
    vx: random(-0.15, 0.15),
    vy: random(-0.15, 0.15),
  };
}

function updateDot(dot) {
  dot.x += dot.vx;
  dot.y += dot.vy;

  const maxX = window.innerWidth;
  const maxY = window.innerHeight - headerHeight;

  if (dot.x < 0) dot.x = maxX;
  else if (dot.x > maxX) dot.x = 0;

  if (dot.y < margin) dot.y = maxY - margin;
  else if (dot.y > maxY - margin) dot.y = margin;

  dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
}

function animate() {
  dots.forEach(updateDot);
  requestAnimationFrame(animate);
}

function initDots() {
  container.innerHTML = "";
  dots = [];

  for (let i = 0; i < dotsCount; i++) {
    dots.push(createDot());
  }
}

window.addEventListener("resize", () => {
  initDots();
});

initDots();
animate();
