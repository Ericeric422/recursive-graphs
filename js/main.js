import { drawRecursiveH } from './fractal-h.js';
import { drawSierpinski } from './sierpinski.js';
import { drawDragon } from './dragon-curve.js';
import { drawKoch } from './koch-curve.js';
import { drawHilbert } from './hilbert.js';
import { drawPythagoras } from './pythagoras-tree.js';
import { drawBinaryTree } from './binary-tree.js';
import { initMenu } from './menu.js';
import { initCanvas } from './canvas.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentFractal = drawRecursiveH; // Default fractal
  const select = document.getElementById('iteration-select');
  const resetBtn = document.getElementById('reset-view-btn');
  const canvasApi = initCanvas(() => currentFractal);

  const MAX_ITER = { dragon: 15, hilbert: 9, pythagoras: 11, binary: 12, default: 8 };

  function redraw(animate = true) {
    const iteration = parseInt(select.value, 10) || 1;
    select.value = iteration;
    canvasApi.drawSelectedIteration(iteration, animate);
  }

  function updateIterationOptions(fractalType) {
    const currentValue = parseInt(select.value, 10) || 1;
    const maxIterations = MAX_ITER[fractalType] || MAX_ITER.default;
    select.innerHTML = '';
    for (let i = 1; i <= maxIterations; i++) {
      select.innerHTML += `<option value="${i}">${i}</option>`;
    }
    select.value = currentValue <= maxIterations ? currentValue : 1;
  }

  function switchFractal(fractalType) {
    const fractalMap = {
      h: drawRecursiveH,
      sierpinski: drawSierpinski,
      dragon: drawDragon,
      koch: drawKoch,
      hilbert: drawHilbert,
      pythagoras: drawPythagoras,
      binary: drawBinaryTree
    };
    currentFractal = fractalMap[fractalType] || drawRecursiveH;
    updateIterationOptions(fractalType);
    redraw(true);
  }

  initMenu(switchFractal);
  updateIterationOptions('h');
  select.addEventListener('change', () => redraw(true));
  resetBtn.addEventListener('click', () => {
    canvasApi.setOffset(0, 0);
    canvasApi.setScale(1);
    redraw();
  });
  redraw(false);
});
