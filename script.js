document.addEventListener("DOMContentLoaded", () => {

  const entryCanvas = document.getElementById("entry-canvas");
  const entryContext = entryCanvas ? entryCanvas.getContext("2d") : null;
  const terminal = document.getElementById("terminal");
  const button = document.getElementById("enterBtn");
  const ghostField = document.getElementById("ghostField");
  const visitorsLabel = document.querySelector(".window-status span");
  const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  let backgroundNodes = [];
  let haloRings = [];
  let omenBursts = [];
  let nextOmenAt = 0;
  let omenCounter = 0;
  const ghostLexicon = [
    "archive",
    "relay",
    "signal",
    "ghost",
    "listen",
    "unknown",
    "mirror",
    "ritual",
    "channel",
    "dream",
    "transmission",
    "midnight",
    "echo",
    "caipira",
    "warning",
    "static",
    "watcher",
    "cipher",
  ];
  const flashLexicon = [
    "SIGNAL",
    "RELAY",
    "ARCHIVE",
    "PING",
    "TRACE",
    "LISTEN",
    "CHANNEL",
    "ERROR_13",
    "ECHO",
    "STATIC",
    "WATCHER",
    "RADAR",
    "NOISE",
    "WAKE",
    "GHOST",
  ];

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomDigits(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }

  function randomHex(length) {
    const alphabet = "0123456789ABCDEF";
    return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  }

  function buildGhostLine() {
    const mode = Math.random();

    if (mode < 0.3) {
      return `${pickRandom(ghostLexicon)}_${pickRandom(ghostLexicon)} :: ${randomDigits(4)}`;
    }

    if (mode < 0.58) {
      return `${randomHex(2)}.${randomHex(2)}.${randomHex(2)} // ${pickRandom(ghostLexicon)}`;
    }

    if (mode < 0.8) {
      return `${pickRandom(ghostLexicon)} ${pickRandom(ghostLexicon)} ${pickRandom(ghostLexicon)}`;
    }

    return `${pickRandom(ghostLexicon)} protocol_${randomDigits(2)}.${randomDigits(2)}`;
  }

  function configureGhostLine(line) {
    line.dataset.fullText = buildGhostLine();
    line.textContent = "";
    line.style.setProperty("--ghost-left", `${randomBetween(4, 88).toFixed(2)}%`);
    line.style.setProperty("--ghost-top", `${randomBetween(6, 88).toFixed(2)}%`);
    line.style.setProperty("--ghost-duration", `${randomBetween(10, 18).toFixed(2)}s`);
    line.style.setProperty("--ghost-delay", `${(-randomBetween(0, 10)).toFixed(2)}s`);
    line.style.setProperty("--ghost-scale", randomBetween(0.7, 1.35).toFixed(2));
    line.style.setProperty("--ghost-opacity", randomBetween(0.45, 0.92).toFixed(2));

    if (Math.random() < 0.2) {
      line.dataset.variant = "vertical";
      line.style.setProperty("--ghost-left", `${randomBetween(8, 94).toFixed(2)}%`);
      line.style.setProperty("--ghost-top", `${randomBetween(4, 70).toFixed(2)}%`);
    } else {
      delete line.dataset.variant;
    }
  }

  function buildOmenText() {
    omenCounter += 1;

    if (omenCounter % 8 === 0 || Math.random() < 0.08) {
      return "varekai";
    }

    if (Math.random() < 0.34) {
      return `${randomHex(2)}:${randomHex(2)}:${randomHex(2)}`;
    }

    return pickRandom(flashLexicon);
  }

  function createOmenBurst(width, height, time) {
    const edge = Math.floor(Math.random() * 4);
    const margin = Math.min(width, height) * 0.08;
    let x = randomBetween(margin, width - margin);
    let y = randomBetween(margin, height - margin);

    if (edge === 0) {
      y = randomBetween(margin, height * 0.24);
    } else if (edge === 1) {
      x = randomBetween(width * 0.74, width - margin);
    } else if (edge === 2) {
      y = randomBetween(height * 0.76, height - margin);
    } else {
      x = randomBetween(margin, width * 0.26);
    }

    const text = buildOmenText();

    return {
      x,
      y,
      born: time,
      life: text === "varekai" ? randomBetween(0.9, 1.4) : randomBetween(0.38, 0.86),
      text,
      rotation: randomBetween(-0.22, 0.22),
      size: text === "varekai" ? randomBetween(12, 16) : randomBetween(9, 13),
      width: text === "varekai" ? 42 : 30,
    };
  }

  function drawOmenBursts(context, width, height, time) {
    if (time >= nextOmenAt) {
      omenBursts.push(createOmenBurst(width, height, time));
      nextOmenAt = time + randomBetween(0.55, 1.5);
    }

    omenBursts = omenBursts.filter((omen) => time - omen.born < omen.life);

    for (const omen of omenBursts) {
      const age = (time - omen.born) / omen.life;
      const flicker = Math.sin(time * 44 + omen.x * 0.07) > 0.16 ? 1 : 0.22;
      const alpha = Math.sin(age * Math.PI) * (omen.text === "varekai" ? 0.28 : 0.2) * flicker;

      context.save();
      context.translate(omen.x, omen.y);
      context.rotate(omen.rotation);
      context.font = `${omen.size}px "Courier New", monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = `rgba(205, 255, 232, ${alpha})`;
      context.shadowColor = omen.text === "varekai"
        ? `rgba(255, 79, 210, ${alpha * 0.8})`
        : `rgba(92, 255, 210, ${alpha})`;
      context.shadowBlur = omen.text === "varekai" ? 16 : 10;
      context.fillText(omen.text, 0, 0);

      context.strokeStyle = `rgba(120, 255, 214, ${alpha * 0.45})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-omen.width, -9);
      context.lineTo(omen.width, -9);
      context.moveTo(-omen.width, 9);
      context.lineTo(omen.width, 9);
      context.stroke();

      if (Math.sin(time * 58 + omen.y * 0.05) > 0.74) {
        context.fillStyle = `rgba(255, 79, 210, ${alpha * 0.5})`;
        context.fillText(omen.text, randomBetween(-1.6, 1.6), randomBetween(-0.8, 0.8));
      }

      context.restore();
    }
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function createBackgroundNodes(width, height) {
    const count = width < 720 ? 18 : 30;

    return Array.from({ length: count }, () => ({
      orbit: randomBetween(40, Math.min(width, height) * 0.34),
      angle: randomBetween(0, Math.PI * 2),
      speed: randomBetween(0.00035, 0.0012),
      radius: randomBetween(1.1, 2.8),
      alpha: randomBetween(0.16, 0.45),
      spreadX: randomBetween(0.68, 1.12),
      spreadY: randomBetween(0.58, 1.08),
    }));
  }

  function createHaloRings(width, height) {
    const base = Math.min(width, height) * 0.14;
    const count = width < 720 ? 3 : 4;

    return Array.from({ length: count }, (_, index) => ({
      radius: base + index * Math.min(width, height) * 0.06,
      width: 0.7 + index * 0.18,
      alpha: 0.03 + index * 0.012,
      speed: 0.08 + index * 0.03,
      wobble: 5 + index * 3,
      phase: randomBetween(0, Math.PI * 2),
    }));
  }

  function setupEntryCanvas() {
    if (!entryCanvas || !entryContext) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    entryCanvas.width = Math.floor(window.innerWidth * dpr);
    entryCanvas.height = Math.floor(window.innerHeight * dpr);
    entryCanvas.style.width = `${window.innerWidth}px`;
    entryCanvas.style.height = `${window.innerHeight}px`;
    entryContext.setTransform(1, 0, 0, 1, 0, 0);
    entryContext.scale(dpr, dpr);

    backgroundNodes = createBackgroundNodes(window.innerWidth, window.innerHeight);
    haloRings = createHaloRings(window.innerWidth, window.innerHeight);
    omenBursts = [];
    nextOmenAt = 0;
  }

  function drawEntryCanvas(time) {
    if (!entryCanvas || !entryContext) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const t = time * 0.001;
    const centerX = width * 0.5 + (pointer.x - width * 0.5) * 0.02;
    const centerY = height * 0.5 + (pointer.y - height * 0.5) * 0.02;

    entryContext.clearRect(0, 0, width, height);

    const ambientGlow = entryContext.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.min(width, height) * 0.45
    );
    ambientGlow.addColorStop(0, "rgba(90, 255, 211, 0.08)");
    ambientGlow.addColorStop(0.45, "rgba(22, 74, 60, 0.05)");
    ambientGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    entryContext.fillStyle = ambientGlow;
    entryContext.fillRect(0, 0, width, height);

    entryContext.save();
    entryContext.translate(centerX, centerY);

    for (const ring of haloRings) {
      entryContext.beginPath();
      entryContext.strokeStyle = `rgba(126, 255, 218, ${ring.alpha + Math.sin(t * ring.speed + ring.phase) * 0.01})`;
      entryContext.lineWidth = ring.width;
      entryContext.ellipse(
        Math.sin(t * 0.24 + ring.phase) * 6,
        Math.cos(t * 0.18 + ring.phase) * 4,
        ring.radius + Math.sin(t * 0.7 + ring.phase) * ring.wobble,
        ring.radius * 0.58 + Math.cos(t * 0.65 + ring.phase) * (ring.wobble * 0.38),
        t * ring.speed,
        0,
        Math.PI * 2
      );
      entryContext.stroke();
    }

    entryContext.font = "10px Courier New, monospace";
    for (const node of backgroundNodes) {
      const angle = node.angle + t * (node.speed * 1000);
      const x = Math.cos(angle) * node.orbit * node.spreadX;
      const y = Math.sin(angle) * node.orbit * node.spreadY;

      entryContext.beginPath();
      entryContext.fillStyle = `rgba(174, 255, 230, ${node.alpha})`;
      entryContext.arc(x, y, node.radius, 0, Math.PI * 2);
      entryContext.fill();

      if (Math.sin(t * 1.8 + node.angle * 3) > 0.92) {
        entryContext.fillStyle = "rgba(255, 79, 210, 0.22)";
        entryContext.fillText("::", x + 5, y - 5);
      }
    }

    entryContext.restore();

    const sweepY = ((t * 110) % (height + 140)) - 140;
    const scanGlow = entryContext.createLinearGradient(0, sweepY, 0, sweepY + 140);
    scanGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
    scanGlow.addColorStop(0.5, "rgba(140, 255, 220, 0.05)");
    scanGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    entryContext.fillStyle = scanGlow;
    entryContext.fillRect(0, sweepY, width, 140);

    drawOmenBursts(entryContext, width, height, t);

    requestAnimationFrame(drawEntryCanvas);
  }

  async function animateGhostLine(line) {
    while (line.isConnected) {
      configureGhostLine(line);
      const text = line.dataset.fullText || "";
      const typeSpeed = randomBetween(36, 72);
      const eraseSpeed = randomBetween(18, 34);

      line.classList.add("is-typing");
      line.textContent = "";

      for (let i = 0; i <= text.length; i += 1) {
        if (!line.isConnected) {
          return;
        }

        line.textContent = text.slice(0, i);
        await wait(typeSpeed);
      }

      await wait(randomBetween(900, 2200));

      for (let i = text.length; i >= 0; i -= 1) {
        if (!line.isConnected) {
          return;
        }

        line.textContent = text.slice(0, i);
        await wait(eraseSpeed);
      }

      line.classList.remove("is-typing");
      await wait(randomBetween(1200, 3600));
    }
  }

  function setupGhostField() {
    if (!ghostField) {
      return;
    }

    ghostField.replaceChildren();

    const count = window.innerWidth < 720 ? 8 : 14;
    for (let i = 0; i < count; i += 1) {
      const line = document.createElement("span");
      line.className = "ghost-line";
      configureGhostLine(line);
      ghostField.appendChild(line);
      animateGhostLine(line);
    }
  }

  setupGhostField();
  if (entryCanvas && entryContext) {
    setupEntryCanvas();
    requestAnimationFrame(drawEntryCanvas);
  }
  window.addEventListener("resize", setupGhostField);
  window.addEventListener("resize", setupEntryCanvas);
  window.addEventListener("mousemove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    if (touch) {
      pointer.x = touch.clientX;
      pointer.y = touch.clientY;
    }
  }, { passive: true });

  if (visitorsLabel) {
    let visitors = 1;
    window.setInterval(() => {
      visitors += Math.random() < 0.65 ? 0 : 1;
      visitorsLabel.textContent = `VISITORS: ${String(visitors).padStart(6, "0")}`;
    }, 2600);
  }

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

    const TYPE_SPEED_MS = 8;
    const LINE_DELAY_MS = 90;

    let line = 0;
    let char = 0;

    function type() {
      terminal.scrollTop = terminal.scrollHeight;
      if (line < lines.length) {

        if (char < lines[line].length) {
          terminal.innerHTML += lines[line][char];
          char++;

          terminal.scrollTop = terminal.scrollHeight;
          
          setTimeout(type, TYPE_SPEED_MS);

        } else {
          terminal.innerHTML += "<br>";
          line++;
          char = 0;
          setTimeout(type, LINE_DELAY_MS);
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
