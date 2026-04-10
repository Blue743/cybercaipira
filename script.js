document.addEventListener("DOMContentLoaded", () => {

  const terminal = document.getElementById("terminal");
  const button = document.getElementById("enterBtn");

  if (terminal) {

    const lines = [
      "booting system...",
      "injecting noise...",
      "all hope is dead...",
      "stabilizing signal...",
      "can you hear me?...",
      "connection failed...",
      "please respond...",
      "retrying..."
    ];

    let line = 0;
    let char = 0;

    function type() {
      terminal.scrollTop = terminal.scrollHeight;
      if (line < lines.length) {

        if (char < lines[line].length) {
          terminal.innerHTML += lines[line][char];
          char++;

          terminal.scrollTop = terminal.scrollHeight;
          
          setTimeout(type, 25);

        } else {
          terminal.innerHTML += "<br>";
          line++;
          char = 0;
          setTimeout(type, 400);
        }

      } else {
        if (button) {
          button.classList.remove("hidden");
          button.classList.add("active");
        }
      }
    }

    type();
  }

  if (button) {
    button.addEventListener("click", () => {
      document.body.style.animation = "glitchFlash 0.2s";

      setTimeout(() => {
        window.location.href = "main.html";
      }, 150);
    });
  }

});