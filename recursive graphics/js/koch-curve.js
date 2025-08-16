// Koch Curve implementation
// The Koch curve is created by recursively replacing each line segment
// with four segments that form a triangular "bump"

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

export function drawKochSegment(ctx, x1, y1, x2, y2, depth) {
  if (depth < 1) {
    // Base case: draw a straight line
    drawLine(ctx, x1, y1, x2, y2);
    return;
  }
  
  // Calculate the direction vector
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // Calculate the five key points for the Koch curve segment
  // Point A: start point (x1, y1)
  // Point B: 1/3 along the line
  const bx = x1 + dx / 3;
  const by = y1 + dy / 3;
  
  // Point C: 2/3 along the line
  const cx = x1 + (2 * dx) / 3;
  const cy = y1 + (2 * dy) / 3;
  
  // Point D: the peak of the equilateral triangle
  // Rotate the vector (bx->cx) by 60 degrees and scale to form equilateral triangle
  const segmentDx = cx - bx;
  const segmentDy = cy - by;
  
  // Rotate -60 degrees (clockwise) to flip the spikes upwards
  // cos(-60°) = 0.5, sin(-60°) = -√3/2 ≈ -0.866
  const cos60 = 0.5;
  const sin60 = -Math.sqrt(3) / 2;

  const rotatedDx = segmentDx * cos60 - segmentDy * sin60;
  const rotatedDy = segmentDx * sin60 + segmentDy * cos60;

  const dx_peak = bx + rotatedDx;
  const dy_peak = by + rotatedDy;
  
  // Point E: end point (x2, y2)
  
  // Recursively draw the four segments
  drawKochSegment(ctx, x1, y1, bx, by, depth - 1);           // A to B
  drawKochSegment(ctx, bx, by, dx_peak, dy_peak, depth - 1); // B to D (peak)
  drawKochSegment(ctx, dx_peak, dy_peak, cx, cy, depth - 1); // D (peak) to C
  drawKochSegment(ctx, cx, cy, x2, y2, depth - 1);           // C to E
}

// Wrapper function to match the expected interface
export function drawKoch(ctx, x, y, size, depth) {
  if (depth < 1) return;
  
  // Start with a horizontal line centered at (x, y)
  const startX = x - size / 2;
  const startY = y;
  const endX = x + size / 2;
  const endY = y;
  
  ctx.beginPath();
  drawKochSegment(ctx, startX, startY, endX, endY, depth);
  ctx.stroke();
}
