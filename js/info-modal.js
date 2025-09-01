// Info modal logic and fractal explanations

const FRACTAL_INFO = {
  h: {
    title: 'H Fractal',
    body: `The H Fractal is a simple recursive structure that starts with the letter 'H'. At each iteration, smaller H's are drawn at the four endpoints of the previous H, creating a self-similar, tree-like pattern. This fractal demonstrates the concept of recursion and self-similarity in geometry.`
  },
  dragon: {
    title: 'Dragon Curve',
    body: `The Dragon Curve is a recursive, self-similar fractal that is created by repeatedly folding a strip of paper in half and then unfolding it at right angles. Each iteration adds more complexity, resulting in a beautiful, jagged curve that never crosses itself. The Dragon Curve is famous for its appearance in mathematics and computer graphics.`
  },
  sierpinski: {
    title: 'Sierpinski Triangle',
    body: `The Sierpinski Triangle is a fractal formed by recursively subdividing an equilateral triangle into smaller triangles and removing the central one at each step. This process creates a repeating pattern of triangles within triangles, illustrating the concept of infinite complexity within a finite space.`
  },
  koch: {
    title: 'Koch Curve',
    body: `The Koch Curve is constructed by recursively replacing each line segment with four segments that form a triangular "bump". With each iteration, the curve becomes more intricate, eventually forming the famous snowflake shape when applied to all sides of a triangle. The Koch Curve is a classic example of a mathematical fractal.`
  },
  hilbert: {
    title: 'Hilbert Curve',
    body: `The Hilbert Curve is a space-filling fractal that maps a 1D line into 2D space while preserving locality. At each iteration the path folds to visit every cell in a grid without crossing, producing an elegant, continuous curve.`
  },
  pythagoras: {
    title: 'Pythagoras Tree',
    body: `The Pythagoras Tree is built from squares arranged to form a branching tree. Each square spawns two smaller squares at its top edge, creating a self-similar canopy reminiscent of a stylized tree.`
  },
  binary: {
    title: 'Binary Tree',
    body: `A classic recursive binary tree rendered with line segments. Each branch splits into two smaller branches at a fixed angle, illustrating recursion and geometric decay.`
  }
};


function getCurrentFractalKey() {
  const active = document.querySelector('.graph-option.active') || document.querySelector('.graph-option');
  return active?.getAttribute('data-graph') || 'h';
}


function showInfoModal() {
  const modal = document.getElementById('info-modal');
  if (!modal) return;
  const title = document.getElementById('info-modal-title');
  const body = document.getElementById('info-modal-body');
  const info = FRACTAL_INFO[getCurrentFractalKey()] || FRACTAL_INFO['h'];
  if (title) title.textContent = info.title;
  if (body) body.textContent = info.body;
  modal.style.display = 'flex';
}


function hideInfoModal() {
  const modal = document.getElementById('info-modal');
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('info-modal');
  document.getElementById('info-btn')?.addEventListener('click', showInfoModal);
  document.getElementById('close-info-modal')?.addEventListener('click', hideInfoModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'info-modal') hideInfoModal();
    });
  }
  // Use event delegation for fractal selection
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('.graph-option');
    if (target && modal && modal.style.display !== 'none') {
      showInfoModal();
    }
  });
});
