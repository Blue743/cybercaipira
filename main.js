document.addEventListener("DOMContentLoaded", () => {
  const occultCanvas = document.getElementById("occult-canvas");
  const occultContext = occultCanvas ? occultCanvas.getContext("2d") : null;
  const ghostField = document.getElementById("ghostField");
  const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  const ritualForce = { radius: 0, energy: 0 };
  let sigilMarks = [];
  let omenBursts = [];
  let nextOmenAt = 0;
  let occultFogFields = [];
  const omenWords = ["WAKE", "SEEN", "HUSH", "BELOW", "NOX", "TRACE", "ERROR_13", "LISTEN"];
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

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
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

  function cycleGhostField() {
    if (!ghostField) {
      return;
    }

    const lines = [...ghostField.querySelectorAll(".ghost-line")];
    if (lines.length === 0) {
      return;
    }

    const updates = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < updates; i += 1) {
      const line = pickRandom(lines);
      if (!line.classList.contains("is-typing") && Math.random() < 0.35) {
        configureGhostLine(line);
      }
    }
  }

  function createSigilMarks(width, height) {
    const radius = Math.hypot(width, height) * 0.5;
    const count = width < 720 ? 54 : 82;

    return Array.from({ length: count }, (_, index) => {
      const angle = (Math.PI * 2 * index) / count;
      const band = 0.38 + Math.random() * 0.58;

      return {
        angle,
        distance: radius * band,
        length: randomBetween(8, 36),
        drift: randomBetween(-0.18, 0.18),
        phase: randomBetween(0, Math.PI * 2),
        label: Math.random() < 0.28 ? pickRandom(["NOX", "EYE", "000", "XIII", "NULL", "VIA"]) : "",
      };
    });
  }

  function createOccultFogFields(width, height) {
    const size = Math.min(width, height);

    return Array.from({ length: width < 720 ? 5 : 8 }, () => ({
      anchorX: randomBetween(0.05, 0.95),
      anchorY: randomBetween(0.08, 0.92),
      radius: size * randomBetween(0.22, 0.48),
      speed: randomBetween(0.025, 0.07),
      driftX: randomBetween(-0.08, 0.08),
      driftY: randomBetween(-0.06, 0.06),
      phase: randomBetween(0, Math.PI * 2),
      alpha: randomBetween(0.025, 0.055),
    }));
  }

  function setupOccultCanvas() {
    if (!occultCanvas || !occultContext) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    occultCanvas.width = Math.floor(window.innerWidth * dpr);
    occultCanvas.height = Math.floor(window.innerHeight * dpr);
    occultCanvas.style.width = `${window.innerWidth}px`;
    occultCanvas.style.height = `${window.innerHeight}px`;
    occultContext.setTransform(1, 0, 0, 1, 0, 0);
    occultContext.scale(dpr, dpr);
    sigilMarks = createSigilMarks(window.innerWidth, window.innerHeight);
    occultFogFields = createOccultFogFields(window.innerWidth, window.innerHeight);
    ritualForce.radius = Math.min(window.innerWidth, window.innerHeight) * 0.24;
    setupGhostField();
  }

  function drawPolygon(context, radius, sides, rotation) {
    context.beginPath();

    for (let i = 0; i < sides; i += 1) {
      const angle = rotation + (Math.PI * 2 * i) / sides;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.closePath();
    context.stroke();
  }

  function drawSigilLayer(context, radius, sides, rotation, alpha) {
    context.save();
    context.rotate(rotation);
    context.strokeStyle = `rgba(147, 255, 216, ${alpha})`;
    context.lineWidth = 1;
    drawPolygon(context, radius, sides, 0);
    drawPolygon(context, radius * 0.72, sides + 2, Math.PI / sides);

    context.beginPath();
    for (let i = 0; i < sides; i += 1) {
      const angle = (Math.PI * 2 * i) / sides;
      context.moveTo(Math.cos(angle) * radius * 0.26, Math.sin(angle) * radius * 0.26);
      context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    context.stroke();
    context.restore();
  }

  function drawGlitchedText(context, text, time, intensity) {
    const glitching = Math.sin(time * 4.7 + text.charCodeAt(0)) > 0.82;

    context.fillText(text, 0, 0);

    if (!glitching) {
      return;
    }

    const slices = 2 + Math.floor(intensity * 3);
    for (let i = 0; i < slices; i += 1) {
      const offsetX = randomBetween(-8, 8) * intensity;
      const offsetY = randomBetween(-2, 2);
      context.fillStyle = i % 2 === 0
        ? `rgba(92, 255, 240, ${0.12 * intensity})`
        : `rgba(255, 79, 210, ${0.1 * intensity})`;
      context.fillText(text, offsetX, offsetY);
    }
  }

  function drawOccultFog(context, width, height, time, centerX, centerY) {
    context.save();
    context.globalCompositeOperation = "source-over";
    context.filter = "blur(18px)";

    for (const fog of occultFogFields) {
      const x =
        width * fog.anchorX +
        Math.sin(time * fog.speed + fog.phase) * width * fog.driftX +
        Math.cos(time * fog.speed * 1.7 + fog.phase) * 18;
      const y =
        height * fog.anchorY +
        Math.cos(time * fog.speed + fog.phase) * height * fog.driftY +
        Math.sin(time * fog.speed * 1.4 + fog.phase) * 14;
      const pulse = 0.72 + Math.sin(time * 0.38 + fog.phase) * 0.28;

      const veil = context.createRadialGradient(x, y, 0, x, y, fog.radius);
      veil.addColorStop(0, `rgba(132, 255, 218, ${fog.alpha * pulse})`);
      veil.addColorStop(0.42, `rgba(62, 166, 142, ${fog.alpha * 0.42})`);
      veil.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = veil;
      context.fillRect(x - fog.radius, y - fog.radius, fog.radius * 2, fog.radius * 2);
    }

    const centralVeil = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.min(width, height) * 0.62
    );
    centralVeil.addColorStop(0, "rgba(0, 0, 0, 0)");
    centralVeil.addColorStop(0.44, "rgba(0, 18, 14, 0.025)");
    centralVeil.addColorStop(1, "rgba(0, 0, 0, 0.2)");
    context.fillStyle = centralVeil;
    context.fillRect(0, 0, width, height);
    context.restore();
  }

  function createOmenBurst(width, height, time) {
    const edge = Math.floor(Math.random() * 4);
    const margin = Math.min(width, height) * 0.09;
    let x = randomBetween(margin, width - margin);
    let y = randomBetween(margin, height - margin);

    if (edge === 0) {
      y = randomBetween(margin, height * 0.24);
    } else if (edge === 1) {
      x = randomBetween(width * 0.76, width - margin);
    } else if (edge === 2) {
      y = randomBetween(height * 0.76, height - margin);
    } else {
      x = randomBetween(margin, width * 0.24);
    }

    return {
      x,
      y,
      born: time,
      life: randomBetween(0.42, 0.92),
      text: Math.random() < 0.55 ? pickRandom(omenWords) : `${randomHex(2)}:${randomHex(2)}:${randomHex(2)}`,
      rotation: randomBetween(-0.12, 0.12),
      size: randomBetween(10, 18),
    };
  }

  function drawOmenBursts(context, width, height, time) {
    if (time >= nextOmenAt) {
      omenBursts.push(createOmenBurst(width, height, time));
      nextOmenAt = time + randomBetween(0.7, 1.8);
    }

    omenBursts = omenBursts.filter((omen) => time - omen.born < omen.life);

    for (const omen of omenBursts) {
      const age = (time - omen.born) / omen.life;
      const flicker = Math.sin(time * 48 + omen.x) > 0.18 ? 1 : 0.28;
      const alpha = Math.sin(age * Math.PI) * 0.22 * flicker;

      context.save();
      context.translate(omen.x, omen.y);
      context.rotate(omen.rotation);
      context.font = `${omen.size}px Courier New, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = `rgba(205, 255, 232, ${alpha})`;
      context.shadowColor = `rgba(92, 255, 210, ${alpha})`;
      context.shadowBlur = 14;
      context.fillText(omen.text, 0, 0);
      context.strokeStyle = `rgba(120, 255, 214, ${alpha * 0.55})`;
      context.beginPath();
      context.moveTo(-34, -14);
      context.lineTo(34, -14);
      context.moveTo(-34, 14);
      context.lineTo(34, 14);
      context.stroke();
      context.restore();
    }
  }

  function drawInterferenceCuts(context, width, height, time) {
    context.save();
    context.globalCompositeOperation = "lighter";

    for (let i = 0; i < 5; i += 1) {
      const beat = Math.sin(time * (2.7 + i * 0.33) + i * 12.4);

      if (beat < 0.86) {
        continue;
      }

      const y = (Math.sin(time * 0.41 + i * 7.1) * 0.5 + 0.5) * height;
      const sliceHeight = randomBetween(1, 4);
      const alpha = (beat - 0.86) * 0.32;

      context.fillStyle = `rgba(190, 255, 230, ${alpha})`;
      context.fillRect(0, y, width, sliceHeight);
      context.fillStyle = `rgba(255, 70, 210, ${alpha * 0.36})`;
      context.fillRect(randomBetween(-40, 40), y + sliceHeight + 2, width * randomBetween(0.18, 0.52), 1);
    }

    context.restore();
  }

  function drawOccultCanvas(time) {
    if (!occultCanvas || !occultContext) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const t = time * 0.001;
    const pointerOffsetX = pointer.x - width * 0.5;
    const pointerOffsetY = pointer.y - height * 0.5;

    ritualForce.energy *= 0.93;
    ritualForce.radius = Math.max(
      Math.min(width, height) * 0.16,
      ritualForce.radius * 0.988
    );

    occultContext.clearRect(0, 0, width, height);

    const veil = occultContext.createRadialGradient(
      width * 0.5,
      height * 0.5,
      0,
      width * 0.5,
      height * 0.5,
      Math.hypot(width, height) * 0.58
    );
    veil.addColorStop(0, "rgba(2, 18, 14, 0.05)");
    veil.addColorStop(0.52, "rgba(0, 22, 18, 0.22)");
    veil.addColorStop(1, "rgba(0, 0, 0, 0.54)");
    occultContext.fillStyle = veil;
    occultContext.fillRect(0, 0, width, height);

    const cx = width * 0.5 + pointerOffsetX * 0.018 + Math.sin(t * 0.22) * 8;
    const cy = height * 0.5 + pointerOffsetY * 0.018 + Math.cos(t * 0.19) * 7;
    const baseRadius = Math.min(width, height) * (width < 720 ? 0.34 : 0.38);

    occultContext.save();
    occultContext.translate(cx, cy);
    occultContext.globalCompositeOperation = "lighter";

    for (let i = 0; i < 5; i += 1) {
      const pulse = Math.sin(t * 0.9 + i * 0.72) * 0.5 + 0.5;
      const radius = baseRadius * (0.42 + i * 0.15 + pulse * 0.014);

      occultContext.beginPath();
      occultContext.strokeStyle = `rgba(120, 255, 214, ${0.045 - i * 0.004})`;
      occultContext.lineWidth = i === 0 ? 1.4 : 0.9;
      occultContext.arc(0, 0, radius, 0, Math.PI * 2);
      occultContext.stroke();
    }

    drawSigilLayer(occultContext, baseRadius * 0.86, 7, t * 0.085, 0.08);
    drawSigilLayer(occultContext, baseRadius * 0.62, 5, -t * 0.12, 0.07);
    drawSigilLayer(occultContext, baseRadius * 0.35, 3, t * 0.18 + Math.PI * 0.33, 0.09);

    occultContext.font = "11px Courier New, monospace";
    occultContext.textAlign = "center";
    occultContext.textBaseline = "middle";

    for (const mark of sigilMarks) {
      const angle = mark.angle + t * mark.drift + Math.sin(t * 0.3 + mark.phase) * 0.015;
      const inner = mark.distance * 0.72;
      const outer = inner + mark.length;
      const x1 = Math.cos(angle) * inner;
      const y1 = Math.sin(angle) * inner;
      const x2 = Math.cos(angle) * outer;
      const y2 = Math.sin(angle) * outer;
      const shimmer = 0.035 + (Math.sin(t * 1.6 + mark.phase) * 0.5 + 0.5) * 0.055;

      occultContext.strokeStyle = `rgba(159, 255, 213, ${shimmer})`;
      occultContext.beginPath();
      const markGlitch = Math.sin(t * 5.2 + mark.phase * 9) > 0.9;
      const jitterX = markGlitch ? randomBetween(-3, 3) : 0;
      const jitterY = markGlitch ? randomBetween(-2, 2) : 0;
      occultContext.moveTo(x1 + jitterX, y1 + jitterY);
      occultContext.lineTo(x2 + jitterX, y2 + jitterY);
      occultContext.stroke();

      if (markGlitch) {
        occultContext.strokeStyle = "rgba(255, 79, 210, 0.08)";
        occultContext.beginPath();
        occultContext.moveTo(x1 - jitterX * 1.7, y1);
        occultContext.lineTo(x2 - jitterX * 1.7, y2);
        occultContext.stroke();
      }

      if (mark.label) {
        occultContext.save();
        occultContext.translate(Math.cos(angle) * (outer + 18), Math.sin(angle) * (outer + 18));
        occultContext.rotate(angle + Math.PI * 0.5);
        occultContext.fillStyle = `rgba(180, 255, 224, ${shimmer * 1.35})`;
        drawGlitchedText(occultContext, mark.label, t + mark.phase, shimmer * 12);
        occultContext.restore();
      }
    }

    occultContext.restore();

    drawOccultFog(occultContext, width, height, t, cx, cy);

    const reactionGlow = occultContext.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      ritualForce.radius * 1.18
    );
    reactionGlow.addColorStop(0, `rgba(220, 255, 236, ${0.18 * ritualForce.energy})`);
    reactionGlow.addColorStop(0.28, `rgba(106, 255, 210, ${0.08 * ritualForce.energy})`);
    reactionGlow.addColorStop(0.72, `rgba(0, 255, 188, ${0.025 * ritualForce.energy})`);
    reactionGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    occultContext.fillStyle = reactionGlow;
    occultContext.fillRect(0, 0, width, height);

    drawOmenBursts(occultContext, width, height, t);
    drawInterferenceCuts(occultContext, width, height, t);

    occultContext.save();
    occultContext.globalCompositeOperation = "source-over";
    for (let y = ((t * 16) % 18) - 18; y < height; y += 18) {
      occultContext.fillStyle = "rgba(150, 255, 218, 0.018)";
      occultContext.fillRect(0, y, width, 1);
    }

    for (let i = 0; i < 18; i += 1) {
      const x = (Math.sin(t * 0.21 + i * 4.8) * 0.5 + 0.5) * width;
      const alpha = 0.012 + (i % 3) * 0.006;
      occultContext.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      occultContext.fillRect(x, 0, 1, height);
    }
    occultContext.restore();

    requestAnimationFrame(drawOccultCanvas);
  }

  function updatePointer(clientX, clientY) {
    const deltaX = clientX - pointer.x;
    const deltaY = clientY - pointer.y;
    const speed = Math.min(Math.hypot(deltaX, deltaY), 160);

    pointer.x = clientX;
    pointer.y = clientY;
    ritualForce.energy = Math.max(0.42, Math.min(1, speed / 46));
    ritualForce.radius = Math.min(window.innerWidth, window.innerHeight) * (0.18 + ritualForce.energy * 0.16);
  }

  if (occultCanvas && occultContext) {
    setupOccultCanvas();
    requestAnimationFrame(drawOccultCanvas);
    window.addEventListener("resize", setupOccultCanvas);
    window.addEventListener("mousemove", (event) => {
      updatePointer(event.clientX, event.clientY);
    });
    window.addEventListener("touchmove", (event) => {
      const touch = event.touches[0];
      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    }, { passive: true });
  }

  window.setInterval(cycleGhostField, 2400);

  const typeLines = [...document.querySelectorAll("[data-typewriter]")];

  function typeLine(element, speed = 40) {
    return new Promise((resolve) => {
      const text = element.textContent;
      element.textContent = "";
      element.dataset.text = "";

      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text[i];
          element.dataset.text = element.textContent;
          i++;
          setTimeout(type, speed);
          return;
        }

        resolve();
      }

      type();
    });
  }

  async function runTypeSequence() {
    for (const line of typeLines) {
      await typeLine(line);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
  }

  if (typeLines.length > 0) {
    runTypeSequence();
  }

  const moth = document.getElementById("mothHome");
  if (moth) {
    moth.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (window.particlesJS) {
    particlesJS.load('particles-js', './assets/particles.json');
  }

});
