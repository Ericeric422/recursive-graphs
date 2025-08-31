// Simple binary tree fractal with line segments

function drawSegment(ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

export function drawBinaryTree(ctx, x, y, size, depth, angle = -Math.PI/2) {
  if (depth < 1 || size <= 0.5) return;
  const x2 = x + size * Math.cos(angle);
  const y2 = y + size * Math.sin(angle);
  drawSegment(ctx, x, y, x2, y2);
  if (depth === 1) return;
  const nextSize = size * 0.67;
  const spread = Math.PI / 6; // 30 degrees
  drawBinaryTree(ctx, x2, y2, nextSize, depth - 1, angle - spread);
  drawBinaryTree(ctx, x2, y2, nextSize, depth - 1, angle + spread);
}

