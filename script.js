let projectMode = false;
let storyMode = false;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

//----------------------------------Loader-------------------------------------------//
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  const words = document.querySelectorAll('.loader-words .w');
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('show'), 1000 + i * 800);
  });
  setTimeout(() => {
    words.forEach((w, i) => {
      setTimeout(() => w.classList.remove('show'), i * 600);
    });
  }, 4000); 
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 7000); 
});

//----------------------------------Navbar Active-------------------------------------------//
const sections = Array.from(document.querySelectorAll('section'));
const dockItems = Array.from(document.querySelectorAll('.dock-item'));
const byId = id => document.querySelector(`#${id}`);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      dockItems.forEach(b =>
        b.classList.toggle(
          'active',
          b.getAttribute('data-target') === `#${entry.target.id}`
        )
      );
    }
  });
}, { threshold: 0.6, root: null });


sections.forEach(s => sectionObserver.observe(s));

//----------------------------------Dock Click-------------------------------------------//
dockItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = btn.getAttribute('data-target');
    const target = sel && document.querySelector(sel);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});


const revealEls = Array.from(document.querySelectorAll('.reveal, [data-reveal]'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));


document.querySelectorAll('.dock-item').forEach(link => {
  link.addEventListener('click', () => {
    document.body.style.transition = 'opacity .25s ease';
    document.body.style.opacity = '0.96';
    setTimeout(() => { document.body.style.opacity = '1'; }, 120);
  });
});

document.querySelectorAll('.sound-click').forEach(btn => {
  btn.addEventListener('click', () => {
    const snd = document.getElementById('click-snd');
    try { snd && snd.play && snd.play(); } catch {}
  });
});

// Accent color switcher
document.querySelectorAll('.swatch').forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.getAttribute('data-accent');
    if (!color) return;
    document.documentElement.style.setProperty('--accent', color);
    try { localStorage.setItem('accent', color); } catch {}
    btn.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
      { duration: 220, easing: 'ease-out' }
    );
  });
});


try {
  const savedAccent = localStorage.getItem('accent');
  if (savedAccent) document.documentElement.style.setProperty('--accent', savedAccent);
  const savedFocus = localStorage.getItem('focus');
  if (savedFocus === 'true') document.body.classList.add('focus-mode');
} catch {}

//----------------------------------Studies-------------------------------------------//
const learningText = document.querySelector('.learning .learning-item p strong');
const subjects = ['WebGL shaders', 'Design tokens', 'GPU text rendering'];
let subjectIdx = 0;
setInterval(() => {
  if (!learningText) return;
  subjectIdx = (subjectIdx + 1) % subjects.length;
  learningText.textContent = subjects[subjectIdx];
}, 5000);

document.querySelectorAll('.timeline .node').forEach(node => {
  node.addEventListener('mouseenter', () => node.setAttribute('aria-expanded', 'true'));
  node.addEventListener('mouseleave', () => node.setAttribute('aria-expanded', 'false'));
  node.addEventListener('focus', () => node.setAttribute('aria-expanded', 'true'));
  node.addEventListener('blur', () => node.setAttribute('aria-expanded', 'false'));
});

//----------------------------------Parallax Background-------------------------------------------//
const parallax = document.querySelector('#studies .parallax-bg');
if (parallax && !reduceMotion) {
  window.addEventListener('scroll', () => {
    const rect = byId('studies')?.getBoundingClientRect();
    if (!rect) return;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    parallax.style.transform = `translateY(${(progress - 0.5) * 24}px)`;
  }, { passive: true });
}


//----------------------------------Topbar Time + Like-------------------------------------------//
const timeNow = document.getElementById('time-now');
function updateTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  timeNow && (timeNow.textContent = `${hh}:${mm}`);
}
updateTime();
setInterval(updateTime, 1000);

const likeBtn = document.querySelector('.like-btn');
likeBtn?.addEventListener('click', () => {
  const pressed = likeBtn.getAttribute('aria-pressed') === 'true';
  likeBtn.setAttribute('aria-pressed', String(!pressed));
});




//----------------------------------Sidebar + Dock Toggle (Responsive)-------------------------------------------//
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const dock = document.querySelector('.dock');
const dockToggle = document.querySelector('.dock-toggle');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    const isActive = sidebar.classList.toggle('active');
    sidebarToggle.textContent = isActive ? '🙅🏻' : '🔗';
  });
}

if (dockToggle && dock) {
  dockToggle.addEventListener('click', () => {
    const isActive = dock.classList.toggle('active');
    dockToggle.textContent = isActive ? '🙅🏻' : '💠';
  });
}

