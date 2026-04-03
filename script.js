// ===== TYPEWRITER =====
const text = "signal stabilized";
let i = 0;

function type() {
  if (i < text.length) {
    document.getElementById("title").innerHTML += text[i];
    i++;
    setTimeout(type, 40);
  }
}
type();


// ===== CLICK GLITCH =====
const moth = document.getElementById("mothHome");

moth.addEventListener("click", () => {
  document.body.style.animation = "glitchFlash 0.2s";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 150);
});


// ===== PLAYER FAKE AUDIO REACTION =====
setInterval(() => {
  const glow = Math.random() * 40;

  document.querySelector(".player iframe").style.boxShadow =
    `0 0 ${glow}px rgba(0,255,150,0.3)`;
}, 200);


// ===== PARTICLES =====
particlesJS("particles-js", {
  particles: {
    number: { value: 30 },
    color: { value: "#00ff9f" },
    size: { value: 2 },
    move: { speed: 0.3 }
  }
});