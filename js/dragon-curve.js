// Dragon curve implementation
// The dragon curve is created by recursively replacing each line segment
// with two segments that form a 90-degree turn

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

export function drawDragonCurve(ctx, x1, y1, x2, y2, depth, direction = 1) {
  if (depth < 1) {
    // Base case: draw a straight line
    drawLine(ctx, x1, y1, x2, y2);
    return;
  }
  
  // Calculate the midpoint
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Calculate the perpendicular point for the fold
  // The direction determines which way to fold (left or right)
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // Rotate 90 degrees and scale by sqrt(2)/2 to maintain proper proportions
  const perpX = midX + direction * (-dy) / 2;
  const perpY = midY + direction * (dx) / 2;
  
  // Recursively draw the two halves
  // First half: from start to fold point (always fold right)
  drawDragonCurve(ctx, x1, y1, perpX, perpY, depth - 1, 1);
  
  // Second half: from fold point to end (always fold left)
  drawDragonCurve(ctx, perpX, perpY, x2, y2, depth - 1, -1);
}

// Wrapper function to match the expected interface
export function drawDragon(ctx, x, y, size, depth) {
  if (depth < 1) return;
  
  // Start with a horizontal line centered at (x, y)
  const startX = x - size / 2;
  const startY = y;
  const endX = x + size / 2;
  const endY = y;

  // Delegate only path construction; caller is responsible for beginPath()/stroke()
  drawDragonCurve(ctx, startX, startY, endX, endY, depth);
}