//----------------------------------Top Progress Bar-------------------------------------------//
const progress = document.querySelector('.progressbar');
if (progress) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, y / max));
    progress.style.width = `${p * 100}%`;
  }, { passive: true });
}

//----------------------------------Particles Background-------------------------------------------//
const canvas = document.getElementById('particles');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let w, h; const DPR = Math.min(2, window.devicePixelRatio || 1);
  const P = [];
  function resize() {
    w = canvas.width = innerWidth * DPR;
    h = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  function spawn(n=60) {
    for (let i=0;i<n;i++){
      P.push({ x: Math.random()*w, y: Math.random()*h, r: 1 + Math.random()*2, vx: -0.2 + Math.random()*0.4, vy: -0.2 + Math.random()*0.4, a: 0.08 + Math.random()*0.12 });
    }
  }
  function hexToRgba(hex, a) {
    const c = hex.replace('#','');
    const bigint = parseInt(c,16);
    const r=(bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255;
    return `rgba(${r},${g},${b},${a})`;
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    for (const p of P){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
      g.addColorStop(0, hexToRgba(accent, p.a));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  resize(); spawn(60); tick();
  window.addEventListener('resize', resize);
}

//----------------------------------Story Section-------------------------------------------//
const storyCards = document.querySelectorAll('.story-card[data-story]');
const storyModal = document.getElementById('storyModal');
const storyImg = document.querySelector('.story-img');
const storyCaption = document.querySelector('.story-caption');
const storyProgress = document.querySelector('.progress-bar');
const closeStory = document.querySelector('.close-story');

const storyData = {
  s1: { img: '/assets/images/python.jpeg', caption: 'My Python snippets in production 🐍' },
  s2: { img: '/assets/images/flask.jpeg', caption: '💡Building Flask apps with real-time APIs ⚙️' },
  s3: { img: '/assets/images/web_development.jpg', caption: 'UI Design inspirations and component ideas🩷 ' },
  s4: { img: '/assets/images/sql.jpeg', caption: 'My Python snippets in production 🐍' },
};

storyCards.forEach(card => {
  card.addEventListener('click', () => {

    projectMode = false;
    storyMode = true;

    storyModal.classList.remove("project-mode");

    const id = card.dataset.story;
    const data = storyData[id];

    storyImg.src = data.img;
    storyCaption.textContent = data.caption;

    document.querySelector(".story-desc").style.display = "none";
    document.querySelector(".story-link").style.display = "none";

    storyModal.classList.add("active");
  });
});




// Close modal
closeStory.addEventListener('click', () => {
  storyModal.classList.remove('active');
  storyProgress.style.width = '0%';
});



//----------------------------------Auto-Move Project Journey-------------------------------------------//
const projectCar = document.getElementById("projectCar");
const projectNextBtn = document.getElementById("nextJourney");

const projectStoryModal = document.getElementById("storyModal");
const projectStoryImg = projectStoryModal.querySelector(".story-img");
const projectStoryCaption = projectStoryModal.querySelector(".story-caption");
const projectCloseBtn = projectStoryModal.querySelector(".close-story");


const projectStops = [
  {
    id: "dot1",
    title: "Creative Portfolio",
    img: "/assets/images/Project_1.png",
    desc: "A fully animated creative portfolio with smooth UI interactions.",
    link: "https://arunx.web.app/"
  },
  {
    id: "dot2",
    title: "Utility_pay - Payment App",
    img: "/assets/images/Project_2.png",
    desc: "Payment App built with Flask, handling jwt authentication and Razor Pay .",
    link: "https://github.com/the-arun-official/Utility_Payment_App.git"
  }
];

let currentProjectStop = -1;

projectNextBtn.addEventListener("click", async () => {
  projectMode = true;
  storyMode = false;
  currentProjectStop = -1;
  projectNextBtn.textContent = "Journey Started 🕊️";
  projectCar.style.opacity = 1;

  // Move to the first stop
  await moveProjectCarTo(projectStops[0].id);
  openProjectStory(projectStops[0]);
});

projectCloseBtn.addEventListener("click", async () => {

  if (storyMode && !projectMode) {
    storyModal.classList.remove("active");
    return;
  }

  storyModal.classList.remove("active");
  await delay(300);

  currentProjectStop++;

  if (currentProjectStop < projectStops.length - 1) {
    await moveProjectCarTo(projectStops[currentProjectStop + 1].id);
    openProjectStory(projectStops[currentProjectStop + 1]);
  } else {
    await moveProjectCarOut();
    projectNextBtn.textContent = "Start Again 🕊️";
    projectNextBtn.disabled = false;
    currentProjectStop = -1;
  }
});



function moveProjectCarTo(dotId) {
  return new Promise((resolve) => {
    const dot = document.getElementById(dotId);
    if (!dot || !projectCar) return resolve();

    const currentLeft = projectCar.getBoundingClientRect().left;
    const dotRect = dot.getBoundingClientRect();
    const targetLeft = dotRect.left + dotRect.width / 1.5 - projectCar.offsetWidth / 1.5;

    const minLeft = 10;
    const maxLeft = window.innerWidth - projectCar.offsetWidth - 10;
    const safeLeft = Math.min(Math.max(targetLeft, minLeft), maxLeft);
    projectCar.style.position = "fixed";
    projectCar.style.right = "auto";
    projectCar.style.transition = "left 2.2s ease-in-out";
    projectCar.style.left = `${safeLeft}px`;

    setTimeout(resolve, 2300);
  });
}

function moveProjectCarOut() {
  return new Promise((resolve) => {
    projectCar.style.transition = "left 2.5s ease-in-out, opacity 1s ease";
    projectCar.style.left = "95%";
    setTimeout(() => (projectCar.style.opacity = 0), 1000);
    setTimeout(resolve, 3000);
  });
}

function openProjectStory(stop) {
  projectMode = true;
  storyModal.classList.add("project-mode");

  projectStoryImg.src = stop.img;
  projectStoryCaption.textContent = stop.title;

  const desc = document.querySelector(".story-desc");
  const link = document.querySelector(".story-link");

  desc.textContent = stop.desc || "";
  link.href = stop.link || "#";

  desc.style.display = "block";
  link.style.display = "inline-block";

  storyModal.classList.add("active");
}




function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));  
}

