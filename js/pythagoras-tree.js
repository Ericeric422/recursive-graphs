// Pythagoras tree (outline of squares)

function rotatePoint(px, py, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [px * c - py * s, px * s + py * c];
}

function drawSquare(ctx, cx, cy, size, angle) {
  const half = size / 2;
  // Define square corners around center, then rotate
  const corners = [
    [-half, -half],
    [ half, -half],
    [ half,  half],
    [-half,  half]
  ];
  const rotated = corners.map(([dx, dy]) => rotatePoint(dx, dy, angle));
  const pts = rotated.map(([dx, dy]) => [cx + dx, cy + dy]);
  ctx.moveTo(pts[0][0], pts[0][1]);
  ctx.lineTo(pts[1][0], pts[1][1]);
  ctx.lineTo(pts[2][0], pts[2][1]);
  ctx.lineTo(pts[3][0], pts[3][1]);
  ctx.lineTo(pts[0][0], pts[0][1]);
  return pts; // return corner points for child placement
}

export function drawPythagoras(ctx, x, y, size, depth, angle = -Math.PI/2) {
  if (depth < 1 || size <= 0.5) return;
  // Draw current square centered at (x,y)
  const pts = drawSquare(ctx, x, y, size, angle);

  if (depth === 1) return;
  // Compute top edge midpoint and direction for children
  const topMidX = (pts[0][0] + pts[1][0]) / 2;
  const topMidY = (pts[0][1] + pts[1][1]) / 2;
  const edgeDx = pts[1][0] - pts[0][0];
  const edgeDy = pts[1][1] - pts[0][1];
  const edgeLen = Math.hypot(edgeDx, edgeDy);

  // Child squares sizes (classic right isosceles split)
  const leftSize = edgeLen * Math.SQRT1_2;
  const rightSize = edgeLen * Math.SQRT1_2;

  // Child centers offset from top midpoint
  const leftAngle = Math.atan2(edgeDy, edgeDx) + Math.PI/2; // left branch angle
  const rightAngle = Math.atan2(edgeDy, edgeDx); // right branch along edge

  const leftCx = topMidX + (leftSize/2) * Math.cos(leftAngle);
  const leftCy = topMidY + (leftSize/2) * Math.sin(leftAngle);
  const rightCx = topMidX + (rightSize/2) * Math.cos(rightAngle);
  const rightCy = topMidY + (rightSize/2) * Math.sin(rightAngle);

  drawPythagoras(ctx, leftCx, leftCy, leftSize, depth - 1, leftAngle - Math.PI/2);
  drawPythagoras(ctx, rightCx, rightCy, rightSize, depth - 1, rightAngle - Math.PI/2);
}

