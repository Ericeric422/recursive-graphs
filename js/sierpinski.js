function drawTriangle(ctx, x1, y1, x2, y2, x3, y3) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x1, y1);
}

export function drawSierpinski(ctx, x, y, size, depth) {
  if (depth < 1) return;
  
  // Calculate the three vertices of the main triangle
  const height = (size * Math.sqrt(3)) / 2;
  const x1 = x;
  const y1 = y - height / 2;
  const x2 = x - size / 2;
  const y2 = y + height / 2;
  const x3 = x + size / 2;
  const y3 = y + height / 2;
  
  if (depth === 1) {
    // Base case: draw the triangle
    drawTriangle(ctx, x1, y1, x2, y2, x3, y3);
  } else {
    // Recursive case: draw three smaller triangles
    const newSize = size / 2;
    const newHeight = height / 2;
    
    // Top triangle
    drawSierpinski(ctx, x, y - newHeight / 2, newSize, depth - 1);
    
    // Bottom left triangle
    drawSierpinski(ctx, x - newSize / 2, y + newHeight / 2, newSize, depth - 1);
    
    // Bottom right triangle
    drawSierpinski(ctx, x + newSize / 2, y + newHeight / 2, newSize, depth - 1);
  }
}
