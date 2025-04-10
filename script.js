// Mobile Menu Functions
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
  navLinks.classList.toggle('show');
  navOverlay.classList.toggle('show');
  
  // Change menu icon
  const icon = navToggle.querySelector('i');
  if (navLinks.classList.contains('show')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
}

function closeMenu() {
  navLinks.classList.remove('show');
  navOverlay.classList.remove('show');
  navToggle.querySelector('i').classList.remove('fa-times');
  navToggle.querySelector('i').classList.add('fa-bars');
}

// Event listeners for mobile menu
if (navToggle) {
  navToggle.addEventListener('click', toggleMenu);
}

if (navOverlay) {
  navOverlay.addEventListener('click', closeMenu);
}

// Close menu when clicking on nav links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      closeMenu();
    }
  });
});

// Close menu when pressing ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('show')) {
    closeMenu();
  }
});

// Tech Background Animation
const canvas = document.getElementById('techCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Grid parameters
  const gridSize = 40;
  const cols = Math.ceil(canvas.width / gridSize);
  const rows = Math.ceil(canvas.height / gridSize);
  const dots = [];

  // Create grid dots
  for (let i = 0; i < cols; i++) {
    dots[i] = [];
    for (let j = 0; j < rows; j++) {
      dots[i][j] = {
        x: i * gridSize,
        y: j * gridSize,
        size: 1,
        alpha: 0.1
      };
    }
  }

  function animateGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dots
    ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const dot = dots[i][j];
        ctx.globalAlpha = dot.alpha;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Reset alpha
    ctx.globalAlpha = 1;
    
    // Draw connecting lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        if (Math.random() > 0.7) {
          ctx.beginPath();
          ctx.moveTo(dots[i][j].x, dots[i][j].y);
          
          if (Math.random() > 0.5) {
            ctx.lineTo(dots[i+1][j].x, dots[i+1][j].y);
          } else {
            ctx.lineTo(dots[i][j+1].x, dots[i][j+1].y);
          }
          
          ctx.stroke();
        }
      }
    }
    
    // Randomly pulse some dots
    if (Math.random() > 0.95) {
      const randomCol = Math.floor(Math.random() * cols);
      const randomRow = Math.floor(Math.random() * rows);
      pulseDot(randomCol, randomRow);
    }
    
    requestAnimationFrame(animateGrid);
  }

  function pulseDot(col, row) {
    const dot = dots[col][row];
    let size = 1;
    const maxSize = 3;
    
    const pulseInterval = setInterval(() => {
      size += 0.1;
      dot.size = size;
      dot.alpha = 0.1 + (size / maxSize) * 0.2;
      
      if (size >= maxSize) {
        clearInterval(pulseInterval);
        shrinkDot(col, row);
      }
    }, 20);
  }

  function shrinkDot(col, row) {
    const dot = dots[col][row];
    let size = dot.size;
    const maxSize = 3;
    
    const shrinkInterval = setInterval(() => {
      size -= 0.1;
      dot.size = size;
      dot.alpha = 0.1 + (size / maxSize) * 0.2;
      
      if (size <= 1) {
        clearInterval(shrinkInterval);
        dot.size = 1;
        dot.alpha = 0.1;
      }
    }, 20);
  }

  // Start animation
  animateGrid();

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Scroll Animations
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  
  function checkScroll() {
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        section.classList.add('animated');
        
        // Animate skills individually
        if (section.id === 'skills') {
          const skills = section.querySelector('.skills');
          if (skills) skills.classList.add('animated');
        }
        
        // Animate projects individually
        if (section.id === 'projects') {
          const projects = section.querySelector('.projects');
          if (projects) projects.classList.add('animated');
        }
        
        // Animate platforms individually
        if (section.classList.contains('platforms')) {
          const platforms = section.querySelector('.platform-grid');
          if (platforms) platforms.classList.add('animated');
        }
      }
    });
  }
  
  // Run on load and scroll
  checkScroll();
  window.addEventListener('scroll', checkScroll);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Active nav link based on scroll position
function setActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const scrollPosition = window.scrollY + 100;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const id = section.getAttribute('id') || section.classList.value;
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Typewriter Effect
function initTypewriter() {
  const heroText = "Halo, saya Rizky Mustafa Afrino";
  const heroElement = document.querySelector('.hero h1');
  
  if (heroElement) {
    let i = 0;

    function typeWriter() {
      if (i < heroText.length) {
        heroElement.innerHTML = heroText.substring(0, i+1) + '<span aria-hidden="true"></span>';
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start after a delay
    setTimeout(typeWriter, 500);
  }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initTypewriter();
  
  // Set active nav link on scroll
  window.addEventListener('scroll', setActiveNavLink);
  
  // Set initial active link
  setActiveNavLink();
});
const slider = document.querySelector('.slider');
const images = document.querySelectorAll('.slider img');
let index = 0;
let startX = 0;
let isDragging = false;

function showSlide(i) {
  slider.style.transform = `translateX(${-i * 100}%)`;
}

function nextSlide() {
  index = (index + 1) % images.length;
  showSlide(index);
}

let autoSlide = setInterval(nextSlide, 4000); // Ganti gambar tiap 4 detik

// Swipe gesture
slider.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearInterval(autoSlide);
});

slider.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const moveX = e.touches[0].clientX;
  const diffX = startX - moveX;

  if (diffX > 50) {
    index = (index + 1) % images.length;
    showSlide(index);
    isDragging = false;
  } else if (diffX < -50) {
    index = (index - 1 + images.length) % images.length;
    showSlide(index);
    isDragging = false;
  }
});

slider.addEventListener('touchend', () => {
  isDragging = false;
  autoSlide = setInterval(nextSlide, 4000);
});
