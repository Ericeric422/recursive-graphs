// Hilbert curve using recursive mapping (xi, xj, yi, yj) method

function collectHilbertPoints(points, x0, y0, xi, xj, yi, yj, n) {
  if (n <= 0) {
    const x = x0 + (xi + yi) / 2;
    const y = y0 + (xj + yj) / 2;
    points.push([x, y]);
  } else {
    collectHilbertPoints(points, x0,              y0,              yi/2,  yj/2,  xi/2,  xj/2,  n-1);
    collectHilbertPoints(points, x0 + xi/2,       y0 + xj/2,       xi/2,  xj/2,  yi/2,  yj/2,  n-1);
    collectHilbertPoints(points, x0 + xi/2 + yi/2,y0 + xj/2 + yj/2,xi/2,  xj/2,  yi/2,  yj/2,  n-1);
    collectHilbertPoints(points, x0 + xi/2 + yi,  y0 + xj/2 + yj, -yi/2, -yj/2, -xi/2, -xj/2, n-1);
  }
}

export function drawHilbert(ctx, x, y, size, depth) {
  if (depth < 1) return;
  const half = size / 2;
  const x0 = x - half;
  const y0 = y - half;
  const points = [];
  collectHilbertPoints(points, x0, y0, size, 0, 0, size, depth);
  if (points.length === 0) return;
  const [sx, sy] = points[0];
  ctx.moveTo(sx, sy);
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i];
    ctx.lineTo(px, py);
  }
}

