function drawH(ctx, x, y, size) {
  const half = size / 2;
  ctx.moveTo(x - half, y - half); ctx.lineTo(x - half, y + half);
  ctx.moveTo(x + half, y - half); ctx.lineTo(x + half, y + half);
  ctx.moveTo(x - half, y); ctx.lineTo(x + half, y);
}

export function drawRecursiveH(ctx, x, y, size, depth) {
  if (depth < 1) return;
  drawH(ctx, x, y, size);
  if (depth > 1) {
    const half = size / 2;
    [-1, 1].forEach(dx => [-1, 1].forEach(dy => 
      drawRecursiveH(ctx, x + dx * half, y + dy * half, half, depth - 1)
    ));
  }
}