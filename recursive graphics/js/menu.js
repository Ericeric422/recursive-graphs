export function initMenu(switchFractal) {
  const menuBtn = document.getElementById('menu-btn');
  const sideMenu = document.getElementById('side-menu');
  const backBtn = document.getElementById('back-btn');

  menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('open');
    menuBtn.style.display = 'none';
    backBtn.style.display = 'block';
  });

  backBtn.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    menuBtn.style.display = 'flex';
    backBtn.style.display = 'none';
  });

  // Hide back button by default
  backBtn.style.display = 'none';

  const graphButtons = document.querySelectorAll('.graph-option');
  // Set the first as active by default
  if (graphButtons.length) graphButtons[0].classList.add('active');

  // Use event delegation for graph-option clicks
  sideMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('.graph-option');
    if (!btn) return;
    graphButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const graphType = btn.getAttribute('data-graph');
    sideMenu.classList.remove('open');
    menuBtn.style.display = 'flex';
    backBtn.style.display = 'none';
    if (switchFractal) switchFractal(graphType);
  });
}
