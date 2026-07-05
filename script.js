const layers = [...document.querySelectorAll("[data-depth]")];
const missionTime = document.querySelector("#mission-time");
const velocity = document.querySelector("#velocity");
const vector = document.querySelector("#vector");
const delay = document.querySelector("#delay");

const pointer = { x: 0, y: 0 };
const eased = { x: 0, y: 0 };
let start = Date.now() - 241 * 24 * 60 * 60 * 1000;

function setPointer(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth - 0.5) * 2;
  pointer.y = (clientY / window.innerHeight - 0.5) * 2;
}

window.addEventListener("pointermove", (event) => {
  setPointer(event.clientX, event.clientY);
});

window.addEventListener("deviceorientation", (event) => {
  if (event.gamma === null || event.beta === null) return;
  pointer.x = Math.max(-1, Math.min(1, event.gamma / 35));
  pointer.y = Math.max(-1, Math.min(1, event.beta / 45));
});

function formatMissionTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(days).padStart(4, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTelemetry(now) {
  const t = now / 1000;
  missionTime.textContent = formatMissionTime(Date.now() - start);
  velocity.textContent = `${(17.42 + Math.sin(t / 8) * 0.06).toFixed(2)} KM/S`;
  vector.textContent = `RA +${(42.116 + Math.sin(t / 11) * 0.018).toFixed(3)} / DEC ${(-9.882 + Math.cos(t / 13) * 0.016).toFixed(3)}`;
  delay.textContent = `${String(11 + Math.floor(Math.sin(t / 30) + 1)).padStart(2, "0")}H ${String(31 + Math.floor(Math.cos(t / 17) * 2)).padStart(2, "0")}M`;
}

function animate(now) {
  eased.x += (pointer.x - eased.x) * 0.045;
  eased.y += (pointer.y - eased.y) * 0.045;

  layers.forEach((layer) => {
    const depth = Number(layer.dataset.depth);
    const amplitude = 34 * depth;
    layer.style.setProperty("--px", (-eased.x * amplitude).toFixed(3));
    layer.style.setProperty("--py", (-eased.y * amplitude).toFixed(3));
  });

  updateTelemetry(now);
  requestAnimationFrame(animate);
}

setPointer(window.innerWidth * 0.54, window.innerHeight * 0.48);
requestAnimationFrame(animate);
