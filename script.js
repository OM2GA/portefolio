
const toggle = document.getElementById("dark-mode-toggle");
const toggleSide = document.getElementById("dark-mode-toggle-side");
const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
const saved = localStorage.getItem('theme');


function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  if (toggle) toggle.checked = theme === 'dark';
  if (toggleSide) toggleSide.checked = theme === 'dark';
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


if (toggle) {
  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    const theme = isDark ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  });
}

if (toggleSide) {
  toggleSide.addEventListener("change", () => {
    const isDark = toggleSide.checked;
    const theme = isDark ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  });
}


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


  if (appBar && sideMenu) {
    // Si le menu mobile est ouvert, on ne fait RIEN (on laisse le header visible)
    if (document.querySelector('.nav-content.active')) {
      return;
    }

    if (currentScroll > 50) {
      appBar.style.transform = 'translateY(-100%)';
      sideMenu.classList.remove('hidden');
    } else {
      appBar.style.transform = 'translateY(0)';
      sideMenu.classList.add('hidden');
    }
  }


  document.querySelectorAll('.tooltip').forEach(el => el.classList.remove('show-label'));
  clearTimeout(scrollTimeout);


  scrollTimeout = setTimeout(() => {
    if (currentScroll > 50) {
      document.querySelectorAll('.tooltip').forEach(el => el.classList.add('show-label'));
    }
  }, 700);

  scrollTimeout = setTimeout(() => {
    if (currentScroll > 50) {
      document.querySelectorAll('.tooltip').forEach(el => el.classList.add('show-label'));
    }
  }, 700);

  lastScrollTop = currentScroll;
});

// === FIX: Empêcher le transform CSS de casser le position:fixed du menu mobile ===
// Lorsque le menu est ouvert, on doit forcer le header à ne pas avoir de transform
// pour que le menu puisse s'afficher en plein écran correctement.


window.addEventListener('load', () => {
  if (window.scrollY > 50) {
    if (sideMenu) sideMenu.classList.remove('hidden');
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

// === Gestion du bouton copier l'email ===
const contactBtn = document.querySelector(".btn-contact");
const copyIcon = document.querySelector(".icon-copy");

if (contactBtn && copyIcon) {
  contactBtn.addEventListener("click", () => {
    const email = "maxence.coste.mc@gmail.com";

    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        // Animation de l'icône
        copyIcon.style.transform = "scale(1.4)";
        setTimeout(() => {
          copyIcon.style.transform = "scale(1)";
        }, 200);

        // Feedback visuel (changement d'icône et titre)
        const originalTitle = copyIcon.getAttribute("title");
        const originalSrc = copyIcon.getAttribute("src");

        copyIcon.setAttribute("title", "Email copié !");
        copyIcon.setAttribute("src", "images/icons/check.svg");

        setTimeout(() => {
          copyIcon.setAttribute("title", originalTitle);
          copyIcon.setAttribute("src", originalSrc);
        }, 2000);
      }).catch(err => {
        console.error("Erreur copie :", err);
      });
    } else {
      // Fallback simple
      alert("Copie impossible (contexte sécurisé requis). Email : " + email);
    }
  });
}





// === Back to Top Visibility ===
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }
});

// === Burger Menu Logic ===
const burgerMenu = document.querySelector('.burger-menu');
const navContent = document.querySelector('.nav-content');

if (burgerMenu && navContent) {
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navContent.classList.toggle('active');

    const isActive = navContent.classList.contains('active');
    document.body.style.overflow = isActive ? 'hidden' : '';

    // FIX: Si le menu est ouvert, on enlève le transform du header
    if (appBar) {
      if (isActive) {
        appBar.style.transform = 'none';
        appBar.style.transition = 'none'; // Désactiver la transition pour éviter le lag visuel
      } else {
        appBar.style.transform = ''; // Rétablir le comportement par défaut
        appBar.style.transition = '';
      }
    }
  });

  // Close menu when clicking a link
  navContent.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navContent.classList.remove('active');
      document.body.style.overflow = '';

      // Rétablir le header
      if (appBar) {
        appBar.style.transform = '';
        appBar.style.transition = '';
      }
    });
  });
}
