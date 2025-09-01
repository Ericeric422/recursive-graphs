export function initCanvas(getFractalFunction) {
  const canvas = document.getElementById('h-canvas');
  const ctx = canvas.getContext('2d');
  const canvasWrapper = document.querySelector('.canvas-wrapper');
  const iterationSelect = document.getElementById('iteration-select');
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let scale = 1;
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 5;

  // Cached path to avoid recomputing during short-lived animations or repeated draws
  let cachedPath = null;
  let cachedKey = '';

  // rAF batching
  let frameHandle = 0;
  let targetIteration = 1;
  let animateNext = false;
  let animStartTs = 0;
  const ANIM_DURATION_MS = 280;

  function getDisplaySize() {
    return { w: canvas.width / dpr, h: canvas.height / dpr };
  }

  function clearCanvas() {
    // Reset transform to identity for clearing in device pixels
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function buildPathFor(iteration) {
    const fractalFn = getFractalFunction();
    const key = `${fractalFn.name}|${iteration}`;
    if (cachedPath && cachedKey === key) return cachedPath;
    const path = new Path2D();
    const fauxCtx = {
      moveTo: (x, y) => path.moveTo(x, y),
      lineTo: (x, y) => path.lineTo(x, y)
    };
    // Build path centered at origin using size 400 to match existing usage
    fractalFn(fauxCtx, 0, 0, 400, iteration);
    cachedPath = path;
    cachedKey = key;
    return path;
  }

  function internalDraw(alpha) {
    clearCanvas();
    const { w, h } = getDisplaySize();
    // Base styling
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2a3a5e';
    ctx.globalAlpha = alpha;

    // High-DPI transform; subsequent ops are in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.save();
    ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
    ctx.scale(scale, scale);
    const path = buildPathFor(targetIteration);
    ctx.stroke(path);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function requestDraw(iteration, animate = false) {
    targetIteration = iteration;
    animateNext = animate;
    if (frameHandle) return; // already scheduled
    frameHandle = requestAnimationFrame((ts) => {
      frameHandle = 0;
      if (animateNext) {
        animStartTs = ts;
        const step = (now) => {
          const t = Math.min(1, (now - animStartTs) / ANIM_DURATION_MS);
          const eased = t * (2 - t); // easeOutQuad
          internalDraw(eased);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } else {
        internalDraw(1);
      }
    });
  }

  function drawSelectedIteration(iteration, animate = false) {
    requestDraw(iteration, animate);
  }

  function resizeCanvas(iteration) {
    if (!canvasWrapper) return;
    const rect = canvasWrapper.getBoundingClientRect();
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    // Invalidate cached path on resize only if scale of base path changes
    // (base path is independent of pixel size, so we keep it)
    requestDraw(iteration, false);
  }

  // Helper to get current iteration value
  function getCurrentIteration() {
    return iterationSelect ? parseInt(iterationSelect.value, 10) : 0;
  }

  window.addEventListener('resize', () => resizeCanvas(getCurrentIteration()));
  resizeCanvas(getCurrentIteration());



  canvas.addEventListener('mousedown', ({ clientX, clientY }) => {
    isDragging = true;
    lastX = clientX;
    lastY = clientY;
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
    if (!isDragging) return;
    const dx = clientX - lastX;
    const dy = clientY - lastY;
    offsetX += dx;
    offsetY += dy;
    lastX = clientX;
    lastY = clientY;
    // No animation during panning
    drawSelectedIteration(getCurrentIteration(), false);
  });

  ['mouseup', 'mouseleave'].forEach(event => {
    canvas.addEventListener(event, () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    });
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const { offsetX: mouseX, offsetY: mouseY, deltaY } = e;
    const { w, h } = getDisplaySize();
    const wx = (mouseX - w / 2 - offsetX) / scale;
    const wy = (mouseY - h / 2 - offsetY) / scale;
    let newScale = scale * (deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity);
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    offsetX += (scale - newScale) * wx;
    offsetY += (scale - newScale) * wy;
    scale = newScale;
    // No animation during zoom
    drawSelectedIteration(getCurrentIteration(), false);
  }, { passive: false });

  canvas.style.cursor = 'grab';

  return {
    drawSelectedIteration,
    resizeCanvas,
    setOffset: (x, y) => { offsetX = x; offsetY = y; },
    setScale: (s) => { scale = s; },
    getOffset: () => [offsetX, offsetY],
    getScale: () => scale
  };
}