window.onload = () => {

  const pudgy = document.getElementById("pudgy");
  const title = document.getElementById("bigTitle");
  const scene = document.getElementById("scene");

  if (title) {
    const text = title.textContent;
    title.textContent = "";

    text.split("").forEach(ch => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      title.appendChild(span);
    });

    title.style.opacity = "1";

    const letters = [...title.querySelectorAll("span")];

    function expandRect(rect, px = 8) {
      return {
        top: rect.top - px,
        right: rect.right + px,
        bottom: rect.bottom + px,
        left: rect.left - px
      };
    }

    function intersects(a, b) {
      return !(
        b.left > a.right ||
        b.right < a.left ||
        b.top > a.bottom ||
        b.bottom < a.top
      );
    }

    function resetText() {
      letters.forEach(span => span.classList.remove("revealed"));
    }

    pudgy?.addEventListener("animationiteration", resetText);

    function loop() {
      const pudRaw = pudgy.getBoundingClientRect();
      const pudRect = expandRect(pudRaw, Math.max(6, pudRaw.width * 0.06));

      letters.forEach(span => {
        if (!span.classList.contains("revealed")) {
          const r = span.getBoundingClientRect();
          if (r.right < 0 || r.left > window.innerWidth) return;

          const letterRect = {
            top: r.top,
            right: r.right,
            bottom: r.bottom,
            left: r.left
          };

          if (intersects(pudRect, letterRect)) {
            span.classList.add("revealed");
          }
        }
      });

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  document.querySelectorAll(".skill-planet").forEach(p => {
    p.textContent = p.dataset.skill;
  });
};

const facts = [
  "I design interfaces that feel alive — movement and timing matter more than color.",
  "I solve problems by simplifying, not adding more features.",
  "I love products that think for the user, not the other way around.",
  "If something feels off by 1 pixel, I WILL notice.",
  "I believe good UI should be invisible and good UX should feel obvious.",
  "My best ideas come at 2:17 AM for no reason.",
  "I prefer clean architecture over quick hacks — even under pressure.",
  "I chase the feeling of 'wow this feels smooth' in every project.",
  "Clarity > cleverness. Consistency > chaos.",
  "Building something meaningful matters more than being perfect."
];

let index = 0;

const factBox = document.getElementById("factBox");
const prevBtn = document.getElementById("prevFact");
const nextBtn = document.getElementById("nextFact");

function updateFact() {
  factBox.classList.add("fade-out");
  
  setTimeout(() => {
    factBox.textContent = facts[index];
    factBox.classList.remove("fade-out");
    factBox.classList.add("fade-in");

    setTimeout(() => {
      factBox.classList.remove("fade-in");
    }, 300);

  }, 200);
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % facts.length;
  updateFact();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + facts.length) % facts.length;
  updateFact();
});

// Auto-rotate every 4 seconds
setInterval(() => {
  index = (index + 1) % facts.length;
  updateFact();
}, 4000);

// Initial fact load
updateFact();
