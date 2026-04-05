document.addEventListener("DOMContentLoaded", () => {

  // TYPEWRITER
  const title = document.getElementById("title");
  if (title) {
    const text = title.textContent;
    let i = 0;
    title.innerHTML = "";
    function type() {
      if (i < text.length) {
        title.innerHTML += text[i];
        i++;
        setTimeout(type, 40);
      }
    }
    type();
  }

  // VOLTAR ao clicar na mariposa
  const moth = document.getElementById("mothHome");
  if (moth) {
    moth.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // PARTICLES
  if (window.particlesJS) {
    particlesJS.load('particles-js', './assets/particles.json', function() {
      console.log('Particles loaded.');
    });
  }

});