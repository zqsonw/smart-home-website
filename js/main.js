/**
 * 智能家居官网 - 主脚本
 */

// ============ 页面导航 ============
function showPage(pageId, clickedLink) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // 激活目标页面
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // 更新导航链接高亮
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.remove('active'));
  if (clickedLink) {
    clickedLink.classList.add('active');
  } else {
    const link = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
    if (link) link.classList.add('active');
  }

  // 关闭移动端菜单
  document.querySelector('.nav-links')?.classList.remove('open');

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ 导航链接绑定 ============
document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page, link);
  });
});

// 页面内链接（如 Hero 按钮）
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(el.dataset.goto);
  });
});

// ============ 导航栏滚动效果 ============
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ============ 移动端汉堡菜单 ============
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks?.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// ============ FAQ 折叠 ============
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // 关闭所有
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    // 若原来是关着的则打开
    if (!isOpen) item.classList.add('open');
  });
});

// ============ 数字滚动动画 ============
function animateNumber(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, step);
}

// 交叉观察器触发数字动画
const statNums = document.querySelectorAll('.stat-num[data-target]');
if (statNums.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateNumber(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
}

// ============ 卡片入场动画 ============
const fadeEls = document.querySelectorAll('.card, .product-card, .faq-item, .channel-card, .team-card, .info-block, .timeline-item');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    io.observe(el);
  });
}

// ============ 初始化：显示首页 ============
showPage('home');
