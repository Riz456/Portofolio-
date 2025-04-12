// Mobile Menu Functions
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('show');
  navOverlay.classList.toggle('show');
  
  // Update ARIA attributes
  navToggle.setAttribute('aria-expanded', isOpen);
  
  // Change menu icon with animation
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars', !isOpen);
  icon.classList.toggle('fa-times', isOpen);
  
  // Toggle body scroll
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  navLinks.classList.remove('show');
  navOverlay.classList.remove('show');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
  document.body.style.overflow = '';
}

// Initialize menu functionality
function initMenu() {
  if (!navToggle || !navLinks || !navOverlay) return;
  
  navToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking on nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu when pressing ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('show')) {
      closeMenu();
    }
  });
}
// Tech Background Animation
function initTechCanvas() {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId;
  let dots = [];
  
  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Grid parameters
    const gridSize = Math.max(30, Math.min(50, window.innerWidth / 20));
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    
    // Create grid dots
    dots = Array.from({ length: cols }, (_, i) =>
      Array.from({ length: rows }, (_, j) => ({
        x: i * gridSize,
        y: j * gridSize,
        size: 1,
        alpha: 0.1
      }))
    );
  }
  
  function animateGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dots
    ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
    dots.forEach((col, i) => {
      col.forEach((dot, j) => {
        ctx.globalAlpha = dot.alpha;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Randomly connect dots
        if (i < dots.length - 1 && j < col.length - 1 && Math.random() > 0.7) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(
            Math.random() > 0.5 ? dots[i+1][j].x : dots[i][j+1].x,
            Math.random() > 0.5 ? dots[i+1][j].y : dots[i][j+1].y
          );
          ctx.stroke();
        }
      });
    });
    
    // Random pulse effect
    if (Math.random() > 0.95) {
      const randomCol = Math.floor(Math.random() * dots.length);
      const randomRow = Math.floor(Math.random() * dots[0].length);
      pulseDot(randomCol, randomRow);
    }
    
    animationId = requestAnimationFrame(animateGrid);
  }
  
  function pulseDot(col, row) {
    const dot = dots[col][row];
    let size = 1;
    const maxSize = 3;
    
    function update() {
      size += 0.1;
      dot.size = size;
      dot.alpha = 0.1 + (size / maxSize) * 0.2;
      
      if (size < maxSize) {
        requestAnimationFrame(update);
      } else {
        shrinkDot(col, row);
      }
    }
    
    update();
  }
  
  function shrinkDot(col, row) {
    const dot = dots[col][row];
    let size = dot.size;
    const maxSize = 3;
    
    function update() {
      size -= 0.1;
      dot.size = size;
      dot.alpha = 0.1 + (size / maxSize) * 0.2;
      
      if (size > 1) {
        requestAnimationFrame(update);
      } else {
        dot.size = 1;
        dot.alpha = 0.1;
      }
    }
    
    update();
  }
  
  // Initialize
  setupCanvas();
  animateGrid();
  
  // Handle window resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      setupCanvas();
      animateGrid();
    }, 200);
  });
  
  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', setupCanvas);
  };
}
// Scroll Animations
function initScrollAnimations() {
  const sections = document.querySelectorAll('section:not(.hero)');
  let ticking = false;
  
  function checkScroll() {
    if (ticking) return;
    ticking = true;
    
    requestAnimationFrame(() => {
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.75;
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < triggerPoint) {
          section.classList.add('animated');
          
          // Handle special sections
          const content = section.querySelector('.skills, .projects, .platform-grid, .motivasi-slider');
          if (content) content.classList.add('animated');
        }
      });
      
      ticking = false;
    });
  }
  
  // Throttled scroll event
  window.addEventListener('scroll', () => {
    requestAnimationFrame(checkScroll);
  });
  
  // Initial check
  checkScroll();
}
// Image Slider
function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  
  const images = document.querySelectorAll('.slider img');
  let index = 0;
  let startX = 0;
  let isDragging = false;
  let autoSlideInterval;
  
  function showSlide(i) {
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(${-i * 100}%)`;
  }
  
  function nextSlide() {
    index = (index + 1) % images.length;
    showSlide(index);
  }
  
  function prevSlide() {
    index = (index - 1 + images.length) % images.length;
    showSlide(index);
  }
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  // Initialize
  showSlide(0);
  startAutoSlide();
  
  // Touch events
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoSlide();
  });
  
  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX;
    const diffX = startX - moveX;
    
    // Show immediate feedback while dragging
    slider.style.transition = 'none';
    slider.style.transform = `translateX(calc(${-index * 100}% - ${diffX}px))`;
  });
  
  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const moveX = e.changedTouches[0].clientX;
    const diffX = startX - moveX;
    
    if (Math.abs(diffX) > 50) {
      diffX > 0 ? nextSlide() : prevSlide();
    } else {
      showSlide(index);
    }
    
    startAutoSlide();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });
  
  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  
  // Cleanup
  return () => {
    stopAutoSlide();
    slider.removeEventListener('mouseenter', stopAutoSlide);
    slider.removeEventListener('mouseleave', startAutoSlide);
  };
}
// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initTechCanvas();
  initScrollAnimations();
  initSlider();
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Set active nav link on scroll
  window.addEventListener('scroll', throttle(setActiveNavLink, 100));
  setActiveNavLink();
  
  // Typewriter Effect
  initTypewriter();
});

// Throttle function for scroll events
function throttle(fn, wait) {
  let lastTime = 0;
  return function() {
    const now = Date.now();
    if (now - lastTime >= wait) {
      fn.apply(this, arguments);
      lastTime = now;
    }
  };
}
// Motivasi Slider Functionality
function initMotivasiSlider() {
  const slider = document.getElementById('motivasiSlider');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const progress = document.querySelector('.scroll-progress');
  
  if (!slider || !prevBtn || !nextBtn) {
    console.error("Elemen slider motivasi tidak ditemukan!");
    return;
  }
  
  // Update scroll indicator
  function updateProgress() {
    if (!progress) return;
    const scrollWidth = slider.scrollWidth - slider.clientWidth;
    const scrollPos = slider.scrollLeft;
    const progressWidth = scrollWidth > 0 ? (scrollPos / scrollWidth) * 100 : 0;
    progress.style.width = `${progressWidth}%`;
  }
  
  // Scroll to specific position
  function scrollToPosition(position, behavior = 'smooth') {
    slider.scrollTo({
      left: position,
      behavior: behavior
    });
  }
  
  // Next button click
  nextBtn.addEventListener('click', () => {
    const card = slider.querySelector('.motivasi-card');
    if (!card) return;
    
    const cardWidth = card.offsetWidth;
    const scrollAmount = slider.scrollLeft + cardWidth + 24; // 24 is gap
    scrollToPosition(scrollAmount);
  });
  
  // Previous button click
  prevBtn.addEventListener('click', () => {
    const card = slider.querySelector('.motivasi-card');
    if (!card) return;
    
    const cardWidth = card.offsetWidth;
    const scrollAmount = slider.scrollLeft - cardWidth - 24; // 24 is gap
    scrollToPosition(scrollAmount);
  });
  
  // Update progress on scroll
  slider.addEventListener('scroll', updateProgress);
  
  // Initialize progress
  updateProgress();
  
  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', updateProgress);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMotivasiSlider();
  
  // Add animation when section is in view
  const motivasiSection = document.querySelector('.motivasi-section');
  if (motivasiSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(motivasiSection);
  }
});