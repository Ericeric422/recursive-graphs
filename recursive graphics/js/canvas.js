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
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 5;

  function drawSelectedIteration(iteration) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.beginPath();
    ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
    ctx.scale(scale, scale);
    getFractalFunction()(ctx, 0, 0, 400, iteration);
    ctx.stroke();
    ctx.restore();
  }

  function resizeCanvas(iteration) {
    if (!canvasWrapper) return;
    const rect = canvasWrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawSelectedIteration(iteration);
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
    drawSelectedIteration(getCurrentIteration());
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
    const wx = (mouseX - canvas.width / 2 - offsetX) / scale;
    const wy = (mouseY - canvas.height / 2 - offsetY) / scale;
    let newScale = scale * (deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity);
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    offsetX += (scale - newScale) * wx;
    offsetY += (scale - newScale) * wy;
    scale = newScale;
    drawSelectedIteration(getCurrentIteration());
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
