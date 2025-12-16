
const toggle = document.getElementById("dark-mode-toggle");
const toggleSide = document.getElementById("dark-mode-toggle-side");
const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
const saved = localStorage.getItem('theme');


function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  toggle.checked = theme === 'dark';
  toggleSide.checked = theme === 'dark';
}


if (saved) {
  applyTheme(saved);
} else {
  applyTheme(prefersDarkQuery.matches ? 'dark' : 'light');
}


prefersDarkQuery.addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});


toggle.addEventListener("change", () => {
  const isDark = toggle.checked;
  const theme = isDark ? 'dark' : 'light';
  applyTheme(theme);
  localStorage.setItem('theme', theme);
});

toggleSide.addEventListener("change", () => {
  const isDark = toggleSide.checked;
  const theme = isDark ? 'dark' : 'light';
  applyTheme(theme);
  localStorage.setItem('theme', theme);
});


document.querySelectorAll(".ripple").forEach(el => {
  el.addEventListener("click", e => {
    const ripple = document.createElement("span");
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      position:absolute;background:var(--ripple);
      transform:scale(0);animation:ripple 0.6s linear;
      pointer-events:none;border-radius:50%;
    `;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(4); opacity: 0; } }`;
document.head.appendChild(style);

document.querySelectorAll('.nav-links a, .side-menu a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');

    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
      }
    }

  });
});



const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

document.querySelectorAll("section").forEach(sec => {
  sec.classList.add("fade-in");
  observer.observe(sec);
});




const appBar = document.querySelector('.app-bar');
const sideMenu = document.querySelector('.side-menu');
let scrollTimeout;
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;


  if (currentScroll > 50) {
    appBar.style.transform = 'translateY(-100%)';
    sideMenu.classList.remove('hidden');
  } else {

    appBar.style.transform = 'translateY(0)';
    sideMenu.classList.add('hidden');
  }


  document.querySelectorAll('.tooltip').forEach(el => el.classList.remove('show-label'));
  clearTimeout(scrollTimeout);


  scrollTimeout = setTimeout(() => {
    if (currentScroll > 50) {
      document.querySelectorAll('.tooltip').forEach(el => el.classList.add('show-label'));
    }
  }, 700);

  lastScrollTop = currentScroll;
});


window.addEventListener('load', () => {
  if (window.scrollY > 50) {
    sideMenu.classList.remove('hidden');
    document.querySelectorAll('.tooltip').forEach(el => el.classList.add('show-label'));
  }
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");
const sideLinks = document.querySelectorAll(".side-menu a");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollPos = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      current = sec.getAttribute("id");
    }
  });


  sideLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});


